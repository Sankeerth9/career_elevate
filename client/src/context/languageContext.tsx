import { createContext, useContext, useState, ReactNode } from "react";
import { languages } from "@shared/schema";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

// Simple language type from shared schema
type Language = (typeof languages)[number];

// Language option with display information
interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

// Define language context type
interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  languageOptions: LanguageOption[];
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

// Create language context
const LanguageContext = createContext<LanguageContextType | null>(null);

// Language provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  
  // Get initial language from local storage or default to English
  const getInitialLanguage = (): Language => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && languages.includes(savedLang as Language)) {
      return savedLang as Language;
    }
    return "en";
  };

  // Track the current language
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage());

  // Change language function
  const setLanguage = (lang: Language) => {
    // Save to state
    setCurrentLanguage(lang);
    
    // Save to localStorage
    localStorage.setItem("language", lang);
    
    // Change i18n language
    i18n.changeLanguage(lang);
    
    // For debugging
    console.log(`Language switched to: ${lang}`);
  };

  // Context value
  const contextValue = {
    currentLanguage,
    setLanguage,
    languageOptions,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
}
