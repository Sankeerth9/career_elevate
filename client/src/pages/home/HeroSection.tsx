import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      {/* Background pattern/overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/20 to-transparent"></div>
      
      {/* Floating shapes/elements */}
      <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-300 to-orange-500 blur-xl opacity-30 animate-float"></div>
      <div className="absolute bottom-40 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-300 to-purple-500 blur-xl opacity-20 animate-float-delay"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
              <Award className="h-4 w-4 mr-2" />
              <span>{t("appName")}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {t("home.hero.title")}
            </h1>
            
            <p className="text-xl text-primary-100 md:text-2xl max-w-2xl">
              {t("home.hero.description")}
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link to="/ai-recommendations">
                <Button size="lg" variant="default" className="w-full sm:w-auto bg-white text-primary-800 hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl rounded-xl">
                  {t("home.hero.takeAssessment")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/explore-careers">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-white border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 transform hover:-translate-y-1 rounded-xl"
                >
                  {t("home.hero.explorePaths")}
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-white/10 mt-10">
              <div className="text-center p-3">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-primary-200 text-sm mt-1">Users</div>
              </div>
              <div className="text-center p-3">
                <div className="text-3xl font-bold text-white">200+</div>
                <div className="text-primary-200 text-sm mt-1">Career Paths</div>
              </div>
              <div className="text-center p-3 col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-primary-200 text-sm mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-transparent z-10"></div>
            <div className="relative z-20">
              <img 
                src="/images/hero-image.jpg" 
                alt="Career Guidance" 
                className="w-full h-auto rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,96L60,80C120,64,240,32,360,26.7C480,21,600,43,720,53.3C840,64,960,64,1080,56C1200,48,1320,32,1380,24L1440,16L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z">
          </path>
        </svg>
      </div>
    </div>
  );
}
