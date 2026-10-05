import type { GraphQLContext } from '../context';
import { requireAuth } from '../auth';

export const preferencesResolvers = {
  Query: {
    myPreferences: (_: unknown, __: unknown, c: GraphQLContext) => {
      requireAuth(c);
      return c.backend.preferences.getMe();
    },
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
    ) => {
      requireAuth(c);
      return c.backend.preferences.update(a.input);
    },
  },
};
