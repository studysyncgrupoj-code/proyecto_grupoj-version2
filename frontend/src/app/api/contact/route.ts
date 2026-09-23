import { contactSchema } from '@/lib/contactSchema';
import { checkRateLimit } from '@/lib/ratelimit';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limiting por IP: 5 solicitudes / 15 minutos
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const ipRateLimitResult = await checkRateLimit(
      `contact-ip:${clientIp}`,
      5,
      '15 m',
    );

    if (!ipRateLimitResult.success) {
      return NextResponse.json(
        {
          status: 429,
          message:
            'Demasiados mensajes enviados. Intenta nuevamente más tarde.',
        },
        { status: 429 },
      );
    }

    // 2. Recibir y validar los datos enviados por el formulario
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Los datos enviados no son válidos.',
          details: result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    // 3. Verificar configuración del backend
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

    // 4. Enviar los datos validados al backend de Java
    const backendPayload = {
      name: result.data.name,
      email: result.data.email,
      contactNumber: result.data.contactNumber,
      subject: result.data.subject,
      message: result.data.message,
    };

    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
      cache: 'no-store',
    });

    // 5. Leer la respuesta de Spring Boot de forma segura
    let data: unknown;

    try {
      data = await response.json();
    } catch {
      data = {
        status: response.status,
        message: 'Respuesta inválida del servidor.',
      };
    }

    // 6. Mantener el código HTTP y la respuesta del backend
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('[CONTACT PROXY ERROR]', error);

    return NextResponse.json(
      {
        status: 503,
        message: 'No fue posible conectar con el servicio de contacto.',
      },
      { status: 503 },
    );
  }
}
