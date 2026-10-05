import type { GraphQLContext } from '../context';

export const personalDataResolvers = {
  Query: {
    myPersonalData: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      return context.backend.personalData.getMe();
    },
  },
};
