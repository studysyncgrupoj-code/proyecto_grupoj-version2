import type { GraphQLContext } from '../context';

export const coursesResolvers = {
  Query: {
    myCourses: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.courses.getMe(),
  },
};
