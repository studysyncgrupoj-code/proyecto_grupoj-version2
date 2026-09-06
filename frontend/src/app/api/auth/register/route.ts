import { checkRateLimit } from '@/lib/ratelimit';
import { registerSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================================
// TIPOS Y ESQUEMAS
// ============================================================

type RegisterRequestData = z.infer<typeof registerSchema>;

// ============================================================
// CONSTANTES
// ============================================================

const API_BASE_URL = process.env.API_BASE_URL;

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 0. Rate limiting por IP: 5 solicitudes / 30 minutos
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    const rateLimitResult = await checkRateLimit(`register:${ip}`, 5, '30 m');

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Demasiados intentos de registro. Intenta de nuevo más tarde.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        },
      );
    }

    // 1. Recepción de datos del cliente
    const body = await request.json();

    // 2. Validación de formato
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Datos de registro inválidos o incompletos.',
          details: result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const validatedData: RegisterRequestData = result.data;

    // 2.1 Rate limiting adicional por email: 3 solicitudes / 30 minutos
    // TODO: Agregar CAPTCHA (ej. Cloudflare Turnstile o hCaptcha)
    const emailRateLimitResult = await checkRateLimit(
      `register-email:${validatedData.email.toLowerCase()}`,
      3,
      '30 m',
    );

    if (!emailRateLimitResult.success) {
      return NextResponse.json(
        {
          error:
            'Demasiados intentos de registro con este correo. Intenta de nuevo más tarde.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': emailRateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': emailRateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': emailRateLimitResult.reset.toString(),
          },
        },
      );
    }

    // 3. Verificar configuración
    if (!API_BASE_URL) {
      console.error('API_BASE_URL no configurada');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 },
      );
    }

    // 4. Enviar al backend externo
    const EXTERNAL_API_URL = `${API_BASE_URL}/auth/register`;

    const response = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    // 5. Obtener respuesta del backend
    const data = await response.json();

    // 6. Pasar la respuesta del backend tal cual al frontend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error en registro:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
