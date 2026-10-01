import { apiError, apiOk } from '@/lib/apiResponse';
import type { ForgotPasswordErrorCode } from '@/lib/authErrors';
import { getClientIp } from '@/lib/clientIp';
import { checkRateLimit } from '@/lib/ratelimit';
import { forgotPasswordSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;
const BACKEND_TIMEOUT_MS = 10_000;

// Límites más estrictos que login/registro: este endpoint puede usarse para
// enumerar correos existentes o para saturar el envío de correos del backend.
const IP_RATE_LIMIT = { max: 5, window: '15 m' } as const;
const EMAIL_RATE_LIMIT = { max: 3, window: '15 m' } as const;

const fail = (
  status: number,
  code: ForgotPasswordErrorCode,
  extra?: Record<string, unknown>,
) => apiError<ForgotPasswordErrorCode>(status, code, extra);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limiting por IP
    const ipRateLimitResult = await checkRateLimit(
      `forgot-password-ip:${getClientIp(request)}`,
      IP_RATE_LIMIT.max,
      IP_RATE_LIMIT.window,
    );
    if (!ipRateLimitResult.success) return fail(429, 'rateLimited');

    // 2. Validar los datos del formulario
    const body = await request.json().catch(() => null);
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return fail(400, 'invalidData', {
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          code: issue.message,
        })),
      });
    }

    const email = result.data.email.toLowerCase();

    // 3. Rate limiting adicional por correo
    const emailRateLimitResult = await checkRateLimit(
      `forgot-password-email:${email}`,
      EMAIL_RATE_LIMIT.max,
      EMAIL_RATE_LIMIT.window,
    );
    if (!emailRateLimitResult.success) return fail(429, 'rateLimited');

    // 4. Verificar configuración del backend
    if (!API_BASE_URL) {
      console.error('API_BASE_URL no configurada');
      return fail(500, 'serverError');
    }

    // 5. Petición al backend externo de autenticación
    let backendResponse: Response;

    try {
      backendResponse = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        cache: 'no-store',
        signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
      });
    } catch (error) {
      console.error('Error de conexión con el backend externo:', error);
      return fail(503, 'unavailable');
    }

    // 6. Un correo "no encontrado" en el backend se responde igual que un
    // éxito de cara al cliente: evita que alguien use este formulario para
    // averiguar qué correos están registrados en la plataforma.
    if (backendResponse.ok || backendResponse.status === 404) return apiOk();

    // 7. Errores de validación propagados por el backend
    if (backendResponse.status === 400) return fail(400, 'invalidData');
    // 8. Rate limit señalado por el propio backend externo
    if (backendResponse.status === 429) return fail(429, 'rateLimited');

    // 9. Respuesta exitosa del backend
    console.error(
      'Respuesta inesperada del backend de forgot-password:',
      backendResponse.status,
    );
    return fail(502, 'serverError');
  } catch (error) {
    console.error('Error en forgot-password:', error);
    return fail(500, 'serverError');
  }
}
