import { registerWithConfirmSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================================
// TIPOS Y ESQUEMAS
// ============================================================

const apiRegisterSchema = registerWithConfirmSchema
  .omit({ confirmPassword: true })
  .pick({
    nombre: true,
    apellido: true,
    email: true,
    password: true,
  });

type RegisterRequestData = z.infer<typeof apiRegisterSchema>;

// ============================================================
// CONSTANTES
// ============================================================

const API_BASE_URL = process.env.API_BASE_URL;

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Recepción de datos del cliente
    const body = await request.json();

    // 2. Validación de formato
    const result = apiRegisterSchema.safeParse(body);

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
