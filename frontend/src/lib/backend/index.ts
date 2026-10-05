import { MockBackendClient } from '../mock/client';
import type { BackendClient } from './client';
import { RestBackendClient } from './rest/client';

export function createBackendClient(accessToken?: string): BackendClient {
  const useMock = process.env.BACKEND_CLIENT === 'mock';

  // TODO(backend): eliminar el mock cuando
  // el backend principal esté disponible.

  if (useMock) {
    return new MockBackendClient();
  }

  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API_BASE_URL is not configured');
  }

  return new RestBackendClient(baseUrl, accessToken);
}
