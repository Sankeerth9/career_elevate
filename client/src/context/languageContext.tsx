import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { languages } from "@shared/schema";
import i18n from "../i18n";

type Language = (typeof languages)[number];

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  languageOptions: LanguageOption[];
}

const languageOptions: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
];

// Create the context with default values to avoid undefined checks
const defaultContextValue: LanguageContextType = {
  language: "en",
  changeLanguage: () => {},
  languageOptions: languageOptions
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Don't use useTranslation here to avoid circular dependency
  const [language, setLanguage] = useState<Language>(() => {
    // Initialize from localStorage or browser language
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && languages.includes(savedLanguage as Language)) {
      return savedLanguage;
    }
    // Try to match browser language
    const browserLang = navigator.language.split("-")[0];
    const matchedLang = languages.find(lang => lang === browserLang) || "en";
    return matchedLang as Language;
  });

  // Effect to sync language with i18n when component mounts
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const changeLanguage = (lang: Language) => {
    console.log("Changing language to:", lang);
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
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
