import type { GraphQLContext } from '../context';

export const privacyResolvers = {
  Query: {
    myPrivacySettings: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      return context.backend.privacy.getMe();
    },
  },
  Mutation: {
    updatePrivacySettings: async (
      _parent: unknown,
      args: {
        input: Parameters<GraphQLContext['backend']['privacy']['update']>[0];
      },
      context: GraphQLContext,
    ) => context.backend.privacy.update(args.input),
  },
};
