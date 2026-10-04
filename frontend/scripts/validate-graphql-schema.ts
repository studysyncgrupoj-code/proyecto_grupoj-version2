import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';

const typeDefs = loadFilesSync('src/app/api/graphql/schema/**/*.graphql');

try {
  makeExecutableSchema({
    typeDefs,
    resolvers: {},
  });

  console.log('✓ GraphQL schema válido');
} catch (error) {
  console.error('✗ GraphQL schema inválido');
  console.error(error);
  process.exit(1);
}
