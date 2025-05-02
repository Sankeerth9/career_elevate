import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getEducationalPathways } from "@/lib/api";
import { EducationalPathway } from "@shared/schema";
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
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Banknote,
  MapPin,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExploreCareers() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("careers");

  // Fetch educational pathways
  const { data: pathways, isLoading } = useQuery<EducationalPathway[]>({
    queryKey: ['/api/pathways'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
                {pathways && pathways.map((pathway) => (
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
                      <div className="font-medium">Professional Degree (Medical/Law)</div>
                      <div className="text-right">₹10L - ₹35L+</div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-primary h-4 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Growth Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Fastest Growing Career Fields
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Data Science & AI</div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        37% growth
                      </div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Healthcare</div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        29% growth
                      </div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Renewable Energy</div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        25% growth
                      </div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Cybersecurity</div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        23% growth
                      </div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Digital Marketing</div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        18% growth
                      </div>
                      <div className="w-full max-w-xs bg-slate-100 rounded-full h-4 ml-4">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Regional Job Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Bengaluru (Karnataka)</h4>
                        <p className="text-sm text-muted-foreground mb-2">Top tech hub with highest IT salaries</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">Software</Badge>
                          <Badge variant="outline" className="text-xs">AI/ML</Badge>
                          <Badge variant="outline" className="text-xs">Startups</Badge>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Hyderabad (Telangana)</h4>
                        <p className="text-sm text-muted-foreground mb-2">Growing IT center with pharma industry</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">IT Services</Badge>
                          <Badge variant="outline" className="text-xs">Pharma</Badge>
                          <Badge variant="outline" className="text-xs">Biotech</Badge>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Mumbai (Maharashtra)</h4>
                        <p className="text-sm text-muted-foreground mb-2">Financial capital with diverse opportunities</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">Finance</Badge>
                          <Badge variant="outline" className="text-xs">Media</Badge>
                          <Badge variant="outline" className="text-xs">Entertainment</Badge>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Chennai (Tamil Nadu)</h4>
                        <p className="text-sm text-muted-foreground mb-2">Manufacturing and IT services hub</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">Automotive</Badge>
                          <Badge variant="outline" className="text-xs">IT Services</Badge>
                          <Badge variant="outline" className="text-xs">Manufacturing</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}