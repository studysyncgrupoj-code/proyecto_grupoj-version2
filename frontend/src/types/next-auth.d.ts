import type { DefaultSession } from 'next-auth';

// Definimos los roles válidos en tu aplicación
export type UserRole = 'student' | 'teacher' | 'admin';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role?: UserRole;
    };
  }

  interface User {
    role?: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
