import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

export type UserRole = 'student' | 'teacher' | 'admin';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role?: UserRole;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role?: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: UserRole;
  }
}
