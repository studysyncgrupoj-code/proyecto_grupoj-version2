import { pendingTranslations } from "./traducciones.js";
import { settingsTranslations } from "./settings.js";
import { menuTranslations } from "./menu.js";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: {} },
    en: { translation: { ...menuTranslations.en, ...settingsTranslations.en, ...pendingTranslations.en } },
    pt: { translation: { ...menuTranslations.pt, ...settingsTranslations.pt, ...pendingTranslations.pt } },
  },
  lng: "es",
  fallbackLng: "es",
  supportedLngs: ["es", "en", "pt"],
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language;
});

export default i18n;
