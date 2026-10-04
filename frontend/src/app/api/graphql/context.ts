import type { Session } from 'next-auth';

import type { BackendClient } from '@/lib/backend/client';

export interface GraphQLContext {
  session: Session | null;
  backend: BackendClient;
}
