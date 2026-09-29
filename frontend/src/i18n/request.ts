import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // TODO: Integrar mensajes modularizados.
  // Cuando estén creados los archivos JSON, reemplazar este objeto
  // por los imports de common.json, auth.json, etc.
  const messages = {};

  return {
    locale,
    messages,
  };
});
