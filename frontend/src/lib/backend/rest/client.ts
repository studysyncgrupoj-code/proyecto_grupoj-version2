import type { BackendClient } from '../client';
import type { BackendUser } from '../types';

export class RestBackendClient implements BackendClient {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken?: string,
  ) {}

  users = {
    getMe: async (): Promise<BackendUser> => {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`);
      }

      return response.json() as Promise<BackendUser>;
    },
  };
}
