import type { GraphQLContext } from '../context';
import { requireAuth } from '../auth';

export const billingResolvers = {
  Query: {
    mySubscription: (_: unknown, __: unknown, c: GraphQLContext) => {
      requireAuth(c);
      return c.backend.subscription.getMe();
    },
    myPaymentMethods: (_: unknown, __: unknown, c: GraphQLContext) => {
      requireAuth(c);
      return c.backend.billing.getPaymentMethods();
    },
    myInvoices: (_: unknown, __: unknown, c: GraphQLContext) => {
      requireAuth(c);
      return c.backend.billing.getInvoices();
    },
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
    ) => {
      requireAuth(c);
      return c.backend.subscription.changePlan(a.plan);
    },
    cancelSubscription: (_: unknown, __: unknown, c: GraphQLContext) => {
      requireAuth(c);
      return c.backend.subscription.cancel();
    },
    removePaymentMethod: (
      _: unknown,
      a: { paymentMethodId: string },
      c: GraphQLContext,
    ) => {
      requireAuth(c);
      return c.backend.billing.removePaymentMethod(a.paymentMethodId);
    },
  },
};
