import type { GraphQLContext } from '../context';

export const accountResolvers = {
  Query: {
    myAccount: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.account.getMe(),
  },
  Mutation: {
    requestAccountDeactivation: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.account.requestDeactivation(),
    cancelAccountDeactivation: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.account.cancelDeactivation(),
  },
};
