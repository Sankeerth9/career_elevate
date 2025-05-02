import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "./translations";

// Detect saved language or browser language
const savedLanguage = localStorage.getItem("language");
const browserLang = navigator.language.split("-")[0];
const initialLanguage = savedLanguage || browserLang || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already safes from XSS
    },
    react: {
      useSuspense: false, // This helps with rendering translations
      bindI18n: 'languageChanged loaded', // Listen to these events
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'],
      omitBoundRerender: false // Important: ensure re-renders on language change
    }
  });

// Add debugging for language changes
i18n.on('languageChanged', (lng) => {
  console.log(`Language changed to: ${lng}`);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'; // Handle RTL languages if needed
});

export default i18n;
