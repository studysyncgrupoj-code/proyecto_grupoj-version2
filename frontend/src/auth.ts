import { getClientIp } from '@/lib/clientIp';
import { checkRateLimit } from '@/lib/ratelimit';
import { loginSchema } from '@/lib/user.schema';
import type { SubscriptionType, UserRole } from '@/types/next-auth';
import NextAuth, { CredentialsSignin } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

// ============================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================
const API_BASE_URL = process.env.API_BASE_URL;
const API_TIMEOUT_MS = 10_000; // 10 s

// Rol permitido tal como lo devuelve el backend
const UserRoleSchema = z.enum(['student', 'teacher', 'admin']);

// Suscripción permitida.
// Solo aplica actualmente al rol student.
const SubscriptionSchema = z.enum(['free', 'premium', 'enterprise']);

// Metadatos aceptados por el logger estructurado
interface LogMeta {
  [key: string]: string | number | boolean | object | undefined;
}

// Debe coincidir con el TTL del refresh token en el backend
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días = 604 800 s
// Renovar el access token un poco antes de que caduque
const REFRESH_MARGIN_MS = 30_000; // 30 s

// Par de tokens devuelto por /auth/login y /auth/refresh.
//
// token:
//   Access token utilizado para autenticarse contra el backend.
//
// refreshToken:
//   Credencial utilizada exclusivamente por Next.js/Auth.js
//   para solicitar nuevos access tokens.
//
// expiresIn:
//   Vida útil del access token en segundos.
//
// refreshExpiresIn:
//   Vida útil del refresh token en segundos.
const TokenPairSchema = z.object({
  token: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresIn: z.number().positive(),
  refreshExpiresIn: z.number().positive(),
});

// ============================================================
// ERRORES DE LOGIN CON CÓDIGO
// Auth.js propaga `code` al cliente cuando se usa signIn con
// redirect: false, de modo que el formulario puede traducirlo.
// Cualquier otro fallo se trata como credenciales inválidas
// devolviendo null desde authorize.
// ============================================================
class RateLimitedError extends CredentialsSignin {
  code = 'rateLimited';
}

class UnavailableError extends CredentialsSignin {
  code = 'unavailable';
}

interface LoginSuccessResponse {
  status: 200;
  message: string;
  data: {
    nombre: string;
    apellidos: string;
    uuid: string;
    rol: string;
    subscription?: string;
    image?: string;

    // Tokens emitidos por el backend
    token: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  };
}

// ============================================================
// LOGS ESTRUCTURADOS (JSON en una sola línea)
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

// Type guard: comprueba que la respuesta tiene la forma mínima
// que necesitamos antes de acceder a sus campos.
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
    typeof data.rol === 'string' &&
    typeof data.token === 'string' &&
    typeof data.refreshToken === 'string' &&
    typeof data.expiresIn === 'number' &&
    data.expiresIn > 0 &&
    typeof data.refreshExpiresIn === 'number' &&
    data.refreshExpiresIn > 0
  );
};

// ============================================================
// RENOVACIÓN DE TOKENS
// ============================================================
// Evita que varias peticiones concurrentes usen el mismo refresh
// token a la vez: la primera lanza la petición y las demás esperan
// su resultado.
const refreshInFlight = new Map<string, Promise<JWT>>();

// Llama a /auth/refresh y devuelve un JWT actualizado.
// - Si no hay refreshToken o falta API_BASE_URL → error de configuración.
// - Si el refresh ya caducó o el backend responde 401/403 → sesión terminada.
// - Si el fallo es transitorio (red, 5xx, formato raro) → se conserva el
//   token actual y se reintentará en la próxima petición.
async function requestRefresh(token: JWT): Promise<JWT> {
  if (!token.refreshToken || !API_BASE_URL) {
    return {
      ...token,
      error: 'RefreshTokenError',
    };
  }

  if (token.refreshTokenExpires && Date.now() >= token.refreshTokenExpires) {
    return {
      ...token,
      error: 'RefreshTokenExpired',
    };
  }

  const controller = new AbortController();

  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
      signal: controller.signal,
    });

    // Refresh token inválido, expirado o revocado.
    // La sesión ya no puede continuar.
    if (res.status === 401 || res.status === 403) {
      logger.info('Refresh token rechazado por el backend');

      return {
        ...token,
        error: 'RefreshTokenExpired',
      };
    }

    // Error temporal del backend.
    // Conservamos el token para poder reintentar.
    if (!res.ok) {
      logger.error('Fallo temporal al renovar el token', {
        status: res.status,
      });

      return token;
    }

    const body: unknown = await res.json();

    const parsed = TokenPairSchema.safeParse(
      (body as { data?: unknown } | null)?.data,
    );

    if (!parsed.success) {
      logger.error('Respuesta de refresh con formato inesperado');

      return token;
    }

    const now = Date.now();

    return {
      ...token,

      // Nuevo access token
      accessToken: parsed.data.token,

      // Importante:
      // el backend puede rotar el refresh token.
      refreshToken: parsed.data.refreshToken,

      accessTokenExpires: now + parsed.data.expiresIn * 1000,

      refreshTokenExpires: now + parsed.data.refreshExpiresIn * 1000,

      error: undefined,
    };
  } catch (error) {
    logger.error('Error de red al renovar el token', {
      error: error instanceof Error ? error.message : 'Desconocido',
    });

    return token;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Deduplica llamadas concurrentes al refresh usando el refreshToken
// como clave.
//
// Esto es especialmente importante si el backend utiliza refresh-token
// rotation: dos refresh simultáneos podrían intentar consumir el mismo
// refresh token y provocar que uno de ellos sea rechazado.
function refreshAccessToken(token: JWT): Promise<JWT> {
  const key = token.refreshToken ?? '';
  const pending = refreshInFlight.get(key);
  if (pending) return pending;

  const promise = requestRefresh(token).finally(() =>
    refreshInFlight.delete(key),
  );
  refreshInFlight.set(key, promise);
  return promise;
}

// ============================================================
// CONFIGURACIÓN DE NEXT-AUTH
// ============================================================
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
  },
  providers: [
    Credentials({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },

      // Flujo completo del login por credenciales:
      //   0) rate limit por IP
      //   1) validación del payload con Zod
      //   2) rate limit por email
      //   3) POST a {API_BASE_URL}/auth/login con timeout
      //   4) parseo y validación de la respuesta
      //   5) validación de rol y (si aplica) de suscripción
      //   5.2) validación del par de tokens
      //   6) construcción del objeto usuario para Auth.js
      async authorize(credentials, request) {
        try {
          // 0. Rate limit por IP
          const ip = getClientIp(request);

          const limitResult = await checkRateLimit(
            `login-ip:${ip}`,
            10,
            '10 m',
          );

          if (!limitResult.success) {
            logger.error('Rate limit excedido por IP', { ip });
            throw new RateLimitedError();
          }

          // 1. Validación de formato con Zod
          const result = loginSchema.safeParse(credentials);
          if (!result.success) {
            logger.info('Validación de Zod fallida en login');
            return null;
          }

          const { email, password } = result.data;

          // 2. Rate limit adicional por email
          const emailLimitResult = await checkRateLimit(
            `login-email:${email.toLowerCase()}`,
            5,
            '10 m',
          );
          if (!emailLimitResult.success) {
            logger.error('Rate limit excedido por email', { email });
            throw new RateLimitedError();
          }

          if (!API_BASE_URL) {
            logger.error('API_BASE_URL no configurada en el entorno');
            throw new UnavailableError();
          }

          // 3. Llamada al backend con AbortController para aplicar timeout
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
            throw new UnavailableError();
          }

          // 4. Parseo defensivo: si el cuerpo no es JSON válido se decide
          //    entre credenciales inválidas (4xx) o backend caído (5xx).
          let data: unknown;
          try {
            data = await response.json();
          } catch {
            logger.error('Respuesta JSON inválida del backend externo');
            if (response.status >= 500) throw new UnavailableError();
            return null;
          }

          if (!response.ok || !isLoginSuccessResponse(data)) {
            logger.error('Credenciales rechazadas por el backend externo', {
              status: response.status,
              email,
            });
            if (response.status >= 500) throw new UnavailableError();
            return null;
          }

          // 5. Validar que el rol devuelto esté entre los permitidos
          const roleParse = UserRoleSchema.safeParse(
            data.data.rol.toLowerCase(),
          );
          if (!roleParse.success) {
            logger.error('Rol inválido devuelto por el backend', {
              rol: data.data.rol,
              uuid: data.data.uuid,
            });
            return null;
          }

          const role: UserRole = roleParse.data;

          // 5.1. Suscripción: solo aplica a estudiantes. Si falta o es
          //      inválida se asigna 'free' por defecto.
          const rawSubscription = data.data.subscription;
          let subscription: SubscriptionType | undefined;
          if (role === 'student') {
            const subParse = SubscriptionSchema.safeParse(
              rawSubscription?.toLowerCase(),
            );
            if (!subParse.success) {
              logger.error('Suscripción inválida o ausente, se asigna free', {
                uuid: data.data.uuid,
              });
            }
            subscription = subParse.success ? subParse.data : 'free';
          }

          // 5.2. Sin par de tokens no hay sesión válida.
          const tokens = TokenPairSchema.safeParse(data.data);

          if (!tokens.success) {
            logger.error('El backend no devolvió el par de tokens esperado', {
              uuid: data.data.uuid,
            });

            throw new UnavailableError();
          }

          logger.info('Autenticación exitosa con backend externo', {
            email,
            uuid: data.data.uuid,
            rol: role,
            suscripcion: subscription,
          });

          if (!tokens.success) {
            logger.error('El backend no devolvió el par de tokens esperado', {
              uuid: data.data.uuid,
            });
            throw new UnavailableError();
          }

          // 6. Objeto usuario que Auth.js guardará en el JWT
          const now = Date.now();
          return {
            id: String(data.data.uuid),
            name: `${data.data.nombre} ${data.data.apellidos}`,
            email,
            image: data.data.image,
            role,
            subscription,
            accessToken: tokens.data.token,
            refreshToken: tokens.data.refreshToken,
            accessTokenExpires: now + tokens.data.expiresIn * 1000,
            refreshTokenExpires: now + tokens.data.refreshExpiresIn * 1000,
          };
        } catch (error) {
          // Los CredentialsSignin ya llevan su propio código; se relanzan
          // tal cual para que el cliente los reciba.
          if (error instanceof CredentialsSignin) throw error;

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
    // jwt se ejecuta en cada petición:
    //  - Al iniciar sesión rellena el token con los datos del usuario.
    //  - Si ya hay un error de refresh, no reintenta.
    //  - Si el access token sigue vigente (con margen), lo deja tal cual.
    //  - En caso contrario, lanza la renovación.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.subscription = user.subscription;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.refreshTokenExpires = user.refreshTokenExpires;
        token.error = undefined;
        return token;
      }

      if (token.error) return token;

      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - REFRESH_MARGIN_MS
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },

    // session expone al cliente solo lo necesario: nunca el refreshToken.
    session({ session, token }) {
      if (session.user) {
        if (typeof token.id === 'string') session.user.id = token.id;
        if (token.role) session.user.role = token.role;
        session.user.subscription = token.subscription;
      }
      // TODO: Si eliminamos session.accessToken, hay que cambiar la forma en que el endpoint
      // /api/graphql obtiene el access token. Merece una modificación separada para decidir
      // definitivamente cómo hacer que el access token sea server-side y no quede expuesto al cliente.
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  events: {
    // Al cerrar sesión, revoca el refresh token en el backend para que
    // no pueda reutilizarse. Si falla, solo se registra: la sesión local
    // ya se destruyó de todas formas.
    async signOut(message) {
      if (
        !('token' in message) ||
        !message.token?.refreshToken ||
        !API_BASE_URL
      )
        return;
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: message.token.refreshToken }),
        });
      } catch {
        logger.error('No se pudo revocar el refresh token en el backend');
      }
    },
  },
});
