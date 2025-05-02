import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/authContext";
import { LanguageProvider } from "./context/languageContext";
import { I18nextProvider } from "react-i18next";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import i18n from "./i18n";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <App />
          </AuthProvider>
        </LanguageProvider>
      </I18nextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
