import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { languages } from "@shared/schema";

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

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Load saved language from localStorage or use browser language
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && languages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      // Try to match browser language
      const browserLang = navigator.language.split("-")[0];
      const matchedLang = languages.find(lang => lang === browserLang) || "en";
      setLanguage(matchedLang as Language);
      i18n.changeLanguage(matchedLang);
    }
  }, [i18n]);

  const changeLanguage = (lang: Language) => {
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
  // Provide a default context if not inside provider (for development only)
  if (context === undefined) {
    console.warn("useLanguage is not within a LanguageProvider - using default values");
    return {
      language: "en" as Language,
      changeLanguage: (lang: Language) => console.log(`Would change to ${lang}`),
      languageOptions: languageOptions
    };
  }
  return context;
}
