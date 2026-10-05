import { auth } from '@/auth';
import { createBackendClient } from '@/lib/backend';
import { createYoga } from 'graphql-yoga';
import { schema } from '../../../graphql';

const yoga = createYoga({
  schema,

  context: async () => {
    const session = await auth();

    return {
      session,
      backend: createBackendClient(session?.accessToken),
    };
  },

  graphqlEndpoint: '/api/graphql',
});

export { yoga as GET, yoga as POST };
