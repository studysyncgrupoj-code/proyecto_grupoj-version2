import { registerWithConfirmSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = registerWithConfirmSchema.safeParse({
      ...body,
      activo: true,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Datos de registro inválidos',
          details: result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const validatedData = {
      nombre: result.data.nombre,
      apellido: result.data.apellido,
      email: result.data.email,
      password: result.data.password,
      rol: 'ESTUDIANTE',
      activo: true,
    };

    const API_BASE_URL = process.env.API_BASE_URL;

    if (!API_BASE_URL) {
      console.error(
        'API_BASE_URL no configurada en variables de entorno',
      );

      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 },
      );
    }

    const EXTERNAL_API_URL = `${API_BASE_URL}/auth/register`;

    const API_KEY = process.env.API_KEY;
    const clientIp = request.headers.get('x-forwarded-for') || '';

    const response = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && {
          Authorization: `Bearer ${API_KEY}`,
        }),
        ...(clientIp && {
          'X-Forwarded-For': clientIp,
        }),
      },
      body: JSON.stringify(validatedData),
    });

    let data;

    try {
      data = await response.json();
    } catch {
      data = {
        error: 'Respuesta inválida del servidor externo',
      };
    }

    if (!response.ok) {
      console.error('Error en API externa:', data);

      return NextResponse.json(
        {
          error:
            data.message ||
            data.error ||
            'Error al registrar usuario',
          ...data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: data.user || data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error en registro:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error interno del servidor';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}
