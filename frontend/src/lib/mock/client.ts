import type { BackendClient } from '../backend/client';
import type { BackendPreferences } from '../backend/types';

const preferences: BackendPreferences = {
  language: 'es',
  theme: 'system',
  timezone: 'America/Bogota',
  notifications: { email: true, push: true, inApp: true },
  accessibility: { reducedMotion: false, highContrast: false },
};

export class MockBackendClient implements BackendClient {
  users = {
    getMe: async () => ({
      id: 'test-user-001',
      name: 'Test User',
      email: 'test@example.com',
      image: null,
      role: 'student' as const,
      profile: {
        bio: { title: 'Estudiante', description: 'Perfil de prueba' },
        interests: ['programming', 'technology'],
      },
    }),
    getPublicProfile: async (userId: string) =>
      userId === 'test-user-001'
        ? {
            id: 'test-user-001',
            name: 'Test User',
            image: null,
            bio: { title: 'Estudiante', description: 'Perfil de prueba' },
            interests: ['programming', 'technology'],
            email: null,
            phone: null,
          }
        : null,
    updateProfile: async (
      input: Parameters<BackendClient['users']['updateProfile']>[0],
    ) => ({
      id: 'test-user-001',
      name: 'Test User',
      email: 'test@example.com',
      image: null,
      role: 'student' as const,
      profile: {
        bio: input.bio ?? {
          title: 'Estudiante',
          description: 'Perfil de prueba',
        },
        interests: input.interests ?? ['programming', 'technology'],
      },
    }),
  };
  personalData = {
    getMe: async () => ({
      firstName: 'Test',
      lastName: 'User',
      documentId: '123456789',
      phone: '+57 300 000 0000',
      country: 'CO',
      address: 'Test address',
      identityLocked: false,
    }),
    update: async (
      input: Parameters<BackendClient['personalData']['update']>[0],
    ) => ({
      firstName: input.firstName ?? 'Test',
      lastName: input.lastName ?? 'User',
      documentId: input.documentId ?? '123456789',
      phone: input.phone ?? '+57 300 000 0000',
      country: input.country ?? 'CO',
      address: input.address ?? 'Test address',
      identityLocked: false,
    }),
  };
  privacy = {
    getMe: async () => ({
      profileVisibility: 'everyone' as const,
      emailVisibility: 'authenticated' as const,
      phoneVisibility: 'nobody' as const,
      allowDirectMessages: true,
    }),
    update: async (
      input: Parameters<BackendClient['privacy']['update']>[0],
    ) => ({
      profileVisibility: input.profileVisibility ?? 'everyone',
      emailVisibility: input.emailVisibility ?? 'authenticated',
      phoneVisibility: input.phoneVisibility ?? 'nobody',
      allowDirectMessages: input.allowDirectMessages ?? true,
    }),
  };
  security = {
    getMe: async () => ({
      email: 'test@example.com',
      emailVerified: true,
      twoFactorEnabled: false,
      twoFactorRequired: false,
      sessions: [
        {
          id: 'session-current',
          deviceName: 'Test device',
          browser: 'Test browser',
          ipAddress: '127.0.0.1',
          lastActiveAt: '2026-10-04T12:00:00.000Z',
          current: true,
        },
      ],
    }),
    requestEmailChange: async () => ({
      success: true,
      message: 'Verification email sent',
    }),
    changePassword: async () => ({
      success: true,
      message: 'Password updated',
    }),
    beginTwoFactorSetup: async () => ({
      secret: 'MOCKSECRET123',
      qrCode: 'data:image/png;base64,bW9jaw==',
    }),
    verifyTwoFactorSetup: async () => ({
      success: true,
      message: 'Two factor enabled',
    }),
    disableTwoFactor: async () => ({
      success: true,
      message: 'Two factor disabled',
    }),
    revokeSession: async () => ({ success: true, message: 'Session revoked' }),
    revokeOtherSessions: async () => ({
      success: true,
      message: 'Other sessions revoked',
    }),
  };
  preferences = {
    getMe: async () => preferences,
    update: async (
      input: Parameters<BackendClient['preferences']['update']>[0],
    ) => ({
      language: input.language ?? preferences.language,
      theme: input.theme ?? preferences.theme,
      timezone: input.timezone ?? preferences.timezone,
      notifications: { ...preferences.notifications, ...input.notifications },
      accessibility: { ...preferences.accessibility, ...input.accessibility },
    }),
  };
  account = {
    getMe: async () => ({
      status: 'active' as const,
      createdAt: '2024-01-01T00:00:00.000Z',
    }),
    requestDeactivation: async () => ({
      status: 'inactive' as const,
      createdAt: '2024-01-01T00:00:00.000Z',
    }),
    cancelDeactivation: async () => ({
      status: 'active' as const,
      createdAt: '2024-01-01T00:00:00.000Z',
    }),
  };
  courses = {
    getMe: async () => [
      {
        courseId: 'course-001',
        title: 'GraphQL básico',
        progress: 0.65,
        status: 'active' as const,
        enrolledAt: '2026-01-15T00:00:00.000Z',
        completedAt: null,
      },
    ],
  };
  certificates = {
    getMe: async () => [
      {
        id: 'certificate-001',
        courseId: 'course-000',
        courseTitle: 'Introducción a la programación',
        certificateNumber: 'CERT-2026-001',
        issuedAt: '2026-02-01T00:00:00.000Z',
        downloadUrl: 'https://example.com/certificates/CERT-2026-001',
      },
    ],
  };
  subscription = {
    getMe: async () => ({
      id: 'subscription-001',
      plan: 'free' as const,
      status: 'active' as const,
      startedAt: '2024-01-01T00:00:00.000Z',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    }),
    changePlan: async (
      plan: Parameters<BackendClient['subscription']['changePlan']>[0],
    ) => ({
      id: 'subscription-001',
      plan,
      status: 'active' as const,
      startedAt: '2024-01-01T00:00:00.000Z',
      currentPeriodEnd: '2026-11-04T00:00:00.000Z',
      cancelAtPeriodEnd: false,
    }),
    cancel: async () => ({
      id: 'subscription-001',
      plan: 'free' as const,
      status: 'canceled' as const,
      startedAt: '2024-01-01T00:00:00.000Z',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: true,
    }),
  };
  billing = {
    getPaymentMethods: async () => [
      {
        id: 'payment-001',
        brand: 'Visa',
        last4: '4242',
        expirationMonth: 12,
        expirationYear: 2028,
      },
    ],
    getInvoices: async () => [
      {
        id: 'invoice-001',
        number: 'INV-2026-001',
        amount: 0,
        currency: 'COP',
        status: 'paid' as const,
        issuedAt: '2026-01-01T00:00:00.000Z',
        downloadUrl: null,
      },
    ],
    removePaymentMethod: async () => true,
  };
}
