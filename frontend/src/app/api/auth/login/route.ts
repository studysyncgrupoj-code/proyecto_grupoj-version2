import { checkRateLimit } from '@/lib/ratelimit';
import { loginSchema } from '@/lib/user.schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================================
// TIPOS Y ESQUEMAS
// ============================================================

type LoginRequestData = z.infer<typeof loginSchema>;

// Respuesta exitosa del backend
interface LoginSuccessResponse {
  status: 200;
  message: string;
  data: {
    nombre: string;
    apellidos: string;
    uuid: string;
    rol: string;
  };
}

// Respuesta de error del backend
interface LoginErrorResponse {
  status: number;
  message: string;
  error?: string;
  details?: Record<string, string[]>;
}

// Unión de ambos tipos
type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

// Tipo para metadatos de logs
interface LogMeta {
  [key: string]: string | number | boolean | object | undefined;
}

// ============================================================
// CONSTANTES
// ============================================================

const API_BASE_URL = process.env.API_BASE_URL;
const API_TIMEOUT_MS = 10000; // 10 segundos

// ============================================================
// TYPE GUARDS
// ============================================================

function isLoginSuccessResponse(
  response: LoginResponse,
): response is LoginSuccessResponse {
  return (
    response.status === 200 && 'data' in response && response.data !== undefined
  );
}

function isLoginErrorResponse(
  response: LoginResponse,
): response is LoginErrorResponse {
  return response.status !== 200 || !('data' in response);
}

// ============================================================
// LOGS ESTRUCTURADOS
// ============================================================

const logger = {
  info: (message: string, meta?: LogMeta) => {
    console.log(
      JSON.stringify({
        level: 'info',
        service: 'login',
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      }),
    );
  },
  error: (message: string, meta?: LogMeta) => {
    console.error(
      JSON.stringify({
        level: 'error',
        service: 'login',
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      }),
    );
  },
};

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 0. Control de Rate Limiting por IP usando el módulo reutilizable
    // TODO: Agregar CAPTCHA (ej. Cloudflare Turnstile o hCaptcha)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1';

    // 10 peticiones máximo en una ventana de 10 minutos
    const limitResult = await checkRateLimit(ip, 10, '10 m');

    if (!limitResult.success) {
      logger.error('Rate limit excedido para inicio de sesión', { ip });

      return NextResponse.json(
        {
          status: 429,
          message:
            'Demasiadas solicitudes de inicio de sesión. Por favor, inténtalo más tarde.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limitResult.limit.toString(),
            'X-RateLimit-Remaining': limitResult.remaining.toString(),
            'X-RateLimit-Reset': limitResult.reset.toString(),
          },
        },
      );
    }

    // 1. Recepción de credenciales con validación JSON
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      logger.error('JSON inválido en el cuerpo de la petición');

      return NextResponse.json(
        {
          status: 400,
          message: 'El cuerpo de la petición debe ser JSON válido.',
        },
        { status: 400 },
      );
    }

    // 2. Validación de formato
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;

      logger.info('Validación fallida', { errors: fieldErrors });

      return NextResponse.json(
        {
          status: 400,
          message: 'Credenciales incompletas o formato de correo inválido.',
          details: fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, password }: LoginRequestData = result.data;

    logger.info('Credenciales recibidas', { email });

    // 2.1 Rate limiting adicional por email: 5 solicitudes / 10 minutos
    // Complementa el límite por IP para mitigar rotación de IP en el mismo email
    const emailLimitResult = await checkRateLimit(
      `login-email:${email.toLowerCase()}`,
      5,
      '10 m',
    );

    if (!emailLimitResult.success) {
      logger.error('Rate limit excedido para inicio de sesión por email', {
        email,
      });

      return NextResponse.json(
        {
          status: 429,
          message:
            'Demasiados intentos de inicio de sesión con este correo. Intenta más tarde.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': emailLimitResult.limit.toString(),
            'X-RateLimit-Remaining': emailLimitResult.remaining.toString(),
            'X-RateLimit-Reset': emailLimitResult.reset.toString(),
          },
        },
      );
    }

    // 3. Verificar configuración
    if (!API_BASE_URL) {
      logger.error('API_BASE_URL no configurada');

      return NextResponse.json(
        {
          status: 500,
          message:
            'El servicio de autenticación no está configurado correctamente.',
        },
        { status: 500 },
      );
    }

    // 4. Enviar al backend externo con timeout
    const EXTERNAL_API_URL = `${API_BASE_URL}/auth/login`;

    logger.info('Enviando al backend externo', { url: EXTERNAL_API_URL });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    let response: Response;

    try {
      response = await fetch(EXTERNAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);

      // Error de timeout
      if (error instanceof Error && error.name === 'AbortError') {
        logger.error('Timeout al contactar el backend externo', {
          email,
          timeout: API_TIMEOUT_MS,
        });

        return NextResponse.json(
          {
            status: 504,
            message:
              'El servidor de autenticación no respondió a tiempo. Intenta más tarde.',
          },
          { status: 504 },
        );
      }

      // Error de red / conexión
      logger.error('Error de red al contactar el backend externo', {
        email,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });

      return NextResponse.json(
        {
          status: 502,
          message:
            'No se pudo conectar con el servidor de autenticación. Intenta más tarde.',
        },
        { status: 502 },
      );
    }

    // 5. Obtener respuesta del backend
    let data: LoginResponse;

    try {
      data = await response.json();
    } catch {
      logger.error('Respuesta inválida del servidor externo', {
        status: response.status,
      });

      data = {
        status: response.status,
        message: 'Respuesta inválida del servidor externo',
      };
    }

    // 6. Manejar errores del backend
    if (!response.ok) {
      logger.error('Error en API externa', {
        status: response.status,
        data: JSON.stringify(data),
        email,
      });

      let errorMessage = 'Credenciales inválidas o cuenta inactiva.';

      if (isLoginErrorResponse(data)) {
        errorMessage = data.message || data.error || errorMessage;
      }

      return NextResponse.json(
        {
          status: response.status,
          message: errorMessage,
        },
        { status: response.status },
      );
    }

    // 7. Credenciales válidas
    if (!isLoginSuccessResponse(data)) {
      logger.error('Respuesta exitosa pero con estructura inválida', {
        data: JSON.stringify(data),
      });

      return NextResponse.json(
        {
          status: 500,
          message: 'Estructura de respuesta inválida del servidor externo.',
        },
        { status: 500 },
      );
    }

    logger.info('Credenciales válidas', {
      email,
      uuid: data.data.uuid,
      rol: data.data.rol,
    });

    // 8. Generación de sesión y manejo de cookies
    // TODO: Implementar Auth.js

    return NextResponse.json(
      {
        status: 200,
        message: 'Credenciales válidas.',
        data: data.data,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': limitResult.limit.toString(),
          'X-RateLimit-Remaining': limitResult.remaining.toString(),
          'X-RateLimit-Reset': limitResult.reset.toString(),
        },
      },
    );
  } catch (error) {
    // 9. Error interno del servidor
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    logger.error('Error interno del servidor', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        status: 500,
        message: 'Error interno del servidor. Intenta más tarde.',
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
