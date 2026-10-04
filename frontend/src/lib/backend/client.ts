import type { BackendUser } from './types';

export interface BackendClient {
  users: {
    getMe(): Promise<BackendUser>;
  };
}
