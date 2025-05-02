import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  educationLevels,
  states,
  careerAims,
  budgetRanges
} from "@shared/schema";

export default function FilterSection() {
  const { t } = useTranslation();
  const [_, setLocation] = useLocation();
  
  const [filters, setFilters] = useState({
    educationLevel: "any",
    state: "any",
    careerAim: "any",
    budget: "any"
  });
  
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSearch = () => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "any") queryParams.append(key, value);
    });
    
    // Navigate to explore-careers with filters
    setLocation(`/explore-careers?${queryParams.toString()}`);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-7xl mx-auto -mt-10 mb-8 z-10 relative">
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Education Level Filter */}
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-neutral-700">
              {t("home.filters.educationLevel")}
            </label>
            <Select
              value={filters.educationLevel}
              onValueChange={(value) => handleFilterChange("educationLevel", value)}
            >
              <SelectTrigger id="education" className="mt-1">
                <SelectValue placeholder={t("home.filters.educationLevel")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {t("home.filters.educationLevel")}
                </SelectItem>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {t(`educationLevels.${level}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State Filter */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-neutral-700">
              {t("home.filters.state")}
            </label>
            <Select
              value={filters.state}
              onValueChange={(value) => handleFilterChange("state", value)}
            >
              <SelectTrigger id="state" className="mt-1">
                <SelectValue placeholder={t("home.filters.state")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {t("home.filters.state")}
                </SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {t(`states.${state}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Career Aim Filter */}
          <div>
            <label htmlFor="career" className="block text-sm font-medium text-neutral-700">
              {t("home.filters.careerAim")}
            </label>
            <Select
              value={filters.careerAim}
              onValueChange={(value) => handleFilterChange("careerAim", value)}
            >
              <SelectTrigger id="career" className="mt-1">
                <SelectValue placeholder={t("home.filters.careerAim")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {t("home.filters.careerAim")}
                </SelectItem>
                {careerAims.map((aim) => (
                  <SelectItem key={aim} value={aim}>
                    {t(`careerAims.${aim}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Filter */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-neutral-700">
              {t("home.filters.budget")}
            </label>
            <Select
              value={filters.budget}
              onValueChange={(value) => handleFilterChange("budget", value)}
            >
              <SelectTrigger id="budget" className="mt-1">
                <SelectValue placeholder={t("home.filters.budget")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {t("home.filters.budget")}
                </SelectItem>
                {budgetRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {t(`budgetRanges.${range}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={handleSearch}>
            {t("home.filters.findCareers")}
          </Button>
        </div>
      </div>
    </div>
  );
}
