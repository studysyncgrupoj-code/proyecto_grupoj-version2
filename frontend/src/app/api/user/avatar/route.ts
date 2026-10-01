import { auth } from '@/auth';
import { apiError } from '@/lib/apiResponse';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return apiError(401, 'unauthenticated');
  }

  if (!API_BASE_URL) {
    console.error('API_BASE_URL no configurada');
    return apiError(500, 'serverError');
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return apiError(400, 'invalidRequest');
  }

  const file = formData.get('avatar');

  if (!(file instanceof File)) {
    return apiError(400, 'missingFile');
  }

  // Revalidamos en el servidor lo que ya se valida en el cliente:
  // el input del navegador se puede manipular.
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return apiError(415, 'unsupportedType');
  }

  if (file.size > MAX_FILE_SIZE) {
    return apiError(413, 'fileTooLarge');
  }

  const backendFormData = new FormData();
  backendFormData.append('avatar', file);

  // TODO [Backend – bloqueante]: falta decidir cómo se autentica esta llamada
  // ante Spring Boot (token en `Authorization` capturado en el login, o un
  // secreto de servidor a servidor). Sin esto, cualquiera podría llamar a esta
  // ruta y el backend no tiene forma de confirmar que session.user.id es real.
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/${session.user.id}/avatar`, {
      method: 'POST',
      body: backendFormData,
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Error de conexión al subir el avatar:', error);
    return apiError(503, 'serviceUnavailable');
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = {
      status: response.status,
      message: 'Respuesta inválida del servidor.',
    };
  }

  if (!response.ok) return apiError(502, 'uploadFailed');
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return apiError(401, 'unauthenticated');
  }

  if (!API_BASE_URL) {
    console.error('API_BASE_URL no configurada');
    return apiError(500, 'serverError');
  }

  // TODO [Backend – bloqueante]: mismo tema de autenticación que en POST.
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/${session.user.id}/avatar`, {
      method: 'DELETE',
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Error de conexión al eliminar el avatar:', error);
    return apiError(503, 'serviceUnavailable');
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = {
      status: response.status,
      message: 'Respuesta inválida del servidor.',
    };
  }

  if (!response.ok) return apiError(502, 'removeFailed');
  return NextResponse.json(data, { status: response.status });
}
