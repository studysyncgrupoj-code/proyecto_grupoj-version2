// auth.ts
import { checkRateLimit } from '@/lib/ratelimit';
import { loginSchema } from '@/lib/user.schema';
import type { UserRole } from '@/types/next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

// ============================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================
const API_BASE_URL = process.env.API_BASE_URL;
const API_TIMEOUT_MS = 10000; // 10 segundos

// Esquema para validar el rol devuelto por el backend
const UserRoleSchema = z.enum(['student', 'teacher', 'admin']);

// Tipo para metadatos de logs
interface LogMeta {
  [key: string]: string | number | boolean | object | undefined;
}

// ============================================================
// TIPOS DE RESPUESTA DEL BACKEND
// ============================================================
interface LoginSuccessResponse {
  status: number;
  message: string;
  data: {
    nombre: string;
    apellidos: string;
    uuid: string;
    rol: string;
  };
}

// ============================================================
// LOGS ESTRUCTURADOS
// ============================================================
const logger = {
  info: (message: string, meta?: LogMeta) => {
    console.log(
      JSON.stringify({
        level: 'info',
        service: 'auth-credentials',
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
        service: 'auth-credentials',
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      }),
    );
  },
};

const isLoginSuccessResponse = (
  value: unknown,
): value is LoginSuccessResponse => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const response = value as Partial<LoginSuccessResponse>;
  const data = response.data;

  return (
    response.status === 200 &&
    !!data &&
    typeof data.nombre === 'string' &&
    typeof data.apellidos === 'string' &&
    typeof data.uuid === 'string' &&
    typeof data.rol === 'string'
  );
};

// ============================================================
// EXPORTACIÓN AUTH.JS
// ============================================================
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials, request) {
        try {
          // 0. Control de Rate Limiting por IP
          const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
            request.headers.get('x-real-ip') ??
            '127.0.0.1';

          const limitResult = await checkRateLimit(ip, 10, '10 m');
          if (!limitResult.success) {
            logger.error('Rate limit excedido por IP', { ip });
            return null;
          }

          // 1. Validación de formato con Zod
          const result = loginSchema.safeParse(credentials);
          if (!result.success) {
            logger.info('Validación de Zod fallida en login');
            return null;
          }

          const { email, password } = result.data;

          // 2. Rate limiting adicional por email
          const emailLimitResult = await checkRateLimit(
            `login-email:${email.toLowerCase()}`,
            5,
            '10 m',
          );
          if (!emailLimitResult.success) {
            logger.error('Rate limit excedido por email', { email });
            return null;
          }

          if (!API_BASE_URL) {
            logger.error('API_BASE_URL no configurada en el entorno');
            return null;
          }

          // 3. Petición al backend externo con AbortController (Timeout)
          const EXTERNAL_API_URL = `${API_BASE_URL}/auth/login`;
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            API_TIMEOUT_MS,
          );

          let response: Response;
          try {
            response = await fetch(EXTERNAL_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
          } catch (error) {
            clearTimeout(timeoutId);
            logger.error('Error de conexión o timeout con el backend externo', {
              email,
              error: error instanceof Error ? error.message : 'Desconocido',
            });
            return null;
          }

          // 4. Procesar respuesta del backend de forma segura
          let data: unknown;
          try {
            data = await response.json();
          } catch {
            logger.error('Respuesta JSON inválida del backend externo');
            return null;
          }

          if (!response.ok || !isLoginSuccessResponse(data)) {
            logger.error('Credenciales rechazadas por el backend externo', {
              status: response.status,
              email,
            });
            return null;
          }

          // 5. Validar que el rol devuelto sea uno de los permitidos
          const roleParse = UserRoleSchema.safeParse(data.data.rol);
          if (!roleParse.success) {
            logger.error('Rol inválido devuelto por el backend', {
              rol: data.data.rol,
              uuid: data.data.uuid,
            });
            return null;
          }

          const role: UserRole = roleParse.data;

          logger.info('Autenticación exitosa con backend externo', {
            email,
            uuid: data.data.uuid,
            rol: role,
          });

          // 6. Retornar el objeto usuario limpio que Auth.js mapeará en su sesión
          return {
            id: String(data.data.uuid),
            name: `${data.data.nombre} ${data.data.apellidos}`,
            email,
            role, // ← ahora es UserRole, no string
          };
        } catch (error) {
          logger.error('Error interno crítico en authorize', {
            error: error instanceof Error ? error.message : 'Desconocido',
          });
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (typeof token.id === 'string') {
          session.user.id = token.id;
        }
        session.user.role = token.role;
      }

      return session;
    },
  },
});
