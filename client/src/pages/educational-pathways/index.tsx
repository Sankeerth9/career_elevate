import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getEducationalPathways, getEducationalPathway } from "@/lib/api";
import { getExamsByCareer } from "@/data/entranceExams";
import { educationLevels, EducationalPathway } from "@shared/schema";
import PathwayDetailPage from "./PathwayDetailPage";
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
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap,
  BookOpen,
  Building,
  Heart,
  Scale,
  Briefcase,
  Search,
  TrendingUp,
  Clock,
  Calendar,
  ExternalLink,
  AlertCircle,
  School,
  DollarSign
} from "lucide-react";

export default function EducationalPathways() {
  const { t } = useTranslation();
  const [, params] = useRoute<{ id: string }>("/educational-pathways/:id");
  const pathwayId = params?.id ? parseInt(params.id, 10) : null;
  const [educationLevel, setEducationLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState("pathways");

  // Fetch single pathway if ID is provided
  const { 
    data: pathway, 
    isLoading: isLoadingPathway 
  } = useQuery<EducationalPathway>({
    queryKey: [`/api/pathways/${pathwayId}`],
    queryFn: () => getEducationalPathway(pathwayId!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: pathwayId !== null,
  });

  // Fetch all pathways if no ID is provided
  const { 
    data: pathways, 
    isLoading: isLoadingPathways 
  } = useQuery<EducationalPathway[]>({
    queryKey: ['/api/pathways', educationLevel],
    queryFn: () => getEducationalPathways(educationLevel === 'all' ? undefined : educationLevel),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: pathwayId === null,
  });
  
  // Filter pathways by search query (only when in list view)
  const filteredPathways = pathways?.filter((p: EducationalPathway) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.entranceExams?.some((exam: string) => exam.toLowerCase().includes(query)) ||
      p.topInstitutes?.some((institute: string) => institute.toLowerCase().includes(query))
    );
  });

  // Get icon based on pathway title
  const getPathwayIcon = (title: string, icon?: string | null) => {
    if (icon === "building") return <Building className="h-5 w-5" />;
    if (icon === "heart") return <Heart className="h-5 w-5" />;
    if (icon === "scale") return <Scale className="h-5 w-5" />;
    
    if (title.includes("Engineering")) return <Building className="h-5 w-5" />;
    if (title.includes("Medical")) return <Heart className="h-5 w-5" />;
    if (title.includes("Law")) return <Scale className="h-5 w-5" />;
    if (title.includes("Commerce") || title.includes("MBA")) return <Briefcase className="h-5 w-5" />;
    return <GraduationCap className="h-5 w-5" />;
  };

  // Get entrance exams data for some common career paths
  const engineeringExams = getExamsByCareer("Engineering");
  const medicalExams = getExamsByCareer("Medical");
  const lawExams = getExamsByCareer("Law");
  const commerceExams = getExamsByCareer("Chartered Accountancy");

  // If we're showing a specific pathway detail
  if (pathwayId !== null) {
    return (
      <>
        <Helmet>
          <title>{pathway?.title || "Pathway Details"} | {t("appName")}</title>
        </Helmet>

        <div className="bg-primary-700 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Educational Pathway Details
            </h1>
            <p className="mt-3 text-xl text-primary-200">
              Detailed information about career pathway, entrance exams, and institutions
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoadingPathway ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : pathway ? (
            <PathwayDetailPage pathway={pathway} />
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Pathway Not Found</h3>
              <p className="mt-2 text-muted-foreground">
                The educational pathway you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                asChild
              >
                <Link to="/educational-pathways">
                  Back to Pathways
                </Link>
              </Button>
            </div>
          )}
        </div>
      </>
    );
  }

  // Otherwise, show the list view
  return (
    <>
      <Helmet>
        <title>Educational Pathways | {t("appName")}</title>
      </Helmet>

      <div className="bg-primary-700 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Educational Pathways
          </h1>
          <p className="mt-3 text-xl text-primary-200">
            Explore educational routes, entrance exams, and institutions to achieve your career goals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search pathways, exams, or institutions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={educationLevel}
                onValueChange={setEducationLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All education levels</SelectItem>
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {t(`educationLevels.${level}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="pathways">
              <GraduationCap className="mr-2 h-4 w-4" />
              Pathways
            </TabsTrigger>
            <TabsTrigger value="exams">
              <BookOpen className="mr-2 h-4 w-4" />
              Entrance Exams
            </TabsTrigger>
            <TabsTrigger value="institutions">
              <Building className="mr-2 h-4 w-4" />
              Institutions
            </TabsTrigger>
          </TabsList>

          {/* Pathways Tab */}
          <TabsContent value="pathways">
            {isLoadingPathways ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredPathways && filteredPathways.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPathways.map((pathway: EducationalPathway) => (
                  <Card 
                    key={pathway.id} 
                    className="hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div 
                      className={`h-2 w-full ${
                        pathway.title.includes("Engineering") ? "bg-primary-600" : 
                        pathway.title.includes("Medical") ? "bg-purple-600" : 
                        pathway.title.includes("Law") ? "bg-green-600" :
                        "bg-blue-600"
                      }`}
                    />
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${
                          pathway.title.includes("Engineering") ? "bg-primary-100 text-primary-700" : 
                          pathway.title.includes("Medical") ? "bg-purple-100 text-purple-700" : 
                          pathway.title.includes("Law") ? "bg-green-100 text-green-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {getPathwayIcon(pathway.title, pathway.icon)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{pathway.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">{pathway.afterEducationLevel} education</CardDescription>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {pathway.description}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground font-medium mb-1 flex items-center">
                            <BookOpen className="h-3 w-3 mr-1 opacity-70" />
                            ENTRANCE EXAMS
                          </span>
                          <span className="text-sm">
                            {pathway.entranceExams?.slice(0, 3).join(", ")}
                            {(pathway.entranceExams?.length || 0) > 3 && "..."}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground font-medium mb-1 flex items-center">
                            <School className="h-3 w-3 mr-1 opacity-70" />
                            TOP INSTITUTES
                          </span>
                          <span className="text-sm">
                            {pathway.topInstitutes?.slice(0, 3).join(", ")}
                            {(pathway.topInstitutes?.length || 0) > 3 && "..."}
                          </span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm">{pathway.averageFees}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className={`h-4 w-4 mr-1 ${
                              pathway.growthRate?.includes("28") ? "text-green-600" : 
                              pathway.growthRate?.includes("20") ? "text-green-500" : 
                              "text-amber-500"
                            }`} />
                            <span className={`text-sm font-medium ${
                              pathway.growthRate?.includes("28") ? "text-green-600" : 
                              pathway.growthRate?.includes("20") ? "text-green-500" : 
                              "text-amber-500"
                            }`}>
                              {pathway.growthRate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        asChild 
                        className={`w-full group-hover:bg-opacity-90 transition-all ${
                          pathway.title.includes("Engineering") ? "bg-primary-600 hover:bg-primary-700" : 
                          pathway.title.includes("Medical") ? "bg-purple-600 hover:bg-purple-700" : 
                          pathway.title.includes("Law") ? "bg-green-600 hover:bg-green-700" :
                          "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        <Link to={`/educational-pathways/${pathway.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No pathways found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setEducationLevel("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Entrance Exams Tab */}
          <TabsContent value="exams">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engineering Entrance Exams</CardTitle>
                  <CardDescription>Key exams for engineering aspirants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {engineeringExams.map((exam) => (
                      <AccordionItem key={exam.id} value={exam.id.toString()}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium text-left">{exam.name}</div>
                              <div className="text-sm text-muted-foreground text-left">{exam.fullName}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <div className="flex">
                            <div className="w-40 font-medium">Eligibility:</div>
                            <div>{exam.eligibility}</div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Exam Month:</div>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {exam.examMonth}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Application:</div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {exam.applicationMonth}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Website:</div>
                            <a 
                              href={exam.officialWebsite} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center"
                            >
                              Visit Official Website
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical Entrance Exams</CardTitle>
                  <CardDescription>Key exams for medical aspirants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {medicalExams.map((exam) => (
                      <AccordionItem key={exam.id} value={exam.id.toString()}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-5 w-5 text-purple-500" />
                            <div>
                              <div className="font-medium text-left">{exam.name}</div>
                              <div className="text-sm text-muted-foreground text-left">{exam.fullName}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <div className="flex">
                            <div className="w-40 font-medium">Eligibility:</div>
                            <div>{exam.eligibility}</div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Exam Month:</div>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {exam.examMonth}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Application:</div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {exam.applicationMonth}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Website:</div>
                            <a 
                              href={exam.officialWebsite} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-500 hover:underline flex items-center"
                            >
                              Visit Official Website
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Law Entrance Exams</CardTitle>
                  <CardDescription>Key exams for law aspirants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {lawExams.map((exam) => (
                      <AccordionItem key={exam.id} value={exam.id.toString()}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-5 w-5 text-green-500" />
                            <div>
                              <div className="font-medium text-left">{exam.name}</div>
                              <div className="text-sm text-muted-foreground text-left">{exam.fullName}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <div className="flex">
                            <div className="w-40 font-medium">Eligibility:</div>
                            <div>{exam.eligibility}</div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Exam Month:</div>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {exam.examMonth}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Application:</div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {exam.applicationMonth}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Website:</div>
                            <a 
                              href={exam.officialWebsite} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-green-500 hover:underline flex items-center"
                            >
                              Visit Official Website
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commerce Entrance Exams</CardTitle>
                  <CardDescription>Key exams for commerce and accounting aspirants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {commerceExams.map((exam) => (
                      <AccordionItem key={exam.id} value={exam.id.toString()}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                            <div>
                              <div className="font-medium text-left">{exam.name}</div>
                              <div className="text-sm text-muted-foreground text-left">{exam.fullName}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <div className="flex">
                            <div className="w-40 font-medium">Eligibility:</div>
                            <div>{exam.eligibility}</div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Exam Month:</div>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {exam.examMonth}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Application:</div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {exam.applicationMonth}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Website:</div>
                            <a 
                              href={exam.officialWebsite} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline flex items-center"
                            >
                              Visit Official Website
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Institutions Tab */}
          <TabsContent value="institutions">
            <Card>
              <CardHeader>
                <CardTitle>Top Educational Institutions</CardTitle>
                <CardDescription>Leading institutions across different fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Engineering Institutions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 p-2 bg-primary-100 text-primary-700 rounded-lg">
                          <Building className="h-5 w-5" />
                        </div>
                        <CardTitle>Engineering</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm font-medium">Indian Institutes of Technology (IITs)</div>
                      <div className="text-sm font-medium">National Institutes of Technology (NITs)</div>
                      <div className="text-sm font-medium">BITS Pilani</div>
                      <div className="text-sm font-medium">Delhi Technological University</div>
                      <div className="text-sm font-medium">VIT Vellore</div>
                    </CardContent>
                  </Card>

                  {/* Medical Institutions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 p-2 bg-purple-100 text-purple-700 rounded-lg">
                          <Heart className="h-5 w-5" />
                        </div>
                        <CardTitle>Medical</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm font-medium">AIIMS Delhi</div>
                      <div className="text-sm font-medium">Christian Medical College, Vellore</div>
                      <div className="text-sm font-medium">JIPMER Puducherry</div>
                      <div className="text-sm font-medium">Maulana Azad Medical College</div>
                      <div className="text-sm font-medium">King George's Medical University</div>
                    </CardContent>
                  </Card>

                  {/* Law Institutions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 p-2 bg-green-100 text-green-700 rounded-lg">
                          <Scale className="h-5 w-5" />
                        </div>
                        <CardTitle>Law</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm font-medium">National Law School of India University, Bangalore</div>
                      <div className="text-sm font-medium">NALSAR University of Law, Hyderabad</div>
                      <div className="text-sm font-medium">National Law University, Delhi</div>
                      <div className="text-sm font-medium">Symbiosis Law School, Pune</div>
                      <div className="text-sm font-medium">Faculty of Law, Delhi University</div>
                    </CardContent>
                  </Card>

                  {/* Commerce/Management Institutions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 p-2 bg-blue-100 text-blue-700 rounded-lg">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <CardTitle>Commerce & Management</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm font-medium">Indian Institutes of Management (IIMs)</div>
                      <div className="text-sm font-medium">XLRI Jamshedpur</div>
                      <div className="text-sm font-medium">FMS Delhi</div>
                      <div className="text-sm font-medium">SRCC, Delhi University</div>
                      <div className="text-sm font-medium">Narsee Monjee Institute of Management Studies</div>
                    </CardContent>
                  </Card>

                  {/* Arts & Humanities Institutions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 p-2 bg-amber-100 text-amber-700 rounded-lg">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <CardTitle>Arts & Humanities</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm font-medium">St. Stephen's College, Delhi</div>
                      <div className="text-sm font-medium">Lady Shri Ram College, Delhi</div>
                      <div className="text-sm font-medium">Loyola College, Chennai</div>
                      <div className="text-sm font-medium">Christ University, Bangalore</div>
                      <div className="text-sm font-medium">Jawaharlal Nehru University, Delhi</div>
                    </CardContent>
                  </Card>

                  {/* Science Institutions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 p-2 bg-cyan-100 text-cyan-700 rounded-lg">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <CardTitle>Science</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm font-medium">Indian Institutes of Science Education and Research</div>
                      <div className="text-sm font-medium">Indian Institute of Science, Bangalore</div>
                      <div className="text-sm font-medium">St. Xavier's College, Mumbai</div>
                      <div className="text-sm font-medium">Fergusson College, Pune</div>
                      <div className="text-sm font-medium">Miranda House, Delhi</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}