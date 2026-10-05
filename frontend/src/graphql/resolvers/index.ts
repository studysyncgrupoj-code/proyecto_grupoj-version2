import { personalDataResolvers } from './personal-data';
import { userResolvers } from './user';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...personalDataResolvers.Query,
  },
};
