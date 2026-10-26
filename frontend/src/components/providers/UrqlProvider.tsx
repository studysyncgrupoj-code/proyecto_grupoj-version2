'use client';

import { createClient, fetchExchange, gql } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import { SidebarDataDocument } from '@/graphql/generated/graphql';
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
            updates: {
              Mutation: {
                updatePersonalData: (result, _args, cache) => {
                  const data = result.updatePersonalData as
                    { firstName?: string; lastName?: string } | undefined;
                  if (!data) return;

                  // `me` ya está cacheada: el dashboard monta `SidebarData` en el
                  // layout y esa query pide `me { id, name, email, image, role }`.
                  const meQuery = cache.readQuery({
                    query: SidebarDataDocument,
                  });
                  const userId = meQuery?.me?.id;
                  if (!userId) return;

                  const entityId = cache.keyOfEntity({
                    __typename: 'User',
                    id: userId,
                  });
                  if (!entityId) return;

                  const current = cache.readFragment(
                    gql`
                      fragment _ on User {
                        name
                      }
                    `,
                    entityId,
                  ) as { name?: string } | null;

                  const firstName = data.firstName ?? '';
                  const lastName = data.lastName ?? '';
                  const nextName = `${firstName} ${lastName}`.trim();
                  if (!nextName) return;
                  if (current?.name === nextName) return;

                  cache.writeFragment(
                    gql`
                      fragment _ on User {
                        name
                      }
                    `,
                    { __typename: 'User', id: userId, name: nextName },
                  );
                },
              },
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
