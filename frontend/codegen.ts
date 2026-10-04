import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/app/api/graphql/schema/**/*.graphql',
  documents: 'src/app/api/graphql/operations/**/*.graphql',

  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
