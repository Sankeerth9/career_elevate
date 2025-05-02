import { useTranslation } from "react-i18next";
import { 
  BarChart3, 
  MessageSquare, 
  Briefcase, 
  GraduationCap 
} from "lucide-react";

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "AI-Powered Recommendations",
      description: "Get personalized career suggestions based on your skills, interests, and educational background using advanced AI algorithms."
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Multilingual Support",
      description: "Access the platform in 8 regional languages to ensure everyone can understand their career options clearly."
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Educational Fee Calculator",
      description: "Compare costs for different educational paths, including tuition, living expenses, and potential scholarship opportunities."
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Local Job Market Insights",
      description: "Discover employment opportunities specific to your region with salary data, growth potential, and work location options."
    }
  ];

  return (
    <div className="bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            {t("home.features.title")}
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            {t("home.features.subtitle")}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
            {t("home.features.description")}
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  {feature.icon}
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-neutral-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
