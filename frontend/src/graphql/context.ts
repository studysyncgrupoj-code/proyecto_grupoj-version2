import type { BackendClient } from '@/lib/backend/client';
import type { Session } from 'next-auth';

export interface GraphQLContext {
  session: Session | null;
  backend: BackendClient;
}
