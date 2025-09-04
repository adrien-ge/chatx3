import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import fr from './locales/fr.json';

// Récupérer la langue préférée depuis localStorage
const getPreferredLanguage = (): string => {
  const savedLanguage = localStorage.getItem('preferred-language');
  if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
    return savedLanguage;
  }
  
  // Détecter la langue du navigateur
  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('fr')) {
    return 'fr';
  }
  
  return 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    lng: getPreferredLanguage(),
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferred-language'
    }
  });

// Écouter les changements de langue pour sauvegarder la préférence
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('preferred-language', lng);
});

export default i18n;