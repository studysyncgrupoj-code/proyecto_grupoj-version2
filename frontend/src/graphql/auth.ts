import type { GraphQLContext } from './context';

export function requireAuth(context: GraphQLContext) {
  if (!context.session?.user) {
    throw new Error('Unauthorized');
  }

  return context.session.user;
}
