import { apiError, apiOk } from '@/lib/apiResponse';
import type { ResetPasswordErrorCode } from '@/lib/authErrors';
import { getClientIp } from '@/lib/clientIp';
import { checkRateLimit } from '@/lib/ratelimit';
import { resetPasswordTokenSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;
const BACKEND_TIMEOUT_MS = 10_000;
const IP_RATE_LIMIT = { max: 10, window: '15 m' } as const;
const TOKEN_RATE_LIMIT = { max: 10, window: '15 m' } as const;

const fail = (
  status: number,
  code: ResetPasswordErrorCode,
  extra?: Record<string, unknown>,
) => apiError<ResetPasswordErrorCode>(status, code, extra);

function isInvalidResetTokenError(body: unknown): boolean {
  if (!body || typeof body !== 'object' || !('error' in body)) return false;
  const error = body.error;
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'INVALID_RESET_TOKEN'
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ipRateLimitResult = await checkRateLimit(
      `validate-reset-token-ip:${getClientIp(request)}`,
      IP_RATE_LIMIT.max,
      IP_RATE_LIMIT.window,
    );
    if (!ipRateLimitResult.success) return fail(429, 'rateLimited');

    const body = await request.json().catch(() => null);
    const result = resetPasswordTokenSchema.safeParse(body);

    if (!result.success) {
      return fail(400, 'invalidData', {
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          code: issue.message,
        })),
      });
    }

    const { token } = result.data;
    const tokenRateLimitResult = await checkRateLimit(
      `validate-reset-token:${token}`,
      TOKEN_RATE_LIMIT.max,
      TOKEN_RATE_LIMIT.window,
    );
    if (!tokenRateLimitResult.success) return fail(429, 'rateLimited');

    if (!API_BASE_URL) {
      console.error('API_BASE_URL no configurada');
      return fail(500, 'serverError');
    }

    let backendResponse: Response;
    try {
      backendResponse = await fetch(
        `${API_BASE_URL}/auth/validate-reset-token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
          cache: 'no-store',
          signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
        },
      );
    } catch (error) {
      console.error('Error de conexión al validar el token:', error);
      return fail(503, 'unavailable');
    }

    const backendBody: unknown = await backendResponse.json().catch(() => null);

    if (
      backendResponse.status === 400 &&
      isInvalidResetTokenError(backendBody)
    ) {
      return fail(400, 'invalidToken');
    }

    if (backendResponse.status === 429) return fail(429, 'rateLimited');

    if (!backendResponse.ok) {
      console.error(
        'Respuesta inesperada al validar reset-token:',
        backendResponse.status,
      );
      return fail(502, 'serverError');
    }

    if (
      !backendBody ||
      typeof backendBody !== 'object' ||
      !('valid' in backendBody) ||
      backendBody.valid !== true
    ) {
      return fail(502, 'serverError');
    }

    return apiOk({ valid: true });
  } catch (error) {
    console.error('Error en validate-reset-token:', error);
    return fail(500, 'serverError');
  }
}
