import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { status: 401, message: 'No autenticado.' },
      { status: 401 },
    );
  }

  if (!API_BASE_URL) {
    console.error('API_BASE_URL no configurada');
    return NextResponse.json(
      { status: 500, message: 'Error de configuración del servidor.' },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { status: 400, message: 'No se pudo leer el archivo enviado.' },
      { status: 400 },
    );
  }

  const file = formData.get('avatar');

  if (!(file instanceof File)) {
    return NextResponse.json(
      { status: 400, message: 'No se recibió ninguna imagen.' },
      { status: 400 },
    );
  }

  // Revalidamos en el servidor lo que ya se valida en el cliente:
  // el input del navegador se puede manipular.
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { status: 400, message: 'Formato no soportado. Usa JPG, PNG o WEBP.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { status: 400, message: 'La imagen no puede superar los 4 MB.' },
      { status: 400 },
    );
  }

  const backendFormData = new FormData();
  backendFormData.append('avatar', file);

  // TODO [Backend – bloqueante]: falta decidir cómo se autentica esta llamada
  // ante Spring Boot (token en `Authorization` capturado en el login, o un
  // secreto de servidor a servidor). Sin esto, cualquiera podría llamar a esta
  // ruta y el backend no tiene forma de confirmar que session.user.id es real.
  const response = await fetch(
    `${API_BASE_URL}/users/${session.user.id}/avatar`,
    {
      method: 'POST',
      body: backendFormData,
      cache: 'no-store',
    },
  );

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = {
      status: response.status,
      message: 'Respuesta inválida del servidor.',
    };
  }

  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { status: 401, message: 'No autenticado.' },
      { status: 401 },
    );
  }

  if (!API_BASE_URL) {
    console.error('API_BASE_URL no configurada');
    return NextResponse.json(
      { status: 500, message: 'Error de configuración del servidor.' },
      { status: 500 },
    );
  }

  // TODO [Backend – bloqueante]: mismo tema de autenticación que en POST.
  const response = await fetch(
    `${API_BASE_URL}/users/${session.user.id}/avatar`,
    { method: 'DELETE', cache: 'no-store' },
  );

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = {
      status: response.status,
      message: 'Respuesta inválida del servidor.',
    };
  }

  return NextResponse.json(data, { status: response.status });
}
