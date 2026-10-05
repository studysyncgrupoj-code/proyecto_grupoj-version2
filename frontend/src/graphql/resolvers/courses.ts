import type { GraphQLContext } from '../context';
import { requireAuth } from '../auth';

export const coursesResolvers = {
  Query: {
    myCourses: (_: unknown, __: unknown, c: GraphQLContext) => {
      requireAuth(c);
      return c.backend.courses.getMe();
    },
  },
};
