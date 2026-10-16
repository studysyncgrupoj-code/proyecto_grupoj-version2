import { graphql } from 'graphql';
import { schema } from '../src/graphql';
import type { GraphQLContext } from '../src/graphql/context';
import {
  MockBackendClient,
  MockPublicBackendClient,
} from '../src/lib/mock/client';

const backend = new MockBackendClient();
const contextValue: GraphQLContext = {
  backend,
  session: {
    user: { id: 'test-user-001', email: 'test@example.com', name: 'Test User' },
    expires: '2099-01-01T00:00:00.000Z',
  } as GraphQLContext['session'],
};

type TestCase = {
  name: string;
  query: string;
  variables?: Record<string, unknown>;
};

type GraphQLResponse = {
  data?: Record<string, unknown> | null;
  errors?: Array<{
    message: string;
  }>;
};

const tests: TestCase[] = [
  // ============================================================
  // USER
  // ============================================================

  {
    name: 'me',
    query: /* GraphQL */ `
      query Me {
        me {
          id
          name
          email
          image
          role
          profile {
            bio {
              title
              description
            }
            interests
          }
        }
      }
    `,
  },

  // ============================================================
  // PERSONAL DATA
  // ============================================================

  {
    name: 'myPersonalData',
    query: /* GraphQL */ `
      query MyPersonalData {
        myPersonalData {
          firstName
          lastName
          documentId
          phone
          country
          address
          identityLocked
        }
      }
    `,
  },

  {
    name: 'updatePersonalData',
    query: /* GraphQL */ `
      mutation UpdatePersonalData($input: UpdatePersonalDataInput!) {
        updatePersonalData(input: $input) {
          firstName
          lastName
          documentId
          phone
          country
          address
          identityLocked
        }
      }
    `,
    variables: {
      input: {
        firstName: 'Test',
        lastName: 'Updated',
        documentId: '987654321',
        phone: '+57 300 111 2222',
        country: 'CO',
        address: 'Updated address',
      },
    },
  },

  // ============================================================
  // PRIVACY
  // ============================================================

  {
    name: 'myPrivacySettings',
    query: /* GraphQL */ `
      query MyPrivacySettings {
        myPrivacySettings {
          profileVisibility
          emailVisibility
          phoneVisibility
          allowDirectMessages
        }
      }
    `,
  },

  {
    name: 'updatePrivacySettings',
    query: /* GraphQL */ `
      mutation UpdatePrivacySettings($input: UpdatePrivacySettingsInput!) {
        updatePrivacySettings(input: $input) {
          profileVisibility
          emailVisibility
          phoneVisibility
          allowDirectMessages
        }
      }
    `,
    variables: {
      input: {
        profileVisibility: 'authenticated',
        emailVisibility: 'nobody',
        phoneVisibility: 'nobody',
        allowDirectMessages: false,
      },
    },
  },

  // ============================================================
  // SECURITY
  // ============================================================

  {
    name: 'mySecuritySettings',
    query: /* GraphQL */ `
      query MySecuritySettings {
        mySecuritySettings {
          email
          emailVerified
          twoFactorEnabled
          twoFactorRequired
          sessions {
            id
            deviceName
            browser
            ipAddress
            lastActiveAt
            current
          }
        }
      }
    `,
  },

  {
    name: 'requestEmailChange',
    query: /* GraphQL */ `
      mutation RequestEmailChange($input: RequestEmailChangeInput!) {
        requestEmailChange(input: $input) {
          success
          message
        }
      }
    `,
    variables: {
      input: {
        newEmail: 'new@example.com',
      },
    },
  },

  {
    name: 'changePassword',
    query: /* GraphQL */ `
      mutation ChangePassword($input: ChangePasswordInput!) {
        changePassword(input: $input) {
          success
          message
        }
      }
    `,
    variables: {
      input: {
        currentPassword: 'old-password',
        newPassword: 'NewPassword1!',
      },
    },
  },

  {
    name: 'beginTwoFactorSetup',
    query: /* GraphQL */ `
      mutation BeginTwoFactorSetup {
        beginTwoFactorSetup {
          secret
          qrCode
        }
      }
    `,
  },

  {
    name: 'verifyTwoFactorSetup',
    query: /* GraphQL */ `
      mutation VerifyTwoFactorSetup {
        verifyTwoFactorSetup(code: "123456") {
          success
          message
        }
      }
    `,
  },

  {
    name: 'disableTwoFactor',
    query: /* GraphQL */ `
      mutation DisableTwoFactor {
        disableTwoFactor(code: "123456") {
          success
          message
        }
      }
    `,
  },

  {
    name: 'revokeSession',
    query: /* GraphQL */ `
      mutation RevokeSession($sessionId: ID!) {
        revokeSession(sessionId: $sessionId) {
          success
          message
        }
      }
    `,
    variables: {
      sessionId: 'session-other',
    },
  },

  {
    name: 'revokeOtherSessions',
    query: /* GraphQL */ `
      mutation RevokeOtherSessions {
        revokeOtherSessions {
          success
          message
        }
      }
    `,
  },

  // ============================================================
  // PREFERENCES
  // ============================================================

  {
    name: 'myPreferences',
    query: /* GraphQL */ `
      query MyPreferences {
        myPreferences {
          language
          theme
          timezone
          notifications {
            email
            push
            inApp
          }
          accessibility {
            reducedMotion
            highContrast
          }
        }
      }
    `,
  },

  {
    name: 'updatePreferences',
    query: /* GraphQL */ `
      mutation UpdatePreferences($input: UpdatePreferencesInput!) {
        updatePreferences(input: $input) {
          language
          theme
          timezone
          notifications {
            email
            push
            inApp
          }
          accessibility {
            reducedMotion
            highContrast
          }
        }
      }
    `,
    variables: {
      input: {
        language: 'es',
        theme: 'light',
        timezone: 'America/Bogota',
      },
    },
  },

  // ============================================================
  // ACCOUNT
  // ============================================================

  {
    name: 'myAccount',
    query: /* GraphQL */ `
      query MyAccount {
        myAccount {
          status
          deactivationScheduledAt
        }
      }
    `,
  },

  {
    name: 'requestAccountDeactivation',
    query: /* GraphQL */ `
      mutation RequestAccountDeactivation {
        requestAccountDeactivation {
          status
          deactivationScheduledAt
        }
      }
    `,
  },

  {
    name: 'cancelAccountDeactivation',
    query: /* GraphQL */ `
      mutation CancelAccountDeactivation {
        cancelAccountDeactivation {
          status
          deactivationScheduledAt
        }
      }
    `,
  },

  // ============================================================
  // COURSES
  // ============================================================

  {
    name: 'myCourses',
    query: /* GraphQL */ `
      query MyCourses {
        myCourses {
          courseId
          title
          progress
          status
          enrolledAt
          completedAt
        }
      }
    `,
  },

  // ============================================================
  // CERTIFICATES
  // ============================================================

  {
    name: 'myCertificates',
    query: /* GraphQL */ `
      query MyCertificates {
        myCertificates {
          id
          courseId
          courseTitle
          certificateNumber
          issuedAt
          downloadUrl
        }
      }
    `,
  },

  // ============================================================
  // BILLING
  // ============================================================

  {
    name: 'mySubscription',
    query: /* GraphQL */ `
      query MySubscription {
        mySubscription {
          id
          plan
          status
          startedAt
          currentPeriodEnd
          cancelAtPeriodEnd
        }
      }
    `,
  },

  {
    name: 'changeSubscriptionPlan',
    query: /* GraphQL */ `
      mutation ChangeSubscriptionPlan($plan: SubscriptionPlan!) {
        changeSubscriptionPlan(plan: $plan) {
          id
          plan
          status
          startedAt
          currentPeriodEnd
          cancelAtPeriodEnd
        }
      }
    `,
    variables: {
      plan: 'premium',
    },
  },

  {
    name: 'cancelSubscription',
    query: /* GraphQL */ `
      mutation CancelSubscription {
        cancelSubscription {
          id
          plan
          status
          startedAt
          currentPeriodEnd
          cancelAtPeriodEnd
        }
      }
    `,
  },

  {
    name: 'myPaymentMethods',
    query: /* GraphQL */ `
      query MyPaymentMethods {
        myPaymentMethods {
          id
          brand
          last4
          expirationMonth
          expirationYear
        }
      }
    `,
  },

  {
    name: 'myInvoices',
    query: /* GraphQL */ `
      query MyInvoices {
        myInvoices {
          id
          number
          amount
          currency
          status
          issuedAt
          downloadUrl
        }
      }
    `,
  },

  {
    name: 'removePaymentMethod',
    query: /* GraphQL */ `
      mutation RemovePaymentMethod($paymentMethodId: ID!) {
        removePaymentMethod(paymentMethodId: $paymentMethodId)
      }
    `,
    variables: {
      paymentMethodId: 'payment-001',
    },
  },

  // ============================================================
  // PROFILE
  // ============================================================

  {
    name: 'publicProfile',
    query: /* GraphQL */ `
      query PublicProfile($userId: ID!) {
        publicProfile(userId: $userId) {
          id
          name
          image
          bio {
            title
            description
          }
          interests
          email
          phone
        }
      }
    `,
    variables: {
      userId: 'test-user-001',
    },
  },

  {
    name: 'updateProfile',
    query: /* GraphQL */ `
      mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
          id
          name
          email
          image
          role
          profile {
            bio {
              title
              description
            }
            interests
          }
        }
      }
    `,
    variables: {
      input: {
        bio: {
          title: 'Test User',
          description: 'Updated test profile',
        },
        interests: ['programming', 'technology'],
      },
    },
  },
];

function getOperationType(query: string): string {
  const match = query.match(/\b(query|mutation|subscription)\b/);

  return match?.[1] ?? 'unknown';
}

async function runTest(test: TestCase) {
  const result = await graphql({
    schema,
    source: test.query,
    variableValues: test.variables,
    contextValue,
  });
  if (result.errors?.length) {
    return {
      success: false,
      error: result.errors.map((error) => error.message).join('; '),
    };
  }

  if (!result.data) {
    return {
      success: false,
      error: 'GraphQL response does not contain data',
    };
  }

  return {
    success: true,
  };
}

/**
 * Envuelve un check público para que cada ejecución arranque con un
 * `MockPublicBackendClient` nuevo.
 *
 * Necesario porque el mock mantiene estado interno (por ejemplo, el
 * Set de refresh tokens válidos que se rota en cada refresh). Si todos
 * los checks comparten instancia, un refresh consume el token y el
 * logout posterior falla con 401.
 *
 * Cada check debe ser independiente: su resultado no debe depender de
 * lo que hayan hecho los checks anteriores.
 */
function withFreshPublicMock<T>(
  run: (client: MockPublicBackendClient) => Promise<T>,
): () => Promise<T> {
  return () => run(new MockPublicBackendClient());
}

async function main() {
  console.log('');
  console.log('==========================================');
  console.log(' GraphQL mock flow tests');
  console.log('==========================================');
  console.log('');
  console.log('Backend: in-process mock client');
  console.log(`Tests:    ${tests.length}`);
  console.log('');

  let passed = 0;
  let failed = 0;

  const publicApiChecks: Array<
    [string, () => Promise<{ ok: boolean; status: number }>]
  > = [
    [
      'POST /auth/login',
      withFreshPublicMock((c) =>
        c.auth.login({
          email: 'mock@example.com',
          password: 'ValidPass1!',
        }),
      ),
    ],
    [
      'POST /auth/refresh',
      withFreshPublicMock((c) => c.auth.refresh('mock-refresh-token')),
    ],
    [
      'POST /auth/logout',
      withFreshPublicMock((c) => c.auth.logout('mock-refresh-token')),
    ],
    [
      'POST /auth/register',
      withFreshPublicMock((c) =>
        c.auth.register({
          firstName: 'Mock',
          lastName: 'User',
          email: 'mock-new@example.com',
          password: 'ValidPass1!',
        }),
      ),
    ],
    [
      'POST /auth/forgot-password',
      withFreshPublicMock((c) =>
        c.auth.forgotPassword({ email: 'mock@example.com' }),
      ),
    ],
    [
      'POST /auth/validate-reset-token',
      withFreshPublicMock((c) =>
        c.auth.validateResetToken({ token: 'mock-reset-token' }),
      ),
    ],
    [
      'POST /auth/reset-password',
      withFreshPublicMock((c) =>
        c.auth.resetPassword({
          token: 'mock-reset-token',
          newPassword: 'ValidPass1!',
        }),
      ),
    ],
    [
      'POST /contact',
      withFreshPublicMock((c) =>
        c.contact.submit({
          name: 'Mock User',
          email: 'mock@example.com',
          subject: 'Mock contact request',
          message: 'This is a sufficiently long mock contact message.',
        }),
      ),
    ],
  ];

  for (const [name, check] of publicApiChecks) {
    try {
      const response = await check();
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      passed++;
      console.log(`public REST ${name.padEnd(35)} ✓ PASS`);
    } catch (error) {
      failed++;
      console.log(`public REST ${name.padEnd(35)} ✗ FAIL`);
      console.log(
        `           ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  for (const test of tests) {
    const type = getOperationType(test.query);

    process.stdout.write(`${type.padEnd(10)} ${test.name.padEnd(35)} `);

    try {
      const result = await runTest(test);

      if (result.success) {
        passed++;

        console.log('✓ PASS');
      } else {
        failed++;

        console.log('✗ FAIL');

        console.log(`           ${result.error ?? 'Unknown error'}`);
      }
    } catch (error) {
      failed++;

      console.log('✗ FAIL');

      if (error instanceof Error) {
        console.log(`           ${error.message}`);
      } else {
        console.log(`           ${String(error)}`);
      }
    }
  }

  console.log('');
  console.log('==========================================');
  console.log(' Result');
  console.log('==========================================');
  console.log('');
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`  Total:  ${tests.length + publicApiChecks.length}`);
  console.log('');

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('');
  console.error('Fatal error running GraphQL tests:');

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});
