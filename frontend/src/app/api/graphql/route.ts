import { createYoga } from 'graphql-yoga';

import { createBackendClient } from '@/lib/backend';
import { schema } from '../../../graphql';

const yoga = createYoga({
  schema,

  context: async () => {
    // TODO(auth): Cuando el login esté terminado,
    // recuperar la sesión mediante Auth.js.
    //
    // const session = await auth();
    //
    // if (!session?.user) {
    //   throw new Error('Unauthorized');
    // }
    //
    // return {
    //   session,
    //   backend: createBackendClient(session.accessToken),
    // };

    return {
      session: null,
      backend: createBackendClient(),
    };
  },

  graphqlEndpoint: '/api/graphql',
});

export { yoga as GET, yoga as POST };
