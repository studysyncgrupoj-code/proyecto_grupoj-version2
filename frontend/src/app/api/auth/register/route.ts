import { apiError, apiOk } from '@/lib/apiResponse';
import type { RegisterErrorCode } from '@/lib/authErrors';
import { getClientIp } from '@/lib/clientIp';
import { checkRateLimit } from '@/lib/ratelimit';
import { registerSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;
const BACKEND_TIMEOUT_MS = 10_000;

const fail = (
  status: number,
  code: RegisterErrorCode,
  extra?: Record<string, unknown>,
) => apiError<RegisterErrorCode>(status, code, extra);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limiting por IP: 5 solicitudes / 30 minutos
    const ipRateLimitResult = await checkRateLimit(
      `register-ip:${getClientIp(request)}`,
      5,
      '30 m',
    );
    if (!ipRateLimitResult.success) return fail(429, 'rateLimited');

    // 2. Recibir y validar los datos enviados por el formulario
    const body = await request.json().catch(() => null);
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return fail(400, 'invalidData', {
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          code: issue.message,
        })),
      });
    }

    // 3. Rate limiting adicional por correo: 3 solicitudes / 30 minutos
    const emailRateLimitResult = await checkRateLimit(
      `register-email:${result.data.email.toLowerCase()}`,
      3,
      '30 m',
    );
    if (!emailRateLimitResult.success) return fail(429, 'rateLimited');

    // 4. Verificar configuración del backend
    if (!API_BASE_URL) {
      console.error('API_BASE_URL no configurada');
      return fail(500, 'serverError');
    }

    // 5. Traducir el formulario de Next.js al contrato de Spring Boot
    //     // confirmPassword NO se envía al backend.
    const backendPayload = {
      nombre: result.data.name,
      apellidos: result.data.lastName,
      email: result.data.email.toLowerCase(),
      contrasena: result.data.password,
    };

    // confirmPassword NO se envía al backend.
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendPayload),
        cache: 'no-store',
        signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
      });
    } catch (error) {
      console.error('Error de conexión con el backend externo:', error);
      return fail(503, 'unavailable');
    }

    // 6. Normalizar la respuesta: no se reenvía el texto del backend
    if (response.ok) return apiOk();

    if (response.status === 409) return fail(409, 'emailTaken');
    if (response.status === 400 || response.status === 422) {
      return fail(400, 'invalidData');
    }
    if (response.status === 429) return fail(429, 'rateLimited');

    console.error(
      'Respuesta inesperada del backend de register:',
      response.status,
    );
    return fail(502, 'serverError');
  } catch (error) {
    console.error('Error en registro:', error);
    return fail(500, 'serverError');
  }
}
