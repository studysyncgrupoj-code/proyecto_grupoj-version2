import { apiError, apiOk } from '@/lib/apiResponse';
import { getClientIp } from '@/lib/clientIp';
import type { ContactErrorCode } from '@/lib/contactErrors';
import { contactSchema } from '@/lib/contactSchema';
import { checkRateLimit } from '@/lib/ratelimit';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;
const BACKEND_TIMEOUT_MS = 10_000;

// Alias local para no repetir el genérico en cada llamada.
const fail = (
  status: number,
  code: ContactErrorCode,
  extra?: Record<string, unknown>,
) => apiError<ContactErrorCode>(status, code, extra);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limiting por IP: 5 solicitudes / 15 minutos
    const clientIp = getClientIp(request);

    const ipRateLimitResult = await checkRateLimit(
      `contact-ip:${clientIp}`,
      5,
      '15 m',
    );

    if (!ipRateLimitResult.success) return fail(429, 'rateLimited');

    // 2. Recibir y validar los datos enviados por el formulario
    const body = await request.json().catch(() => null);
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return fail(400, 'invalidData', {
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          code: issue.message, // clave de Validation, p. ej. 'contact.subject.min'
        })),
      });
    }

    // 3. Verificar configuración del backend
    if (!API_BASE_URL) {
      console.error('API_BASE_URL no configurada');
      return fail(500, 'serverError');
    }

    // 4. Enviar los datos validados al backend de Java
    const backendPayload = {
      name: result.data.name,
      email: result.data.email,
      contactNumber: result.data.contactNumber,
      subject: result.data.subject,
      message: result.data.message,
    };

    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendPayload),
        cache: 'no-store',
        signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
      });
    } catch (error) {
      console.error('[CONTACT PROXY] Backend inaccesible o con timeout', error);
      return fail(503, 'unavailable');
    }

    // 5. Normalizar la respuesta del backend: no se reenvía su texto
    if (response.ok) return apiOk();

    console.error(
      '[CONTACT PROXY] Respuesta no exitosa del backend',
      response.status,
    );

    if (response.status === 429) return fail(429, 'rateLimited');
    if (response.status === 400 || response.status === 422) {
      return fail(400, 'invalidData');
    }
    return fail(502, 'sendFailed');
  } catch (error) {
    console.error('[CONTACT PROXY ERROR]', error);
    return fail(500, 'serverError');
  }
}
