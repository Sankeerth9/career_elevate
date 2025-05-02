import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEducationalPathways } from "@/lib/api";
import { 
  educationLevels, 
  states, 
  careerAims, 
  budgetRanges 
} from "@shared/schema";
import { trendingCareerFields } from "@/lib/careerData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Building,
  GraduationCap,
  Briefcase,
  Search,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Banknote,
  MapPin,
  Clock,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExploreCareers() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("careers");
  const [filters, setFilters] = useState({
    educationLevel: searchParams.get("educationLevel") || "",
    state: searchParams.get("state") || "",
    careerAim: searchParams.get("careerAim") || "",
    budget: searchParams.get("budget") || "",
  });

  // Fetch educational pathways
  const { data: pathways, isLoading } = useQuery({
    queryKey: ['/api/pathways', filters.educationLevel],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update search params when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.append(key, value);
      }
    });
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      educationLevel: "",
      state: "",
      careerAim: "",
      budget: "",
    });
  };

  return (
    <>
      <Helmet>
        <title>Explore Careers | {t("appName")}</title>
      </Helmet>

      <div className="bg-primary-700 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Explore Career Opportunities
          </h1>
          <p className="mt-3 text-xl text-primary-200">
            Discover career paths, educational requirements, and job market insights
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filter Options</CardTitle>
              {Object.values(filters).some(value => value) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
            <CardDescription>Narrow down your career exploration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="educationLevel" className="block text-sm font-medium mb-1">
                  Education Level
                </label>
                <Select
                  value={filters.educationLevel}
                  onValueChange={(value) => handleFilterChange("educationLevel", value)}
                >
                  <SelectTrigger id="educationLevel">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All levels</SelectItem>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {t(`educationLevels.${level}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-1">
                  State
                </label>
                <Select
                  value={filters.state}
                  onValueChange={(value) => handleFilterChange("state", value)}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="All states" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All states</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {t(`states.${state}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="careerAim" className="block text-sm font-medium mb-1">
                  Career Aim
                </label>
                <Select
                  value={filters.careerAim}
                  onValueChange={(value) => handleFilterChange("careerAim", value)}
                >
                  <SelectTrigger id="careerAim">
                    <SelectValue placeholder="All careers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All careers</SelectItem>
                    {careerAims.map((aim) => (
                      <SelectItem key={aim} value={aim}>
                        {t(`careerAims.${aim}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-1">
                  Budget Range
                </label>
                <Select
                  value={filters.budget}
                  onValueChange={(value) => handleFilterChange("budget", value)}
                >
                  <SelectTrigger id="budget">
                    <SelectValue placeholder="All budgets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All budgets</SelectItem>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {t(`budgetRanges.${range}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="careers">
              <Briefcase className="mr-2 h-4 w-4" />
              Career Fields
            </TabsTrigger>
            <TabsTrigger value="education">
              <GraduationCap className="mr-2 h-4 w-4" />
              Educational Pathways
            </TabsTrigger>
            <TabsTrigger value="insights">
              <BarChart className="mr-2 h-4 w-4" />
              Market Insights
            </TabsTrigger>
          </TabsList>

          {/* Career Fields Tab */}
          <TabsContent value="careers">
            <h2 className="text-2xl font-bold mb-4">Top Career Fields</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingCareerFields.map((field) => (
                <Card key={field.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{field.name}</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {field.growthRate} Growth
                      </Badge>
                    </div>
                    <CardDescription>
                      {field.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Salary:</span>
                        <span className="text-sm font-medium">{field.averageSalary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Job Openings:</span>
                        <span className="text-sm font-medium">{field.jobOpenings}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Key Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {field.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {field.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{field.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/career/${field.id}`}>
                        Explore <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/career-assessment">
                <Button>
                  Take Career Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Educational Pathways Tab */}
          <TabsContent value="education">
            <h2 className="text-2xl font-bold mb-4">Educational Pathways</h2>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pathways?.map((pathway) => (
                  <Card key={pathway.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-md ${
                          pathway.title.includes("Engineering") ? "bg-primary-100 text-primary-700" : 
                          pathway.title.includes("Medical") ? "bg-purple-100 text-purple-700" : 
                          pathway.title.includes("Law") ? "bg-green-100 text-green-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {pathway.icon === "building" ? <Building className="h-5 w-5" /> :
                           pathway.icon === "heart" ? <TrendingUp className="h-5 w-5" /> :
                           pathway.icon === "scale" ? <Briefcase className="h-5 w-5" /> :
                           <GraduationCap className="h-5 w-5" />}
                        </div>
                        <CardTitle>{pathway.title}</CardTitle>
                      </div>
                      <CardDescription>{pathway.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Entrance Exams:</span>
                        <span className="text-sm font-medium text-right">{pathway.entranceExams?.join(", ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Average Fees:</span>
                        <span className="text-sm font-medium">{pathway.averageFees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Job Prospects:</span>
                        <span className="text-sm font-medium text-green-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {pathway.jobProspects}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/educational-pathways/${pathway.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link to="/educational-pathways">
                <Button>
                  View All Pathways
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Market Insights Tab */}
          <TabsContent value="insights">
            <h2 className="text-2xl font-bold mb-4">Job Market Insights</h2>
            
            <div className="space-y-6">
              {/* Salary Range Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Banknote className="mr-2 h-5 w-5" />
                    Salary Ranges by Education Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">High School / 12th</div>
                      <div className="text-right">₹1.8L - ₹4L</div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-primary h-4 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Diploma</div>
                      <div className="text-right">₹2.5L - ₹6L</div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-primary h-4 rounded-full" style={{ width: "40%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Bachelor's Degree</div>
                      <div className="text-right">₹3.5L - ₹12L</div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-primary h-4 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Master's Degree</div>
                      <div className="text-right">₹6L - ₹20L</div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-primary h-4 rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Professional Degree (MD, etc.)</div>
                      <div className="text-right">₹12L - ₹40L+</div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-primary h-4 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Trends Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Regional Growth Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-bold">Bangalore</h3>
                      <div className="text-sm text-muted-foreground mb-2">Top Sectors</div>
                      <div className="space-y-1">
                        <Badge className="mr-1 mb-1">IT</Badge>
                        <Badge className="mr-1 mb-1">Startups</Badge>
                        <Badge className="mr-1 mb-1">Fintech</Badge>
                      </div>
                      <div className="flex justify-between mt-3">
                        <span className="text-sm text-muted-foreground">Growth</span>
                        <span className="text-sm font-medium text-green-600">+22%</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-bold">Hyderabad</h3>
                      <div className="text-sm text-muted-foreground mb-2">Top Sectors</div>
                      <div className="space-y-1">
                        <Badge className="mr-1 mb-1">IT</Badge>
                        <Badge className="mr-1 mb-1">Pharma</Badge>
                        <Badge className="mr-1 mb-1">Education</Badge>
                      </div>
                      <div className="flex justify-between mt-3">
                        <span className="text-sm text-muted-foreground">Growth</span>
                        <span className="text-sm font-medium text-green-600">+20%</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-bold">Delhi NCR</h3>
                      <div className="text-sm text-muted-foreground mb-2">Top Sectors</div>
                      <div className="space-y-1">
                        <Badge className="mr-1 mb-1">E-commerce</Badge>
                        <Badge className="mr-1 mb-1">IT/ITES</Badge>
                        <Badge className="mr-1 mb-1">Consulting</Badge>
                      </div>
                      <div className="flex justify-between mt-3">
                        <span className="text-sm text-muted-foreground">Growth</span>
                        <span className="text-sm font-medium text-green-600">+18%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Future Trends Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Future Career Trends (5-Year Forecast)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-purple-50">
                      <h3 className="font-bold">AI & Machine Learning</h3>
                      <p className="text-sm mt-1">Expected to grow exponentially with emerging applications in healthcare, finance, and education.</p>
                      <div className="flex justify-between mt-3">
                        <span className="text-sm text-muted-foreground">Projected Growth</span>
                        <span className="text-sm font-medium text-purple-600">+75%</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-bold">Renewable Energy</h3>
                      <p className="text-sm mt-1">Increasing focus on sustainability is driving demand for renewable energy professionals.</p>
                      <div className="flex justify-between mt-3">
                        <span className="text-sm text-muted-foreground">Projected Growth</span>
                        <span className="text-sm font-medium text-blue-600">+65%</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50">
                      <h3 className="font-bold">Healthcare Tech</h3>
                      <p className="text-sm mt-1">Integration of technology in healthcare will create new roles and opportunities.</p>
                      <div className="flex justify-between mt-3">
                        <span className="text-sm text-muted-foreground">Projected Growth</span>
                        <span className="text-sm font-medium text-green-600">+55%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Link to="/job-listings">
                <Button>
                  Browse Job Listings
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
