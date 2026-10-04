import type { GraphQLContext } from '../context';

export const userResolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      return context.backend.users.getMe();
    },
  },
};
