import type { UserRole } from '@/types/user';

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  profile: {
    bio: {
      title: string;
      description: string;
    } | null;
    interests: string[];
  };
}
