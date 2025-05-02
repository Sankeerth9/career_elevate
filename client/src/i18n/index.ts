import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "./translations";
import { languages } from "@shared/schema";

// Define language options with display info
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

// Available language options with flags
export const languageOptions: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
];

// Get initial language from localStorage or browser
const getInitialLanguage = (): string => {
  try {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && languages.includes(savedLanguage as any)) {
      return savedLanguage;
    }
    
    const browserLang = navigator.language.split("-")[0];
    const matchedLang = languages.find(lang => lang === browserLang) || "en";
    return matchedLang;
  } catch (error) {
    return "en";
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Add event listener for language changes
i18n.on('languageChanged', (lng) => {
  // Save language to localStorage
  try {
    localStorage.setItem("language", lng);
  } catch (error) {
    console.error("Failed to save language preference", error);
  }
  
  // Update document properties
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  
  console.log(`Language changed to: ${lng}`);
});

// Function to change language
export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
};

export default i18n;
