import { loadEnvConfig } from '@next/env';
import { graphql } from 'graphql';

import { schema } from '../src/graphql';
import type { GraphQLContext } from '../src/graphql/context';
import { RestBackendClient } from '../src/lib/backend/rest/client';

loadEnvConfig(process.cwd());

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/+$/, '');
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
const TEST_USER_ID = process.env.TEST_USER_ID;

interface LoginResponse {
  status: number;
  message: string;
  data: {
    nombre: string;
    apellidos: string;
    uuid: string;
    rol: string;
    subscription?: string;
    image?: string;
    token: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  };
}

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  error?: string;
}

const results: TestResult[] = [];

function pass(name: string) {
  results.push({ name, status: 'PASS' });
}

function fail(name: string, error: unknown) {
  results.push({
    name,
    status: 'FAIL',
    error: error instanceof Error ? error.message : String(error),
  });
}

function skip(name: string) {
  results.push({ name, status: 'SKIP' });
}

async function login(): Promise<LoginResponse['data']> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  const text = await response.text();

  let body: unknown = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    throw new Error(`Login failed: HTTP ${response.status}`);
  }

  const data = body as LoginResponse;

  if (data.status !== 200 || !data.data?.token || !data.data?.refreshToken) {
    throw new Error('Invalid login response');
  }

  return data.data;
}

interface TestDefinition {
  name: string;
  query: string;
  variables?: Record<string, unknown>;
  requiresAuth?: boolean;
}

async function runGraphQLTest(
  client: RestBackendClient,
  session: GraphQLContext['session'],
  test: TestDefinition,
) {
  const context: GraphQLContext = {
    session,
    backend: client,
  };

  const result = await graphql({
    schema,
    source: test.query,
    variableValues: test.variables,
    contextValue: context,
  });

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join('; '));
  }

  if (!result.data) {
    throw new Error('GraphQL returned no data');
  }

  return result.data;
}

async function run() {
  console.log('\n=== GraphQL → real Backend tests ===\n');

  if (!API_BASE_URL) {
    console.log('SKIP: API_BASE_URL no está configurada.');
    return;
  }

  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.log('SKIP: faltan TEST_EMAIL o TEST_PASSWORD.');
    return;
  }

  console.log(`Backend: ${API_BASE_URL}\n`);

  let authData: LoginResponse['data'];

  /*
   * ---------------------------------------------------------
   * AUTH
   * ---------------------------------------------------------
   */

  try {
    authData = await login();
    pass('Backend authentication');
  } catch (error) {
    fail('Backend authentication', error);
    printResults();
    process.exitCode = 1;
    return;
  }

  const client = new RestBackendClient(API_BASE_URL, authData.token);

  /*
   * Minimal Auth.js-compatible session.
   *
   * The resolver only requires session.user to exist.
   */
  const session = {
    user: {
      id: authData.uuid,
      name: `${authData.nombre} ${authData.apellidos}`.trim(),
      email: TEST_EMAIL,
      image: authData.image ?? null,
      role: authData.rol,
      subscription: authData.subscription ?? 'free',
    },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  } as GraphQLContext['session'];

  /*
   * ---------------------------------------------------------
   * PROTECTED QUERIES
   * ---------------------------------------------------------
   */

  const protectedTests: TestDefinition[] = [
    {
      name: 'GraphQL me',
      query: `
        query {
          me {
            id
            name
            email
            role
            profile {
              interests
              bio {
                title
                description
              }
            }
          }
        }
      `,
      requiresAuth: true,
    },
    {
      name: 'GraphQL myPersonalData',
      query: `
        query {
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
      requiresAuth: true,
    },
    {
      name: 'GraphQL myPrivacySettings',
      query: `
        query {
          myPrivacySettings {
            profileVisibility
            emailVisibility
            phoneVisibility
            allowDirectMessages
          }
        }
      `,
      requiresAuth: true,
    },
    {
      name: 'GraphQL mySecuritySettings',
      query: `
        query {
          mySecuritySettings {
            email
            emailVerified
            twoFactorEnabled
            twoFactorRequired
            sessions {
              id
              deviceName
              browser
              lastActiveAt
              current
            }
          }
        }
      `,
      requiresAuth: true,
    },
    {
      name: 'GraphQL myPreferences',
      query: `
        query {
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
      requiresAuth: true,
    },
    {
      name: 'GraphQL myAccount',
      query: `
        query {
          myAccount {
            status
            createdAt
          }
        }
      `,
      requiresAuth: true,
    },
    {
      name: 'GraphQL myCourses',
      query: `
        query {
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
      requiresAuth: true,
    },
    {
      name: 'GraphQL myCertificates',
      query: `
        query {
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
      requiresAuth: true,
    },
    {
      name: 'GraphQL mySubscription',
      query: `
        query {
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
      requiresAuth: true,
    },
    {
      name: 'GraphQL myPaymentMethods',
      query: `
        query {
          myPaymentMethods {
            id
            brand
            last4
            expirationMonth
            expirationYear
          }
        }
      `,
      requiresAuth: true,
    },
    {
      name: 'GraphQL myInvoices',
      query: `
        query {
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
      requiresAuth: true,
    },
  ];

  for (const test of protectedTests) {
    try {
      await runGraphQLTest(client, session, test);

      pass(test.name);
    } catch (error) {
      fail(test.name, error);
    }
  }

  /*
   * ---------------------------------------------------------
   * PUBLIC PROFILE
   * ---------------------------------------------------------
   */

  if (TEST_USER_ID) {
    try {
      await runGraphQLTest(client, null, {
        name: 'GraphQL publicProfile',
        query: `
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
          userId: TEST_USER_ID,
        },
      });

      pass('GraphQL publicProfile');
    } catch (error) {
      fail('GraphQL publicProfile', error);
    }
  } else {
    skip('GraphQL publicProfile');
  }

  /*
   * ---------------------------------------------------------
   * AUTHORIZATION
   * ---------------------------------------------------------
   *
   * Verify that a protected operation fails without session.
   */

  try {
    const result = await graphql({
      schema,
      source: `
        query {
          me {
            id
          }
        }
      `,
      contextValue: {
        session: null,
        backend: client,
      } satisfies GraphQLContext,
    });

    const unauthorized =
      result.errors?.some((error) => error.message === 'Unauthorized') ?? false;

    if (!unauthorized) {
      throw new Error('Expected Unauthorized error');
    }

    pass('GraphQL protected operation rejects anonymous request');
  } catch (error) {
    fail('GraphQL protected operation rejects anonymous request', error);
  }

  printResults();

  const failed = results.filter((result) => result.status === 'FAIL');

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

function printResults() {
  console.log('\nResults:\n');

  for (const result of results) {
    const icon =
      result.status === 'PASS' ? '✓' : result.status === 'SKIP' ? '○' : '✗';

    console.log(`${icon} ${result.status.padEnd(4)} ${result.name}`);

    if (result.error) {
      console.log(`      ${result.error}`);
    }
  }

  const passed = results.filter((result) => result.status === 'PASS').length;

  const failed = results.filter((result) => result.status === 'FAIL').length;

  const skipped = results.filter((result) => result.status === 'SKIP').length;

  console.log('\n--------------------------------');
  console.log(`Passed:  ${passed}`);
  console.log(`Failed:  ${failed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total:   ${results.length}`);
  console.log('--------------------------------\n');
}

run().catch((error) => {
  console.error('\nUnexpected test error:');

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});
