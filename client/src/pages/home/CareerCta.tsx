import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CareerCta() {
  const { t } = useTranslation();

  return (
    <div className="bg-primary-700">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">{t("home.cta.title")}</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-primary-200">
          {t("home.cta.description")}
        </p>
        <Link to="/ai-recommendations">
          <Button 
            size="lg"
            className="mt-8 bg-white text-primary-600 hover:bg-primary-50"
          >
            {t("home.cta.button")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
