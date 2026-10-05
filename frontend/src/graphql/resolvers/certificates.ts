import type { GraphQLContext } from '../context';

export const certificatesResolvers = {
  Query: {
    myCertificates: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.certificates.getMe(),
  },
};
