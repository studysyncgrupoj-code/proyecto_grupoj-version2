import { loginSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  // 1. Validar que el body sea JSON parseable
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'El cuerpo de la petición debe ser JSON válido.' },
      { status: 400 },
    );
  }

  // 2. Validar los datos con Zod
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

    return NextResponse.json(
      {
        error: 'Datos de inicio de sesión inválidos.',
        details: fieldErrors,
      },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;

  // 3. Validar variables de entorno necesarias
  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!apiBaseUrl) {
    console.error('[login] Falta la variable de entorno API_BASE_URL');
    return NextResponse.json(
      {
        error:
          'El servicio de autenticación no está configurado correctamente.',
      },
      { status: 500 },
    );
  }

  // 4. Reenviar la petición al backend externo
  try {
    const externalResponse = await fetch(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ email, password }),
    });

    const contentType = externalResponse.headers.get('content-type') ?? '';
    const externalData = contentType.includes('application/json')
      ? await externalResponse.json().catch(() => null)
      : null;

    // Respuesta negativa del backend externo (401, 400, 422, etc.)
    if (!externalResponse.ok) {
      return NextResponse.json(
        {
          error:
            externalData?.message ||
            externalData?.error ||
            'No se pudo iniciar sesión con las credenciales proporcionadas.',
        },
        { status: externalResponse.status },
      );
    }

    // Respuesta positiva del backend externo
    // TODO: reemplazar este log por la lógica real de sesión (cookie,
    // JWT, etc.) cuando esté definida.
    console.log('[login] Datos válidos, usuario autenticado:', externalData);

    return NextResponse.json(
      externalData ?? { message: 'Inicio de sesión exitoso.' },
      { status: 200 },
    );
  } catch (error) {
    // Backend externo no responde / error de red
    console.error('[login] Error al contactar el backend externo:', error);

    return NextResponse.json(
      {
        error:
          'No se pudo conectar con el servidor de autenticación. Intenta más tarde.',
      },
      { status: 502 },
    );
  }
}
