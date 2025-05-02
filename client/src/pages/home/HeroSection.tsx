import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="bg-primary-700 pt-10 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {t("home.hero.title")}
        </h1>
        <p className="mt-3 text-xl text-primary-200 sm:mt-5">
          {t("home.hero.description")}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link to="/career-assessment">
            <Button size="lg" variant="secondary">
              {t("home.hero.takeAssessment")}
            </Button>
          </Link>
          <Link to="/explore-careers">
            <Button size="lg" variant="outline" className="text-white bg-primary-800 hover:bg-primary-900 border-primary-600">
              {t("home.hero.explorePaths")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
