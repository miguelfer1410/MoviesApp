import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en/translaction.json';
import esTranslations from '../locales/es/translaction.json';
import ptTranslation from '../locales/pt/translaction.json';
import frTranslation from '../locales/fr/translaction.json';
import deTranslation from '../locales/de/translaction.json';


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslation },
      pt: { translation: ptTranslation },
      de: { translation: deTranslation },
    },
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
