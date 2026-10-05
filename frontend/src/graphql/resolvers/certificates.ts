import type { GraphQLContext } from '../context';
import { requireAuth } from '../auth';

export const certificatesResolvers = {
  Query: {
    myCertificates: (_: unknown, __: unknown, c: GraphQLContext) => {
      requireAuth(c);
      return c.backend.certificates.getMe();
    },
  },
};
