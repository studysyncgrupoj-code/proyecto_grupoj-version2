import type { BackendClient, PublicBackendClient } from '../backend/client';
import { BackendOperationError } from '../backend/errors';
import type { RestBackendResponse } from '../backend/http';
import type {
  BackendAccount,
  BackendContactInput,
  BackendForgotPasswordInput,
  BackendLoginInput,
  BackendLoginResponse,
  BackendPersonalData,
  BackendPreferences,
  BackendPrivacySettings,
  BackendProfile,
  BackendRegisterInput,
  BackendResetPasswordInput,
  BackendResetTokenValidationResponse,
  BackendSubscription,
  BackendTokenPair,
  BackendTokenPairResponse,
  BackendValidateResetTokenInput,
} from '../backend/types';

const MOCK_USER_ID = 'test-user-001';
const MOCK_ACCESS_TOKEN = 'mock-access-token';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token';
const MOCK_RESET_TOKEN = 'mock-reset-token';

type MockOperation =
  | 'users.getMe'
  | 'users.getPublicProfile'
  | 'users.updateProfile'
  | 'personalData.getMe'
  | 'personalData.update'
  | 'privacy.getMe'
  | 'privacy.update'
  | 'security.getMe'
  | 'security.requestEmailChange'
  | 'security.changePassword'
  | 'security.beginTwoFactorSetup'
  | 'security.verifyTwoFactorSetup'
  | 'security.disableTwoFactor'
  | 'security.revokeSession'
  | 'security.revokeOtherSessions'
  | 'preferences.getMe'
  | 'preferences.update'
  | 'account.getMe'
  | 'account.requestDeactivation'
  | 'account.cancelDeactivation'
  | 'courses.getMe'
  | 'certificates.getMe'
  | 'subscription.getMe'
  | 'subscription.changePlan'
  | 'subscription.cancel'
  | 'billing.getPaymentMethods'
  | 'billing.getInvoices'
  | 'billing.removePaymentMethod';

export type MockFailureMap = Partial<
  Record<MockOperation, { status: number; code: string }>
>;

function mockResponse<T>(body: T, status = 200): RestBackendResponse<T> {
  return { status, ok: status >= 200 && status < 300, body };
}

function mockApiError<T = unknown>(
  status: number,
  code: string,
  message: string,
): RestBackendResponse<T> {
  return mockResponse({ error: { code, message, details: null } } as T, status);
}

function mockTokenPair(): BackendTokenPair {
  return {
    token: MOCK_ACCESS_TOKEN,
    refreshToken: MOCK_REFRESH_TOKEN,
    expiresIn: 3600,
    refreshExpiresIn: 60 * 60 * 24 * 7,
  };
}

const initialPreferences: BackendPreferences = {
  language: 'es',
  theme: 'system',
  timezone: 'America/Bogota',
  notifications: { email: true, push: true, inApp: true },
  accessibility: { reducedMotion: false, highContrast: false },
};

const initialPersonalData = {
  firstName: 'Test',
  lastName: 'User',
  documentId: '123456789',
  phone: '+573000000000',
  country: 'CO',
  address: 'Test address',
  identityLocked: false,
};

export class MockBackendClient implements BackendClient {
  private readonly failures: MockFailureMap;
  private profileState: BackendProfile = {
    bio: { title: 'Estudiante', description: 'Perfil de prueba' },
    interests: ['programming', 'technology'],
  };
  private personalDataState: BackendPersonalData = { ...initialPersonalData };
  private privacyState: BackendPrivacySettings = {
    profileVisibility: 'everyone' as const,
    emailVisibility: 'authenticated' as const,
    phoneVisibility: 'nobody' as const,
    allowDirectMessages: true,
  };
  private preferencesState: BackendPreferences = {
    ...initialPreferences,
    notifications: { ...initialPreferences.notifications },
    accessibility: { ...initialPreferences.accessibility },
  };
  private securityState = {
    email: 'test@example.com',
    emailVerified: true,
    twoFactorEnabled: false,
    twoFactorRequired: false,
    twoFactorSetupStarted: false,
    sessions: [
      {
        id: 'session-current',
        deviceName: 'Test device',
        browser: 'Test browser',
        ipAddress: '127.0.0.1',
        lastActiveAt: '2026-10-04T12:00:00.000Z',
        current: true,
      },
      {
        id: 'session-other',
        deviceName: 'Other device',
        browser: 'Test browser',
        ipAddress: '127.0.0.2',
        lastActiveAt: '2026-10-03T12:00:00.000Z',
        current: false,
      },
    ],
  };
  private accountState: BackendAccount = {
    status: 'active',
    deactivationScheduledAt: null,
  };
  private subscriptionState: BackendSubscription | null = {
    id: 'subscription-001',
    plan: 'free' as const,
    status: 'active' as const,
    startedAt: '2024-01-01T00:00:00.000Z',
    currentPeriodEnd: null as string | null,
    cancelAtPeriodEnd: false,
  };
  private readonly paymentMethods = [
    {
      id: 'payment-001',
      brand: 'Visa',
      last4: '4242',
      expirationMonth: 12,
      expirationYear: 2028,
    },
  ];

  constructor(options: { failures?: MockFailureMap } = {}) {
    this.failures = options.failures ?? {};
  }

  private failIfConfigured(operation: MockOperation): void {
    const failure = this.failures[operation];
    if (failure) throw new BackendOperationError(failure.status, failure.code);
  }

  users = {
    getMe: async () => {
      this.failIfConfigured('users.getMe');
      return {
        id: MOCK_USER_ID,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        role: 'student' as const,
        profile: {
          bio: this.profileState.bio ? { ...this.profileState.bio } : null,
          interests: [...this.profileState.interests],
        },
      };
    },
    getPublicProfile: async (userId: string) => {
      this.failIfConfigured('users.getPublicProfile');
      if (userId !== MOCK_USER_ID) return null;
      return {
        id: MOCK_USER_ID,
        name: 'Test User',
        image: null,
        bio: this.profileState.bio ? { ...this.profileState.bio } : null,
        interests: [...this.profileState.interests],
        email: null,
        phone: null,
      };
    },
    updateProfile: async (
      input: Parameters<BackendClient['users']['updateProfile']>[0],
    ) => {
      this.failIfConfigured('users.updateProfile');
      if (input.bio !== undefined) this.profileState.bio = input.bio;
      if (input.interests !== undefined) {
        this.profileState.interests = input.interests ?? [];
      }
      return {
        id: MOCK_USER_ID,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        role: 'student' as const,
        profile: {
          bio: this.profileState.bio ? { ...this.profileState.bio } : null,
          interests: [...this.profileState.interests],
        },
      };
    },
  };

  personalData = {
    getMe: async () => {
      this.failIfConfigured('personalData.getMe');
      return { ...this.personalDataState };
    },
    update: async (
      input: Parameters<BackendClient['personalData']['update']>[0],
    ) => {
      this.failIfConfigured('personalData.update');
      if (this.personalDataState.identityLocked) {
        throw new BackendOperationError(403, 'FORBIDDEN');
      }
      this.personalDataState = {
        ...this.personalDataState,
        ...Object.fromEntries(
          Object.entries(input).filter(([, value]) => value !== undefined),
        ),
        identityLocked: this.personalDataState.identityLocked,
      };
      return { ...this.personalDataState };
    },
  };

  privacy = {
    getMe: async () => {
      this.failIfConfigured('privacy.getMe');
      return { ...this.privacyState };
    },
    update: async (
      input: Parameters<BackendClient['privacy']['update']>[0],
    ) => {
      this.failIfConfigured('privacy.update');
      this.privacyState = { ...this.privacyState, ...input };
      return { ...this.privacyState };
    },
  };

  security = {
    getMe: async () => {
      this.failIfConfigured('security.getMe');
      const { twoFactorSetupStarted: _setup, ...settings } = this.securityState;
      return {
        ...settings,
        sessions: settings.sessions.map((session) => ({ ...session })),
      };
    },
    requestEmailChange: async (
      input: Parameters<BackendClient['security']['requestEmailChange']>[0],
    ) => {
      this.failIfConfigured('security.requestEmailChange');
      if (input.newEmail === this.securityState.email) {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      if (input.newEmail === 'taken@example.com') {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.newEmail)) {
        throw new BackendOperationError(422, 'VALIDATION_ERROR');
      }
      return { success: true, message: 'Verification email sent' };
    },
    changePassword: async (
      input: Parameters<BackendClient['security']['changePassword']>[0],
    ) => {
      this.failIfConfigured('security.changePassword');
      if (input.currentPassword !== 'old-password') {
        throw new BackendOperationError(422, 'INVALID_CURRENT_PASSWORD');
      }
      if (input.newPassword === input.currentPassword) {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      if (
        input.newPassword.length < 6 ||
        input.newPassword.length > 15 ||
        !/[a-z]/.test(input.newPassword) ||
        !/[A-Z]/.test(input.newPassword) ||
        !/[^A-Za-z0-9]/.test(input.newPassword)
      ) {
        throw new BackendOperationError(422, 'VALIDATION_ERROR');
      }
      return { success: true, message: 'Password updated' };
    },
    beginTwoFactorSetup: async () => {
      this.failIfConfigured('security.beginTwoFactorSetup');
      if (this.securityState.twoFactorEnabled) {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      this.securityState.twoFactorSetupStarted = true;
      return {
        secret: 'MOCKSECRET123',
        qrCode: 'data:image/png;base64,bW9jaw==',
      };
    },
    verifyTwoFactorSetup: async (code: string) => {
      this.failIfConfigured('security.verifyTwoFactorSetup');
      if (
        !this.securityState.twoFactorSetupStarted ||
        this.securityState.twoFactorEnabled
      ) {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      if (code !== '123456') {
        throw new BackendOperationError(422, 'INVALID_CODE');
      }
      this.securityState.twoFactorEnabled = true;
      this.securityState.twoFactorSetupStarted = false;
      return { success: true, message: 'Two factor enabled' };
    },
    disableTwoFactor: async (code: string) => {
      this.failIfConfigured('security.disableTwoFactor');
      if (this.securityState.twoFactorRequired) {
        throw new BackendOperationError(403, 'FORBIDDEN');
      }
      if (code !== '123456') {
        throw new BackendOperationError(422, 'INVALID_CODE');
      }
      this.securityState.twoFactorEnabled = false;
      return { success: true, message: 'Two factor disabled' };
    },
    revokeSession: async (sessionId: string) => {
      this.failIfConfigured('security.revokeSession');
      const sessionIndex = this.securityState.sessions.findIndex(
        (session) => session.id === sessionId,
      );
      if (sessionIndex < 0) throw new BackendOperationError(404, 'NOT_FOUND');
      this.securityState.sessions.splice(sessionIndex, 1);
      return { success: true, message: 'Session revoked' };
    },
    revokeOtherSessions: async () => {
      this.failIfConfigured('security.revokeOtherSessions');
      this.securityState.sessions = this.securityState.sessions.filter(
        (session) => session.current,
      );
      return { success: true, message: 'Other sessions revoked' };
    },
  };

  preferences = {
    getMe: async () => {
      this.failIfConfigured('preferences.getMe');
      return {
        ...this.preferencesState,
        notifications: { ...this.preferencesState.notifications },
        accessibility: { ...this.preferencesState.accessibility },
      };
    },
    update: async (
      input: Parameters<BackendClient['preferences']['update']>[0],
    ) => {
      this.failIfConfigured('preferences.update');
      if (
        input.language === null ||
        (input.language !== undefined &&
          !['es', 'en'].includes(input.language)) ||
        input.theme === null ||
        (input.theme !== undefined &&
          !['system', 'light', 'dark'].includes(input.theme)) ||
        (input.timezone !== undefined &&
          input.timezone !== null &&
          !isValidTimezone(input.timezone)) ||
        input.timezone === null
      ) {
        throw new BackendOperationError(422, 'VALIDATION_ERROR');
      }
      const notifications = input.notifications;
      const accessibility = input.accessibility;
      this.preferencesState = {
        ...this.preferencesState,
        ...(input.language === undefined ? {} : { language: input.language }),
        ...(input.theme === undefined ? {} : { theme: input.theme }),
        ...(input.timezone === undefined ? {} : { timezone: input.timezone }),
        notifications: {
          ...this.preferencesState.notifications,
          ...(notifications ?? {}),
        },
        accessibility: {
          ...this.preferencesState.accessibility,
          ...(accessibility ?? {}),
        },
      };
      return {
        ...this.preferencesState,
        notifications: { ...this.preferencesState.notifications },
        accessibility: { ...this.preferencesState.accessibility },
      };
    },
  };

  account = {
    getMe: async () => {
      this.failIfConfigured('account.getMe');
      return { ...this.accountState };
    },
    requestDeactivation: async () => {
      this.failIfConfigured('account.requestDeactivation');
      if (this.accountState.status !== 'active') {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      this.accountState = {
        status: 'pending_deactivation',
        deactivationScheduledAt: '2026-10-13T00:00:00.000Z',
      };
      return { ...this.accountState };
    },
    cancelDeactivation: async () => {
      this.failIfConfigured('account.cancelDeactivation');
      if (this.accountState.status !== 'pending_deactivation') {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      this.accountState = { status: 'active', deactivationScheduledAt: null };
      return { ...this.accountState };
    },
  };

  courses = {
    getMe: async () => {
      this.failIfConfigured('courses.getMe');
      return [
        {
          courseId: 'course-001',
          title: 'GraphQL básico',
          progress: 0.65,
          status: 'active' as const,
          enrolledAt: '2026-01-15T00:00:00.000Z',
          completedAt: null,
        },
      ];
    },
  };

  certificates = {
    getMe: async () => {
      this.failIfConfigured('certificates.getMe');
      return [
        {
          id: 'certificate-001',
          courseId: 'course-000',
          courseTitle: 'Introducción a la programación',
          certificateNumber: 'CERT-2026-001',
          issuedAt: '2026-02-01T00:00:00.000Z',
          downloadUrl: 'https://example.com/certificates/CERT-2026-001',
        },
      ];
    },
  };

  subscription = {
    getMe: async () => {
      this.failIfConfigured('subscription.getMe');
      return this.subscriptionState ? { ...this.subscriptionState } : null;
    },
    changePlan: async (
      plan: Parameters<BackendClient['subscription']['changePlan']>[0],
    ) => {
      this.failIfConfigured('subscription.changePlan');
      if (this.subscriptionState?.plan === 'enterprise') {
        throw new BackendOperationError(403, 'FORBIDDEN');
      }
      if (plan === 'enterprise') {
        throw new BackendOperationError(403, 'FORBIDDEN');
      }
      if (!this.subscriptionState) {
        throw new BackendOperationError(404, 'NOT_FOUND');
      }
      if (plan === this.subscriptionState.plan) {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      if (plan === 'premium' && !this.paymentMethods.length) {
        throw new BackendOperationError(409, 'PAYMENT_METHOD_REQUIRED');
      }
      this.subscriptionState = {
        ...this.subscriptionState,
        plan,
        status: 'active',
        currentPeriodEnd: '2026-11-04T00:00:00.000Z',
        cancelAtPeriodEnd: false,
      };
      return { ...this.subscriptionState };
    },
    cancel: async () => {
      this.failIfConfigured('subscription.cancel');
      if (!this.subscriptionState) {
        throw new BackendOperationError(404, 'NOT_FOUND');
      }
      if (this.subscriptionState.status === 'canceled') {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      this.subscriptionState = {
        ...this.subscriptionState,
        status: 'canceled',
        cancelAtPeriodEnd: true,
      };
      return { ...this.subscriptionState };
    },
  };

  billing = {
    getPaymentMethods: async () => {
      this.failIfConfigured('billing.getPaymentMethods');
      return this.paymentMethods.map((method) => ({ ...method }));
    },
    getInvoices: async () => {
      this.failIfConfigured('billing.getInvoices');
      return [
        {
          id: 'invoice-001',
          number: 'INV-2026-001',
          amount: 0,
          currency: 'COP',
          status: 'paid' as const,
          issuedAt: '2026-01-01T00:00:00.000Z',
          downloadUrl: null,
        },
      ];
    },
    removePaymentMethod: async (paymentMethodId: string) => {
      this.failIfConfigured('billing.removePaymentMethod');
      const index = this.paymentMethods.findIndex(
        (method) => method.id === paymentMethodId,
      );
      if (index < 0) throw new BackendOperationError(404, 'NOT_FOUND');
      if (
        this.paymentMethods.length === 1 &&
        this.subscriptionState?.plan === 'premium' &&
        this.subscriptionState.status === 'active'
      ) {
        throw new BackendOperationError(409, 'CONFLICT');
      }
      this.paymentMethods.splice(index, 1);
      return true;
    },
  };
}

export class MockPublicBackendClient implements PublicBackendClient {
  private readonly validRefreshTokens = new Set([MOCK_REFRESH_TOKEN]);
  private readonly resetTokens = new Set([MOCK_RESET_TOKEN]);

  auth = {
    login: async (
      input: BackendLoginInput,
    ): Promise<RestBackendResponse<BackendLoginResponse>> => {
      if (
        input.email === 'invalid@example.com' ||
        input.password === 'wrong-password'
      ) {
        return mockApiError<BackendLoginResponse>(
          401,
          'UNAUTHENTICATED',
          'Credenciales incorrectas.',
        );
      }
      if (input.email.startsWith('ratelimited+')) {
        return mockApiError<BackendLoginResponse>(
          429,
          'RATE_LIMITED',
          'Demasiados intentos.',
        );
      }
      const data: BackendLoginResponse = {
        status: 200,
        message: 'OK',
        data: {
          firstName: 'Test',
          lastName: 'User',
          id: MOCK_USER_ID,
          role: 'student',
          subscription: 'free',
          image: null,
          ...mockTokenPair(),
        },
      };
      return mockResponse(data);
    },

    refresh: async (
      refreshToken: string,
    ): Promise<RestBackendResponse<BackendTokenPairResponse>> => {
      if (!this.validRefreshTokens.has(refreshToken)) {
        return mockApiError<BackendTokenPairResponse>(
          401,
          'UNAUTHENTICATED',
          'Refresh token inválido.',
        );
      }

      // Rotación: el token usado deja de ser válido y se emite uno nuevo.
      this.validRefreshTokens.delete(refreshToken);

      const pair = mockTokenPair();
      this.validRefreshTokens.add(pair.refreshToken);

      return mockResponse({
        status: 200,
        message: 'OK',
        data: pair,
      });
    },

    logout: async (refreshToken: string) => {
      if (!this.validRefreshTokens.has(refreshToken)) {
        return mockApiError(401, 'UNAUTHENTICATED', 'Refresh token inválido.');
      }
      this.validRefreshTokens.delete(refreshToken);
      return mockResponse({ status: 200, message: 'OK' });
    },

    register: async (input: BackendRegisterInput) => {
      if (input.email.toLowerCase() === 'test@example.com') {
        return mockApiError(409, 'CONFLICT', 'El correo ya está registrado.');
      }

      if (
        !isValidName(input.firstName) ||
        !isValidName(input.lastName) ||
        !isValidEmail(input.email) ||
        !isValidPassword(input.password)
      ) {
        return mockApiError(422, 'VALIDATION_ERROR', 'Datos inválidos.');
      }

      return mockResponse({ status: 201, message: 'Cuenta creada.' }, 201);
    },

    forgotPassword: async (_input: BackendForgotPasswordInput) =>
      mockResponse({
        status: 200,
        message: 'Si la cuenta existe, recibirá un correo.',
      }),

    validateResetToken: async (
      input: BackendValidateResetTokenInput,
    ): Promise<RestBackendResponse<BackendResetTokenValidationResponse>> => {
      if (!this.resetTokens.has(input.token)) {
        return mockApiError(
          400,
          'INVALID_RESET_TOKEN',
          'El token no es válido.',
        );
      }
      return mockResponse({ valid: true });
    },

    resetPassword: async (input: BackendResetPasswordInput) => {
      if (!this.resetTokens.has(input.token)) {
        return mockApiError(
          400,
          'INVALID_RESET_TOKEN',
          'El token no es válido.',
        );
      }
      if (!isValidPassword(input.newPassword)) {
        return mockApiError(
          422,
          'VALIDATION_ERROR',
          'La contraseña no cumple los requisitos.',
        );
      }
      this.resetTokens.delete(input.token);
      return mockResponse({ status: 200, message: 'Contraseña actualizada.' });
    },
  };

  contact: PublicBackendClient['contact'] = {
    submit: async (input: BackendContactInput) => {
      if (
        !isValidName(input.name) ||
        !isValidEmail(input.email) ||
        (input.contactNumber !== undefined &&
          input.contactNumber !== null &&
          input.contactNumber.trim().length > 0 &&
          !isValidE164(input.contactNumber)) ||
        !isValidSubject(input.subject) ||
        !isValidMessage(input.message)
      ) {
        return mockApiError(
          422,
          'VALIDATION_ERROR',
          'Los datos de contacto no son válidos.',
        );
      }
      return mockResponse({ status: 200, message: 'Mensaje recibido.' });
    },
  };
}

/* ============================================================
 * Helpers de validación (compartidos con el contrato BACKEND_API.md)
 * ============================================================ */

function isValidPassword(password: string): boolean {
  return (
    typeof password === 'string' &&
    password.length >= 6 &&
    password.length <= 15 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function isValidName(value: string): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 2 || trimmed.length > 100) return false;
  return /^[\p{L}\s'.-]+$/u.test(trimmed);
}

function isValidEmail(value: string): boolean {
  if (typeof value !== 'string') return false;
  if (value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidE164(value: string): boolean {
  return /^\+[1-9]\d{1,14}$/.test(value);
}

function isValidSubject(value: string): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 5 || trimmed.length > 150) return false;
  return !/[<>{}]/.test(trimmed);
}

function isValidMessage(value: string): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 20 || trimmed.length > 2000) return false;
  return !/[<>]/.test(trimmed);
}

function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}
