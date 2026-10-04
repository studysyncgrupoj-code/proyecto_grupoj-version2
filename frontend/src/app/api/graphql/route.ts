import { createYoga } from 'graphql-yoga';

// import { auth } from '@/auth';
import { createBackendClient } from '@/lib/backend';
import { schema } from '@/app/api/graphql';

const yoga = createYoga({
  schema,

  context: async () => {
    // TODO(auth): Cuando el sistema de login esté terminado,
    // descomentar la validación de sesión y pasar el accessToken
    // al BackendClient.
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

  graphqlEndpoint: '/graphql',
});

export { yoga as GET, yoga as POST };