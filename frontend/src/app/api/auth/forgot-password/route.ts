import { checkRateLimit } from '@/lib/ratelimit';
import { forgotPasswordSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// Límites más estrictos que login/registro: este endpoint puede usarse para
// enumerar correos existentes o para saturar el servicio de envío de
// correos del backend, así que se restringe con más severidad.
const IP_RATE_LIMIT = { max: 5, window: '15 m' } as const;
const EMAIL_RATE_LIMIT = { max: 3, window: '15 m' } as const;

// Mensaje neutro: nunca debe revelar si el correo existe o no en el sistema.
const GENERIC_SUCCESS_MESSAGE =
  'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.';

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
      `forgot-password-ip:${clientIp}`,
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
    const result = forgotPasswordSchema.safeParse(body);

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

    const email = result.data.email.toLowerCase();

    // 3. Rate limiting adicional por correo
    const emailRateLimitResult = await checkRateLimit(
      `forgot-password-email:${email}`,
      EMAIL_RATE_LIMIT.max,
      EMAIL_RATE_LIMIT.window,
    );

    if (!emailRateLimitResult.success) {
      return NextResponse.json(
        {
          status: 429,
          message:
            'Demasiadas solicitudes para este correo. Intenta nuevamente más tarde.',
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

    // 5. Petición al backend externo de autenticación
    let backendResponse: Response;

    try {
      backendResponse = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

    // 6. Un correo "no encontrado" en el backend se responde igual que un
    // éxito de cara al cliente: evita que alguien use este formulario para
    // averiguar qué correos están registrados en la plataforma.
    if (backendResponse.status === 404) {
      return NextResponse.json(
        { status: 200, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 },
      );
    }

    // 7. Errores de validación propagados por el backend
    if (backendResponse.status === 400) {
      const data: unknown = await backendResponse.json().catch(() => null);

      return NextResponse.json(
        {
          status: 400,
          message:
            extractBackendMessage(data) ?? 'Datos inválidos o incompletos.',
        },
        { status: 400 },
      );
    }

    // 8. Rate limit señalado por el propio backend externo
    if (backendResponse.status === 429) {
      return NextResponse.json(
        {
          status: 429,
          message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
        },
        { status: 429 },
      );
    }

    // 9. Respuesta exitosa del backend
    if (backendResponse.ok) {
      return NextResponse.json(
        { status: 200, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 },
      );
    }

    // 10. Cualquier otro estado inesperado se normaliza a 500
    console.error(
      'Respuesta inesperada del backend de forgot-password:',
      backendResponse.status,
    );

    return NextResponse.json(
      {
        status: 500,
        message: 'No fue posible procesar tu solicitud en este momento.',
      },
      { status: 500 },
    );
  } catch (error) {
    console.error('Error en forgot-password:', error);

    return NextResponse.json(
      {
        status: 500,
        message: 'No fue posible procesar la solicitud.',
      },
      { status: 500 },
    );
  }
}
