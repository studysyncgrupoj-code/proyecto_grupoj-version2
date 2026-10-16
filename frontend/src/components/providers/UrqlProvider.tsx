'use client';

import { createClient, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import { useMemo, type ReactNode } from 'react';
import { Provider } from 'urql';

export function UrqlProvider({ children }: { children: ReactNode }) {
  const client = useMemo(
    () =>
      createClient({
        url: '/api/graphql',
        exchanges: [
          cacheExchange({
            keys: {
              // Entidades con `id` propio
              User: (data) => data.id as string,
              PublicProfile: (data) => data.id as string,
              UserSubscription: (data) => data.id as string,
              // ... resto de keys con id

              // Singletons "me"
              Account: () => 'me',
              PersonalData: () => 'me',
              PrivacySettings: () => 'me',
              SecuritySettings: () => 'me',
              Preferences: () => 'me',

              // ← NUEVO: subtipos embebidos sin `id`.
              // Al devolver `null` explícitamente, graphcache deja de intentar normalizarlos
              // y los embebe directamente en el padre. Es la solución oficial (ver doc 15).
              Profile: () => null,
              Bio: () => null,
              NotificationPreferences: () => null,
              AccessibilityPreferences: () => null,
              SecurityOperationResult: () => null,
              TwoFactorSetup: () => null,
            },
          }),
          fetchExchange,
        ],
        requestPolicy: 'cache-and-network',
      }),
    [],
  );

  return <Provider value={client}>{children}</Provider>;
}
