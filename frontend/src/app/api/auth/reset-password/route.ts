import { apiError, apiOk } from '@/lib/apiResponse';
import type { ResetPasswordErrorCode } from '@/lib/authErrors';
import { getClientIp } from '@/lib/clientIp';
import { checkRateLimit } from '@/lib/ratelimit';
import { resetPasswordRequestSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;
const BACKEND_TIMEOUT_MS = 10_000;

// Se limita por IP (abuso general) y por token (evita reintentos sobre un
// mismo enlace).
const IP_RATE_LIMIT = { max: 10, window: '15 m' } as const;
const TOKEN_RATE_LIMIT = { max: 5, window: '15 m' } as const;

const fail = (
  status: number,
  code: ResetPasswordErrorCode,
  extra?: Record<string, unknown>,
) => apiError<ResetPasswordErrorCode>(status, code, extra);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limiting por IP
    const ipRateLimitResult = await checkRateLimit(
      `reset-password-ip:${getClientIp(request)}`,
      IP_RATE_LIMIT.max,
      IP_RATE_LIMIT.window,
    );
    if (!ipRateLimitResult.success) return fail(429, 'rateLimited');

    // 2. Validar los datos
    const body = await request.json().catch(() => null);
    const result = resetPasswordRequestSchema.safeParse(body);

    if (!result.success) {
      return fail(400, 'invalidData', {
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          code: issue.message,
        })),
      });
    }

    const { token, password } = result.data;

    // 3. Rate limiting adicional por token: protege un mismo enlace de
    // intentos repetidos, sin depender únicamente de la IP del solicitante.
    const tokenRateLimitResult = await checkRateLimit(
      `reset-password-token:${token}`,
      TOKEN_RATE_LIMIT.max,
      TOKEN_RATE_LIMIT.window,
    );
    if (!tokenRateLimitResult.success) return fail(429, 'rateLimited');

    // 4. Verificar configuración del backend
    if (!API_BASE_URL) {
      console.error('API_BASE_URL no configurada');
      return fail(500, 'serverError');
    }

    // 5. Traducir el formulario de Next.js al contrato de Spring Boot
    let backendResponse: Response;

    try {
      backendResponse = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
        cache: 'no-store',
        signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
      });
    } catch (error) {
      console.error('Error de conexión con el backend externo:', error);
      return fail(503, 'unavailable');
    }

    if (backendResponse.ok) return apiOk();

    // 6. Token inválido, expirado o ya usado: aquí no hay riesgo de
    // enumeración y el usuario necesita saber que debe pedir un enlace nuevo.
    if ([400, 401, 404, 410].includes(backendResponse.status)) {
      return fail(400, 'invalidToken');
    }

    if (backendResponse.status === 429) return fail(429, 'rateLimited');

    // 7. Cualquier otro estado inesperado
    console.error(
      'Respuesta inesperada del backend de reset-password:',
      backendResponse.status,
    );
    return fail(502, 'serverError');
  } catch (error) {
    console.error('Error en reset-password:', error);
    return fail(500, 'serverError');
  }
}
