'use client';

import type { MyPaymentMethodsQuery } from '@/graphql/generated/graphql';

type PaymentMethodRecord = MyPaymentMethodsQuery['myPaymentMethods'][number];

export interface PaymentMethodsMessages {
  title: string;
  description: string;
  empty: string;
  fields: {
    brand: string;
    last4: string;
    expiration: string;
    unknownBrand: string;
    unknownLast4: string;
  };
  errors: {
    NOT_FOUND: string;
    CONFLICT: string;
    INTERNAL_ERROR: string;
  };
}

interface PaymentMethodsClientProps {
  messages: PaymentMethodsMessages;
  paymentMethods: PaymentMethodRecord[];
}

export function PaymentMethodsClient({
  messages,
  paymentMethods,
}: PaymentMethodsClientProps) {
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

      {paymentMethods.length === 0 ? (
        <p role="status" className="text-foreground-muted text-sm">
          {messages.empty}
        </p>
      ) : (
        <ul className="grid gap-2">
          {paymentMethods.map((method) => (
            <li
              key={method.id}
              className="border-border bg-surface flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"
            >
              <div className="min-w-0">
                <p className="text-foreground text-sm font-medium">
                  {method.brand ?? messages.fields.unknownBrand}
                  {method.last4 ? ` · ${method.last4}` : ''}
                </p>
                {method.expirationMonth !== null &&
                  method.expirationYear !== null && (
                    <p className="text-foreground-muted mt-0.5 text-xs">
                      {messages.fields.expiration.replace(
                        '{date}',
                        `${String(method.expirationMonth).padStart(2, '0')}/${method.expirationYear}`,
                      )}
                    </p>
                  )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
