import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/languageContext";
import { Globe, ChevronDown, Check } from "lucide-react";

interface LanguageSelectorProps {
  className?: string;
}

export default function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const { language, changeLanguage, languageOptions } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  // Update local state when context language changes
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Find current language display name
  const currentLanguage = languageOptions.find(
    (option) => option.code === selectedLanguage
  );

  const handleLanguageChange = (langCode: string) => {
    console.log(`LanguageSelector: changing to ${langCode}`);
    changeLanguage(langCode as any);
    setSelectedLanguage(langCode as any);
    setOpen(false);
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
          <span className="font-medium">{currentLanguage?.flag} {currentLanguage?.name || "English"}</span>
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
                selectedLanguage === option.code ? "bg-primary/5 dark:bg-primary/10" : ""
              }`}
            >
              <div className="flex-shrink-0 text-xl">{option.flag}</div>
              <div className="flex-grow">
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-muted-foreground">
                  {option.nativeName}
                </div>
              </div>
              {selectedLanguage === option.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
