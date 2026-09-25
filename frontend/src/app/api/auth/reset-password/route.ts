import { checkRateLimit } from '@/lib/ratelimit';
import { resetPasswordRequestSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// Este endpoint recibe una contraseña nueva junto con un token de un solo
// uso: se limita tanto por IP (abuso general) como por token (evita que
// alguien intente "adivinar" o repetir intentos sobre un mismo enlace).
const IP_RATE_LIMIT = { max: 10, window: '15 m' } as const;
const TOKEN_RATE_LIMIT = { max: 5, window: '15 m' } as const;

function extractBackendMessage(data: unknown): string | null {
  if (data && typeof data === 'object' && 'message' in data) {
    const { message } = data as { message?: unknown };
    return typeof message === 'string' ? message : null;
  }
  return null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limiting por IP
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const ipRateLimitResult = await checkRateLimit(
      `reset-password-ip:${clientIp}`,
      IP_RATE_LIMIT.max,
      IP_RATE_LIMIT.window,
    );

    if (!ipRateLimitResult.success) {
      return NextResponse.json(
        {
          status: 429,
          message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
        },
        { status: 429 },
      );
    }

    // 2. Recibir y validar los datos enviados por el formulario
    const body = await request.json().catch(() => null);
    const result = resetPasswordRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Datos inválidos o incompletos.',
          details: result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const { token, password } = result.data;

    // 3. Rate limiting adicional por token: protege un mismo enlace de
    // intentos repetidos, sin depender únicamente de la IP del solicitante.
    const tokenRateLimitResult = await checkRateLimit(
      `reset-password-token:${token}`,
      TOKEN_RATE_LIMIT.max,
      TOKEN_RATE_LIMIT.window,
    );

    if (!tokenRateLimitResult.success) {
      return NextResponse.json(
        {
          status: 429,
          message:
            'Demasiados intentos con este enlace. Solicita uno nuevo si el problema persiste.',
        },
        { status: 429 },
      );
    }

    // 4. Verificar configuración del backend
    if (!API_BASE_URL) {
      console.error('API_BASE_URL no configurada');

      return NextResponse.json(
        {
          status: 500,
          message: 'Error de configuración del servidor.',
        },
        { status: 500 },
      );
    }

    // 5. Traducir el formulario de Next.js al contrato de Spring Boot
    const backendPayload = {
      token,
      newpassword: password,
    };

    let backendResponse: Response;

    try {
      backendResponse = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendPayload),
        cache: 'no-store',
      });
    } catch (error) {
      console.error('Error de conexión con el backend externo:', error);

      return NextResponse.json(
        {
          status: 500,
          message: 'No fue posible conectar con el servicio de autenticación.',
        },
        { status: 500 },
      );
    }

    // 6. Leer la respuesta de Spring Boot
    let data: unknown;

    try {
      data = await backendResponse.json();
    } catch {
      data = {
        status: backendResponse.status,
        message: 'Respuesta inválida del servidor.',
      };
    }

    // 7. Un token inválido, expirado o ya usado se comunica tal cual: a
    // diferencia de "olvidé mi contraseña", aquí no hay riesgo de
    // enumeración de usuarios y el usuario necesita saber que debe pedir
    // un enlace nuevo.
    if (
      backendResponse.status === 400 ||
      backendResponse.status === 401 ||
      backendResponse.status === 404 ||
      backendResponse.status === 410
    ) {
      return NextResponse.json(
        {
          status: 400,
          message:
            extractBackendMessage(data) ??
            'Este enlace de restablecimiento no es válido o ya expiró.',
        },
        { status: 400 },
      );
    }

    if (backendResponse.status === 429) {
      return NextResponse.json(
        {
          status: 429,
          message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
        },
        { status: 429 },
      );
    }

    if (backendResponse.ok) {
      return NextResponse.json(
        {
          status: 200,
          message:
            extractBackendMessage(data) ??
            'Tu contraseña se actualizó correctamente.',
        },
        { status: 200 },
      );
    }

    // 8. Cualquier otro estado inesperado se normaliza a 500
    console.error(
      'Respuesta inesperada del backend de reset-password:',
      backendResponse.status,
    );

    return NextResponse.json(
      {
        status: 500,
        message: 'No fue posible restablecer tu contraseña en este momento.',
      },
      { status: 500 },
    );
  } catch (error) {
    console.error('Error en reset-password:', error);

    return NextResponse.json(
      {
        status: 500,
        message: 'No fue posible procesar la solicitud.',
      },
      { status: 500 },
    );
  }
}
