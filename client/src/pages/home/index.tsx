import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import HeroSection from "./HeroSection";
import PathwaysSection from "./PathwaysSection";
import FeaturesSection from "./FeaturesSection";
import CareerCta from "./CareerCta";
import JobMarketSection from "./JobMarketSection";
import { useQuery } from "@tanstack/react-query";
import { getEducationalPathways } from "@/lib/api";

export default function Home() {
  const { t } = useTranslation();
  
  // Fetch educational pathways for the home page
  const { data: pathways } = useQuery({
    queryKey: ['/api/pathways'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <>
      <Helmet>
        <title>{t("appName")} - {t("tagline")}</title>
        <meta name="description" content={t("description")} />
      </Helmet>

      <HeroSection />
      <PathwaysSection pathways={pathways || []} />
      <FeaturesSection />
      <CareerCta />
      <JobMarketSection />
    </>
  );
}
