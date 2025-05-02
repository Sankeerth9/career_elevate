import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown, Check } from "lucide-react";
import { languageOptions, changeLanguage } from "../i18n";

interface LanguageSelectorProps {
  className?: string;
}

export default function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");
  
  // Update current language when i18n language changes
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);
  
  // Find current language option
  const currentOption = languageOptions.find(
    (option) => option.code === currentLang
  ) || languageOptions[0];

  // Handle language change
  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setCurrentLang(langCode);
    setOpen(false);
    console.log(`Changed language to: ${langCode}`);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`inline-flex justify-center items-center gap-2 bg-background hover:bg-accent rounded-full px-3 ${className}`}
        >
          <Globe className="h-4 w-4 text-primary" />
          <span className="font-medium">
            {currentOption.flag} {currentOption.name}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-sm dark:bg-neutral-900/95 rounded-xl shadow-lg border-neutral-200 dark:border-neutral-800">
        <DropdownMenuLabel className="text-center text-base font-medium py-2 border-b border-neutral-100 dark:border-neutral-800">
          Select Language
        </DropdownMenuLabel>
        
        <div className="max-h-[300px] overflow-y-auto py-1">
          {languageOptions.map((option) => (
            <DropdownMenuItem
              key={option.code}
              onClick={() => handleLanguageChange(option.code)}
              className={`flex items-center gap-3 px-3 py-2.5 hover:bg-accent cursor-pointer transition-colors duration-150 ${
                currentLang === option.code ? "bg-primary/5 dark:bg-primary/10" : ""
              }`}
            >
              <div className="flex-shrink-0 text-xl">{option.flag}</div>
              <div className="flex-grow">
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-muted-foreground">
                  {option.nativeName}
                </div>
              </div>
              {currentLang === option.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
