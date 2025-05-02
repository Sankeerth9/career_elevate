import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Building, Heart, Scale, TrendingUp } from "lucide-react";
import { EducationalPathway } from "@shared/schema";

interface PathwaysSectionProps {
  pathways: EducationalPathway[];
}

export default function PathwaysSection({ pathways }: PathwaysSectionProps) {
  const { t } = useTranslation();
  
  // Only show first 3 pathways on home page
  const limitedPathways = pathways.slice(0, 3);

  // Function to get the appropriate icon component
  const getPathwayIcon = (icon: string) => {
    switch (icon) {
      case "building":
        return <Building className="h-6 w-6 text-white" />;
      case "heart":
        return <Heart className="h-6 w-6 text-white" />;
      case "scale":
        return <Scale className="h-6 w-6 text-white" />;
      default:
        return <Building className="h-6 w-6 text-white" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6">
        {t("home.pathways.title")}
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {limitedPathways.map((pathway) => (
          <Card key={pathway.id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${
                  pathway.title.includes("Engineering") ? "bg-primary-500" : 
                  pathway.title.includes("Medical") ? "bg-accent-500" : 
                  "bg-secondary-500"
                } rounded-md p-3`}>
                  {getPathwayIcon(pathway.icon)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">{pathway.title}</h3>
                  <p className="text-sm text-neutral-500">{pathway.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">
                      {t("home.pathways.entranceExams")}:
                    </span>
                    <span className="text-sm font-medium text-neutral-700">
                      {pathway.entranceExams?.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">
                      {t("home.pathways.topInstitutes")}:
                    </span>
                    <span className="text-sm font-medium text-neutral-700">
                      {pathway.topInstitutes?.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">
                      {t("home.pathways.averageFees")}:
                    </span>
                    <span className="text-sm font-medium text-neutral-700">
                      {pathway.averageFees}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">
                      {t("home.pathways.jobProspects")}:
                    </span>
                    <span className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {pathway.jobProspects}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link to={`/educational-pathways/${pathway.id}`}>
                  <Button variant="outline" className="text-primary-600 bg-primary-50 hover:bg-primary-100">
                    {t("home.pathways.explorePath")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="/educational-pathways">
          <Button variant="outline" className="text-neutral-700 bg-white hover:bg-neutral-50">
            {t("home.pathways.viewAll")}
            <ArrowRight className="ml-2 h-5 w-5 text-neutral-500" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
