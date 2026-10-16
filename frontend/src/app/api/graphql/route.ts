import { auth } from '@/auth';
import { createBackendClient } from '@/lib/backend';
import { createYoga } from 'graphql-yoga';
import { getToken } from 'next-auth/jwt';
import { schema } from '../../../graphql';

const yoga = createYoga({
  schema,
  context: async ({ request }) => {
    const session = await auth();
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    return {
      session,
      backend: createBackendClient(token?.accessToken as string | undefined),
    };
  },
  graphqlEndpoint: '/api/graphql',
});

export { yoga as GET, yoga as POST };
