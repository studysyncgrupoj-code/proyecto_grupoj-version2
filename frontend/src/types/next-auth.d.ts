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
    accessToken?: string;
    error?: 'RefreshTokenExpired' | 'RefreshTokenError';
  }

  interface User extends DefaultUser, UserProfile {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT, Partial<UserProfile> {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    error?: 'RefreshTokenExpired' | 'RefreshTokenError';
  }
}
