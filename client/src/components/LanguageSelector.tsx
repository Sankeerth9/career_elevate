import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/languageContext";
import { ChevronDown } from "lucide-react";

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
          variant="outline"
          className={`inline-flex justify-center items-center ${className}`}
        >
          {currentLanguage?.name || "English"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => handleLanguageChange(option.code)}
            className={`flex justify-between items-center ${
              selectedLanguage === option.code ? "bg-primary-50 dark:bg-primary-900/20" : ""
            }`}
          >
            <span>{option.name}</span>
            <span className="text-sm text-muted-foreground">
              {option.nativeName}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
