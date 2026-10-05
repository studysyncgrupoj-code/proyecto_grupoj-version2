import type { GraphQLContext } from '../context';
import { requireAuth } from '../auth';

export const personalDataResolvers = {
  Query: {
    myPersonalData: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      requireAuth(context);
      return context.backend.personalData.getMe();
    },
  },
  Mutation: {
    updatePersonalData: async (
      _parent: unknown,
      args: {
        input: Parameters<
          GraphQLContext['backend']['personalData']['update']
        >[0];
      },
      context: GraphQLContext,
    ) => {
      requireAuth(context);
      return context.backend.personalData.update(args.input);
    },
  },
};
