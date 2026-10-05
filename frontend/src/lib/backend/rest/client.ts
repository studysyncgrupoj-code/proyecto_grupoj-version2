import type { BackendClient } from '../client';
import type {
  BackendAccount,
  BackendCertificate,
  BackendCourseEnrollment,
  BackendInvoice,
  BackendPaymentMethod,
  BackendPersonalData,
  BackendPreferences,
  BackendPrivacySettings,
  BackendPublicProfile,
  BackendSecurityOperationResult,
  BackendSecuritySettings,
  BackendSubscription,
  BackendSubscriptionPlan,
  BackendTwoFactorSetup,
  BackendUser,
} from '../types';

export class RestBackendClient implements BackendClient {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken?: string,
  ) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    // Contract between the GraphQL BFF and the principal backend.
    // The principal backend must implement these endpoints.
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {}),
        ...init.headers,
      },
    });
    if (!response.ok)
      throw new Error(`Backend request failed: ${response.status}`);
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  users = {
    getMe: () => this.request<BackendUser>('/users/me'),
    getPublicProfile: (userId: string) =>
      this.request<BackendPublicProfile | null>(
        `/users/${encodeURIComponent(userId)}/profile`,
      ),
    updateProfile: (
      input: Parameters<BackendClient['users']['updateProfile']>[0],
    ) =>
      this.request<BackendUser>('/users/me/profile', {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
  };
  personalData = {
    getMe: () => this.request<BackendPersonalData>('/users/me/personal-data'),
    update: (input: Parameters<BackendClient['personalData']['update']>[0]) =>
      this.request<BackendPersonalData>('/users/me/personal-data', {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
  };
  privacy = {
    getMe: () => this.request<BackendPrivacySettings>('/users/me/privacy'),
    update: (input: Parameters<BackendClient['privacy']['update']>[0]) =>
      this.request<BackendPrivacySettings>('/users/me/privacy', {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
  };
  security = {
    getMe: () => this.request<BackendSecuritySettings>('/users/me/security'),
    requestEmailChange: (
      input: Parameters<BackendClient['security']['requestEmailChange']>[0],
    ) =>
      this.request<BackendSecurityOperationResult>(
        '/users/me/security/email-change',
        { method: 'POST', body: JSON.stringify(input) },
      ),
    changePassword: (
      input: Parameters<BackendClient['security']['changePassword']>[0],
    ) =>
      this.request<BackendSecurityOperationResult>(
        '/users/me/security/password',
        { method: 'PUT', body: JSON.stringify(input) },
      ),
    beginTwoFactorSetup: () =>
      this.request<BackendTwoFactorSetup>(
        '/users/me/security/two-factor/setup',
        { method: 'POST' },
      ),
    verifyTwoFactorSetup: (code: string) =>
      this.request<BackendSecurityOperationResult>(
        '/users/me/security/two-factor/verify',
        { method: 'POST', body: JSON.stringify({ code }) },
      ),
    disableTwoFactor: (code: string) =>
      this.request<BackendSecurityOperationResult>(
        '/users/me/security/two-factor/disable',
        { method: 'POST', body: JSON.stringify({ code }) },
      ),
    revokeSession: (sessionId: string) =>
      this.request<BackendSecurityOperationResult>(
        `/users/me/security/sessions/${encodeURIComponent(sessionId)}`,
        { method: 'DELETE' },
      ),
    revokeOtherSessions: () =>
      this.request<BackendSecurityOperationResult>(
        '/users/me/security/sessions/others',
        { method: 'DELETE' },
      ),
  };
  preferences = {
    getMe: () => this.request<BackendPreferences>('/users/me/preferences'),
    update: (input: Parameters<BackendClient['preferences']['update']>[0]) =>
      this.request<BackendPreferences>('/users/me/preferences', {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
  };
  account = {
    getMe: () => this.request<BackendAccount>('/users/me/account'),
    requestDeactivation: () =>
      this.request<BackendAccount>('/users/me/account/deactivation', {
        method: 'POST',
      }),
    cancelDeactivation: () =>
      this.request<BackendAccount>('/users/me/account/deactivation', {
        method: 'DELETE',
      }),
  };
  courses = {
    getMe: () => this.request<BackendCourseEnrollment[]>('/users/me/courses'),
  };
  certificates = {
    getMe: () => this.request<BackendCertificate[]>('/users/me/certificates'),
  };
  subscription = {
    getMe: () =>
      this.request<BackendSubscription | null>('/users/me/subscription'),
    changePlan: (plan: BackendSubscriptionPlan) =>
      this.request<BackendSubscription>('/users/me/subscription/plan', {
        method: 'PUT',
        body: JSON.stringify({ plan }),
      }),
    cancel: () =>
      this.request<BackendSubscription>('/users/me/subscription/cancellation', {
        method: 'POST',
      }),
  };
  billing = {
    getPaymentMethods: () =>
      this.request<BackendPaymentMethod[]>('/users/me/payment-methods'),
    getInvoices: () => this.request<BackendInvoice[]>('/users/me/invoices'),
    removePaymentMethod: (paymentMethodId: string) =>
      this.request<boolean>(
        `/users/me/payment-methods/${encodeURIComponent(paymentMethodId)}`,
        { method: 'DELETE' },
      ),
  };
}
