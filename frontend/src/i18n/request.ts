// src/i18n/request.ts
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// ---- Tipos ----
type Locale = (typeof routing.locales)[number];
type Namespace = 'header' | 'languageToggle' | 'logo' | 'themeToggle';

type MessageModule = { default: Record<string, unknown> };
type MessageLoader = () => Promise<MessageModule>;

// ---- Configuración ----
// Cada namespace = un archivo en messages/<locale>/<namespace>.json
// Al crear un archivo nuevo, agrégalo aquí Y en MESSAGE_LOADERS.
const NAMESPACES: readonly Namespace[] = [
  'header',
  'languageToggle',
  'logo',
  'themeToggle',
];

// Mapa estático: cada path es un literal, el bundler puede analizarlo.
const MESSAGE_LOADERS: Record<Locale, Record<Namespace, MessageLoader>> = {
  en: {
    header: () => import('../messages/en/header.json'),
    languageToggle: () => import('../messages/en/languageToggle.json'),
    logo: () => import('../messages/en/logo.json'),
    themeToggle: () => import('../messages/en/themeToggle.json'),
  },
  es: {
    header: () => import('../messages/es/header.json'),
    languageToggle: () => import('../messages/es/languageToggle.json'),
    logo: () => import('../messages/es/logo.json'),
    themeToggle: () => import('../messages/es/themeToggle.json'),
  },
};

// ---- Config de next-intl ----
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale: Locale = hasLocale(routing.locales, requested)
    ? (requested as Locale)
    : routing.defaultLocale;

  const loaders = MESSAGE_LOADERS[locale];
  if (!loaders) {
    throw new Error(`No hay loaders configurados para el locale "${locale}"`);
  }

  const entries = await Promise.all(
    NAMESPACES.map(async (namespace) => {
      const messages = await loaders[namespace]();
      return [namespace, messages.default] as const;
    }),
  );

  return {
    locale,
    messages: Object.fromEntries(entries),
  };
});
