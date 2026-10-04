import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { resolvers } from './resolvers';

const typeDefs = loadFilesSync('src/app/api/graphql/schema/**/*.graphql', {
  extensions: ['graphql'],
});

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
