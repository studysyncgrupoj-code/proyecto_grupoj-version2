const GRAPHQL_URL =
  process.env.GRAPHQL_URL ?? 'http://localhost:3000/api/graphql';

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
        newPassword: 'new-password',
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
      sessionId: 'session-001',
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
          createdAt
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
          createdAt
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
          createdAt
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
      paymentMethodId: 'pm-001',
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
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: test.query,
      variables: test.variables,
    }),
  });

  let body: GraphQLResponse;

  try {
    body = (await response.json()) as GraphQLResponse;
  } catch {
    return {
      success: false,
      status: response.status,
      error: 'Response is not valid JSON',
    };
  }

  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      error: `HTTP ${response.status}`,
      body,
    };
  }

  if (body.errors?.length) {
    return {
      success: false,
      status: response.status,
      error: body.errors.map((error) => error.message).join('; '),
    };
  }

  if (!body.data) {
    return {
      success: false,
      status: response.status,
      error: 'GraphQL response does not contain data',
    };
  }

  return {
    success: true,
    status: response.status,
  };
}

async function main() {
  console.log('');
  console.log('==========================================');
  console.log(' GraphQL integration tests');
  console.log('==========================================');
  console.log('');
  console.log(`Endpoint: ${GRAPHQL_URL}`);
  console.log(`Tests:    ${tests.length}`);
  console.log('');

  let passed = 0;
  let failed = 0;

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
  console.log(`  Total:  ${tests.length}`);
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
