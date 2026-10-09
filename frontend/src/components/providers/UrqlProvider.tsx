'use client';

import { cacheExchange, createClient, fetchExchange } from '@urql/core';
import { useMemo, type ReactNode } from 'react';
import { Provider } from 'urql';

export function UrqlProvider({ children }: { children: ReactNode }) {
  const client = useMemo(
    () =>
      createClient({
        url: '/api/graphql',
        exchanges: [cacheExchange, fetchExchange],
        requestPolicy: 'cache-and-network',
      }),
    [],
  );

  return <Provider value={client}>{children}</Provider>;
}
