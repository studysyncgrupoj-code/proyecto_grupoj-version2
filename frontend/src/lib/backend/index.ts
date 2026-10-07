import { MockBackendClient } from '../mock/client';
import type { BackendClient } from './client';
import {
  createRestBackendClient,
  readBackendErrorCode,
  RestBackendClient,
  RestBackendNotConfiguredError,
  RestBackendUnavailableError,
} from './rest/client';

export type { RestBackendResponse } from './rest/client';
export {
  createRestBackendClient,
  readBackendErrorCode,
  RestBackendClient,
  RestBackendNotConfiguredError,
  RestBackendUnavailableError,
};

export function createBackendClient(accessToken?: string): BackendClient {
  const baseUrl = process.env.API_BASE_URL;

  // Si no existe API_BASE_URL, usamos el mock automáticamente.
  if (!baseUrl) {
    return new MockBackendClient();
  }

  // Si existe API_BASE_URL, usamos el backend real.
  return new RestBackendClient(baseUrl, accessToken);
}
