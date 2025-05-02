import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { languages } from "@shared/schema";
import i18n from "../i18n";

type Language = (typeof languages)[number];

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string; // Added flag emoji for better visual representation
}

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  languageOptions: LanguageOption[];
}

const languageOptions: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
];

// Create the context with default values to avoid undefined checks
const defaultContextValue: LanguageContextType = {
  language: "en",
  changeLanguage: () => {},
  languageOptions: languageOptions
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage or browser language
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && languages.includes(savedLanguage as Language)) {
      return savedLanguage;
    }
    // Try to match browser language
    const browserLang = navigator.language.split("-")[0];
    const matchedLang = languages.find(lang => lang === browserLang) || "en";
    return matchedLang as Language;
  });

  // Effect to sync language with i18n when component mounts or language changes
  useEffect(() => {
    // Force a re-render of all components using translations
    i18n.changeLanguage(language).then(() => {
      // Additional operations after language change if needed
      document.documentElement.setAttribute('lang', language);
    });
  }, [language]);

  // Listen for language changes from i18n itself (external sources)
  useEffect(() => {
    const handleLanguageChanged = (newLang: string) => {
      if (newLang !== language && languages.includes(newLang as Language)) {
        setLanguage(newLang as Language);
        localStorage.setItem("language", newLang);
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [language]);

  const changeLanguage = (lang: Language) => {
    console.log("LanguageContext: changing language to:", lang);
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    
    // Force page re-render to update all translated content
    window.dispatchEvent(new Event('languagechange'));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        languageOptions,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    console.warn("useLanguage is not within a LanguageProvider - using default values");
    return defaultContextValue;
  }
  return context;
}
