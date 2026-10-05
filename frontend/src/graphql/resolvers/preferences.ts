import type { GraphQLContext } from '../context';

export const preferencesResolvers = {
  Query: {
    myPreferences: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.preferences.getMe(),
  },
  Mutation: {
    updatePreferences: (
      _: unknown,
      a: {
        input: Parameters<
          GraphQLContext['backend']['preferences']['update']
        >[0];
      },
      c: GraphQLContext,
    ) => c.backend.preferences.update(a.input),
  },
};
