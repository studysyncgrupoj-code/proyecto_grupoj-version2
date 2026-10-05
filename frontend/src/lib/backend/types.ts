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

export interface BackendPersonalData {
  firstName: string;
  lastName: string;
  documentId: string | null;
  phone: string | null;
  country: string | null;
  address: string | null;
  identityLocked: boolean;
}
