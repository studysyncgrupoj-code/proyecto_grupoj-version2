import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

export type UserRole = 'student' | 'teacher' | 'admin';
export type SubscriptionType = 'free' | 'premium' | 'enterprise';

interface UserProfile {
  id: string;
  role: UserRole;
  subscription?: SubscriptionType; // solo aplica a 'student'
}

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & UserProfile;
  }

  interface User extends DefaultUser, UserProfile {}
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT, Partial<UserProfile> {}
}
