import type { GraphQLContext } from '../context';

export const billingResolvers = {
  Query: {
    mySubscription: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.subscription.getMe(),
    myPaymentMethods: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.billing.getPaymentMethods(),
    myInvoices: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.billing.getInvoices(),
  },
  Mutation: {
    changeSubscriptionPlan: (
      _: unknown,
      a: {
        plan: Parameters<
          GraphQLContext['backend']['subscription']['changePlan']
        >[0];
      },
      c: GraphQLContext,
    ) => c.backend.subscription.changePlan(a.plan),
    cancelSubscription: (_: unknown, __: unknown, c: GraphQLContext) =>
      c.backend.subscription.cancel(),
    removePaymentMethod: (
      _: unknown,
      a: { paymentMethodId: string },
      c: GraphQLContext,
    ) => c.backend.billing.removePaymentMethod(a.paymentMethodId),
  },
};
