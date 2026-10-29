'use client';

import type { MySubscriptionQuery } from '@/graphql/generated/graphql';
import { useLocale } from 'next-intl';

type SubscriptionRecord = NonNullable<MySubscriptionQuery['mySubscription']>;

export interface SubscriptionMessages {
  title: string;
  description: string;
  empty: string;
  planLabels: {
    free: string;
    premium: string;
    enterprise: string;
  };
  statusLabels: {
    trialing: string;
    active: string;
    past_due: string;
    canceled: string;
    expired: string;
  };
  fields: {
    currentPlan: string;
    status: string;
    startedAt: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: string;
    pastDueWarning: string;
    trialingNotice: string;
  };
  errors: {
    INTERNAL_ERROR: string;
  };
}

interface SubscriptionClientProps {
  messages: SubscriptionMessages;
  subscription: SubscriptionRecord | null;
}

function formatDate(value: unknown, locale: string): string {
  if (typeof value !== 'string') return String(value);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const intlLocale = locale === 'en' ? 'en-US' : 'es-CO';

  return new Intl.DateTimeFormat(intlLocale, {
    dateStyle: 'long',
  }).format(date);
}

export function SubscriptionClient({
  messages,
  subscription,
}: SubscriptionClientProps) {
  const locale = useLocale();

  if (!subscription) {
    return (
      <section className="border-border bg-background rounded-2xl border p-4 sm:p-5">
        <h3 className="text-foreground text-sm font-semibold">
          {messages.title}
        </h3>
        <p className="text-foreground-muted mt-1 text-xs">
          {messages.description}
        </p>
        <p role="status" className="text-foreground-muted mt-3 text-sm">
          {messages.empty}
        </p>
      </section>
    );
  }

  const showPeriodEnd =
    subscription.cancelAtPeriodEnd &&
    subscription.currentPeriodEnd !== null &&
    subscription.currentPeriodEnd !== undefined;

  return (
    <section className="border-border bg-background rounded-2xl border p-4 sm:p-5">
      <header className="mb-4">
        <h3 className="text-foreground text-sm font-semibold">
          {messages.title}
        </h3>
        <p className="text-foreground-muted mt-1 text-xs">
          {messages.description}
        </p>
      </header>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="border-border bg-surface rounded-xl border p-3">
          <dt className="text-foreground-muted text-xs font-semibold">
            {messages.fields.currentPlan}
          </dt>
          <dd className="text-foreground mt-1 text-sm font-medium">
            {messages.planLabels[subscription.plan]}
          </dd>
        </div>

        <div className="border-border bg-surface rounded-xl border p-3">
          <dt className="text-foreground-muted text-xs font-semibold">
            {messages.fields.status}
          </dt>
          <dd className="text-foreground mt-1 text-sm font-medium">
            {messages.statusLabels[subscription.status]}
          </dd>
        </div>

        <div className="border-border bg-surface rounded-xl border p-3">
          <dt className="text-foreground-muted text-xs font-semibold">
            {messages.fields.startedAt}
          </dt>
          <dd className="text-foreground mt-1 text-sm">
            {formatDate(subscription.startedAt, locale)}
          </dd>
        </div>

        {showPeriodEnd && (
          <div className="border-warning/30 bg-warning/10 rounded-xl border p-3">
            <dt className="text-foreground-muted text-xs font-semibold">
              {messages.fields.cancelAtPeriodEnd}
            </dt>
            <dd className="text-foreground mt-1 text-sm">
              {messages.fields.currentPeriodEnd.replace(
                '{date}',
                formatDate(subscription.currentPeriodEnd, locale),
              )}
            </dd>
          </div>
        )}
      </dl>

      {subscription.status === 'past_due' && (
        <p
          role="alert"
          className="border-danger/30 bg-danger/10 text-danger mt-3 rounded-xl border px-3 py-2 text-sm"
        >
          {messages.fields.pastDueWarning}
        </p>
      )}

      {subscription.status === 'trialing' && (
        <p className="border-info/30 bg-info/10 text-info mt-3 rounded-xl border px-3 py-2 text-sm">
          {messages.fields.trialingNotice}
        </p>
      )}
    </section>
  );
}
