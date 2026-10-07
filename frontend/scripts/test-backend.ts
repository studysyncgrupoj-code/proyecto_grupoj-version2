import { loadEnvConfig } from '@next/env';
import { createRestBackendClient } from '../src/lib/backend/rest/client';

loadEnvConfig(process.cwd());

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/+$/, '');
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
const TEST_USER_ID = process.env.TEST_USER_ID;

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

const client = API_BASE_URL ? createRestBackendClient() : null;

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

interface RefreshResponse {
  status: number;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  };
}

async function login(): Promise<LoginResponse['data']> {
  if (!client) throw new Error('API_BASE_URL is not configured');
  const response = await client.auth.login({
    email: TEST_EMAIL!,
    password: TEST_PASSWORD!,
  });
  const body = response.body as LoginResponse | null;

  if (
    !response.ok ||
    body?.status !== 200 ||
    !body.data?.token ||
    !body.data?.refreshToken
  ) {
    throw new Error(`Invalid login response (HTTP ${response.status})`);
  }

  return body.data;
}

async function refreshToken(
  refreshTokenValue: string,
): Promise<RefreshResponse['data']> {
  if (!client) throw new Error('API_BASE_URL is not configured');
  const response = await client.auth.refresh(refreshTokenValue);
  const body = response.body as RefreshResponse | null;

  if (
    !response.ok ||
    body?.status !== 200 ||
    !body.data?.token ||
    !body.data?.refreshToken
  ) {
    throw new Error(`Invalid refresh response (HTTP ${response.status})`);
  }

  return body.data;
}

async function logout(refreshTokenValue: string) {
  if (!client) throw new Error('API_BASE_URL is not configured');
  const response = await client.auth.logout(refreshTokenValue);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

async function run() {
  console.log('\n=== Backend integration tests ===\n');

  if (!API_BASE_URL) {
    console.log('SKIP: API_BASE_URL no está configurada.');
    console.log(
      'Configura API_BASE_URL, TEST_EMAIL y TEST_PASSWORD para ejecutar estos tests.\n',
    );
    return;
  }

  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.log('SKIP: faltan TEST_EMAIL o TEST_PASSWORD.');
    console.log(
      'Configura las credenciales de un usuario de pruebas en .env.local.\n',
    );
    return;
  }

  console.log(`Backend: ${API_BASE_URL}\n`);

  let accessToken: string | undefined;
  let refreshTokenValue: string | undefined;

  /*
   * ---------------------------------------------------------
   * AUTH
   * ---------------------------------------------------------
   */

  try {
    const data = await login();

    accessToken = data.token;
    refreshTokenValue = data.refreshToken;

    pass('POST /auth/login');
  } catch (error) {
    fail('POST /auth/login', error);
  }

  if (!accessToken || !refreshTokenValue) {
    printResults();
    process.exitCode = 1;
    return;
  }

  /*
   * ---------------------------------------------------------
   * REST CLIENT
   * ---------------------------------------------------------
   */

  const authenticatedClient = createRestBackendClient(accessToken);

  const tests: Array<{
    name: string;
    run: () => Promise<unknown>;
  }> = [
    {
      name: 'GET /users/me',
      run: () => authenticatedClient.users.getMe(),
    },
    {
      name: 'GET /users/me/personal-data',
      run: () => authenticatedClient.personalData.getMe(),
    },
    {
      name: 'GET /users/me/privacy',
      run: () => authenticatedClient.privacy.getMe(),
    },
    {
      name: 'GET /users/me/security',
      run: () => authenticatedClient.security.getMe(),
    },
    {
      name: 'GET /users/me/preferences',
      run: () => authenticatedClient.preferences.getMe(),
    },
    {
      name: 'GET /users/me/account',
      run: () => authenticatedClient.account.getMe(),
    },
    {
      name: 'GET /users/me/courses',
      run: () => authenticatedClient.courses.getMe(),
    },
    {
      name: 'GET /users/me/certificates',
      run: () => authenticatedClient.certificates.getMe(),
    },
    {
      name: 'GET /users/me/subscription',
      run: () => authenticatedClient.subscription.getMe(),
    },
    {
      name: 'GET /users/me/payment-methods',
      run: () => authenticatedClient.billing.getPaymentMethods(),
    },
    {
      name: 'GET /users/me/invoices',
      run: () => authenticatedClient.billing.getInvoices(),
    },
  ];

  for (const test of tests) {
    try {
      await test.run();
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
      await authenticatedClient.users.getPublicProfile(TEST_USER_ID);
      pass('GET /users/:userId/profile');
    } catch (error) {
      fail('GET /users/:userId/profile', error);
    }
  } else {
    skip('GET /users/:userId/profile');
  }

  /*
   * ---------------------------------------------------------
   * REFRESH TOKEN
   * ---------------------------------------------------------
   */

  try {
    const refreshed = await refreshToken(refreshTokenValue);

    accessToken = refreshed.token;
    refreshTokenValue = refreshed.refreshToken;

    pass('POST /auth/refresh');
  } catch (error) {
    fail('POST /auth/refresh', error);
  }

  /*
   * ---------------------------------------------------------
   * LOGOUT
   * ---------------------------------------------------------
   */

  if (refreshTokenValue) {
    try {
      await logout(refreshTokenValue);
      pass('POST /auth/logout');
    } catch (error) {
      fail('POST /auth/logout', error);
    }
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
