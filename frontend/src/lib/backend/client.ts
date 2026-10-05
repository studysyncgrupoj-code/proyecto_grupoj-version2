import type { BackendPersonalData, BackendUser } from './types';

export interface BackendClient {
  users: {
    getMe(): Promise<BackendUser>;
  };

  personalData: {
    getMe(): Promise<BackendPersonalData>;
  };
}
