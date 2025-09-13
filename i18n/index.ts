import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsEN from './en/en.json';
import translationsAR from './ar/ar.json';

const resources = {
  en: {
    translation: translationsEN,
  },
  ar: {
    translation: translationsAR,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // default language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
