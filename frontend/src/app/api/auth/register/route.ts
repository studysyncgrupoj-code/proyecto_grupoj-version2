import { checkRateLimit } from '@/lib/ratelimit';
import { registerSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limiting por IP: 5 solicitudes / 30 minutos
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const ipRateLimitResult = await checkRateLimit(
      `register-ip:${clientIp}`,
      5,
      '30 m',
    );

    if (!ipRateLimitResult.success) {
      return NextResponse.json(
        {
          status: 429,
          message: 'Demasiados intentos de registro. Intenta nuevamente más tarde.',
        },
        { status: 429 },
      );
    }

    // 2. Recibir y validar los datos enviados por el formulario
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Datos de registro inválidos o incompletos.',
          details: result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    // 3. Rate limiting adicional por correo: 3 solicitudes / 30 minutos
    const emailRateLimitResult = await checkRateLimit(
      `register-email:${result.data.email.toLowerCase()}`,
      3,
      '30 m',
    );

    if (!emailRateLimitResult.success) {
      return NextResponse.json(
        {
          status: 429,
          message: 'Demasiados intentos de registro para este correo. Intenta nuevamente más tarde.',
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
      nombre: result.data.nombre,
      apellidos: result.data.apellido,
      email: result.data.email.toLowerCase(),
      contrasena: result.data.password,
    };

    // confirmPassword NO se envía al backend.
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
      cache: 'no-store',
    });

    // 6. Leer la respuesta de Spring Boot
    let data: unknown;

    try {
      data = await response.json();
    } catch {
      data = {
        status: response.status,
        message: 'Respuesta inválida del servidor.',
      };
    }

    // 7. Mantener el código HTTP y la respuesta del backend
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error en registro:', error);

    return NextResponse.json(
      {
        status: 503,
        message: 'No fue posible conectar con el servicio de autenticación.',
      },
      { status: 503 },
    );
  }
}
