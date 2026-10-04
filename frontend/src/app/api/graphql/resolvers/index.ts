import { userResolvers } from './user';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
};
