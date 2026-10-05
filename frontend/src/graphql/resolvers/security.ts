import type { GraphQLContext } from '../context';

export const securityResolvers = {
  Query: {
    mySecuritySettings: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.security.getMe(),
  },
  Mutation: {
    requestEmailChange: (
      _: unknown,
      a: { input: { newEmail: string } },
      c: GraphQLContext,
    ) => c.backend.security.requestEmailChange(a.input),
    changePassword: (
      _: unknown,
      a: { input: { currentPassword: string; newPassword: string } },
      c: GraphQLContext,
    ) => c.backend.security.changePassword(a.input),
    beginTwoFactorSetup: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.security.beginTwoFactorSetup(),
    verifyTwoFactorSetup: (
      _: unknown,
      a: { code: string },
      c: GraphQLContext,
    ) => c.backend.security.verifyTwoFactorSetup(a.code),
    disableTwoFactor: (_: unknown, a: { code: string }, c: GraphQLContext) =>
      c.backend.security.disableTwoFactor(a.code),
    revokeSession: (_: unknown, a: { sessionId: string }, c: GraphQLContext) =>
      c.backend.security.revokeSession(a.sessionId),
    revokeOtherSessions: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.security.revokeOtherSessions(),
  },
};
