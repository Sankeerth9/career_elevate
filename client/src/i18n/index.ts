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
    }
  });

export default i18n;
