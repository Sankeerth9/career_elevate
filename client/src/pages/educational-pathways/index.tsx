import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getEducationalPathways } from "@/lib/api";
import { getExamsByCareer } from "@/data/entranceExams";
import { educationLevels, EducationalPathway } from "@shared/schema";
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
  AlertCircle
} from "lucide-react";

export default function EducationalPathways() {
  const { t } = useTranslation();
  const [educationLevel, setEducationLevel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState("pathways");

  // Fetch educational pathways
  const { data: pathways, isLoading } = useQuery<EducationalPathway[]>({
    queryKey: ['/api/pathways', educationLevel],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter pathways by search query
  const filteredPathways = pathways?.filter((pathway: EducationalPathway) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      pathway.title.toLowerCase().includes(query) ||
      pathway.description.toLowerCase().includes(query) ||
      pathway.entranceExams?.some((exam: string) => exam.toLowerCase().includes(query)) ||
      pathway.topInstitutes?.some((institute: string) => institute.toLowerCase().includes(query))
    );
  });

  // Get icon based on pathway title
  const getPathwayIcon = (title: string, icon?: string) => {
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
                  <SelectItem value="">All education levels</SelectItem>
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
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredPathways && filteredPathways.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPathways.map((pathway: EducationalPathway) => (
                  <Card key={pathway.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-md ${
                          pathway.title.includes("Engineering") ? "bg-primary-100 text-primary-700" : 
                          pathway.title.includes("Medical") ? "bg-purple-100 text-purple-700" : 
                          pathway.title.includes("Law") ? "bg-green-100 text-green-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {getPathwayIcon(pathway.title, pathway.icon)}
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
                        <span className="text-sm text-muted-foreground">Top Institutes:</span>
                        <span className="text-sm font-medium text-right">{pathway.topInstitutes?.join(", ")}</span>
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
                      <Button asChild variant="outline" className="w-full">
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
                    setEducationLevel("");
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
                            <BookOpen className="mr-2 h-5 w-5 text-accent-500" />
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
                  <CardTitle>Law Entrance Exams</CardTitle>
                  <CardDescription>Key exams for law aspirants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {lawExams.map((exam) => (
                      <AccordionItem key={exam.id} value={exam.id.toString()}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-5 w-5 text-secondary-500" />
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
                  <CardTitle>Commerce & Management Exams</CardTitle>
                  <CardDescription>Key exams for commerce and management aspirants</CardDescription>
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
            </div>
          </TabsContent>

          {/* Institutions Tab */}
          <TabsContent value="institutions">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Engineering Institutions */}
              <Card>
                <CardHeader className="bg-primary-50 border-b">
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-primary" />
                    Top Engineering Institutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IIT Bombay</span>
                      <span className="text-sm text-muted-foreground">Mumbai</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IIT Delhi</span>
                      <span className="text-sm text-muted-foreground">Delhi</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IIT Madras</span>
                      <span className="text-sm text-muted-foreground">Chennai</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IIT Kanpur</span>
                      <span className="text-sm text-muted-foreground">Kanpur</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">BITS Pilani</span>
                      <span className="text-sm text-muted-foreground">Pilani</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">NIT Trichy</span>
                      <span className="text-sm text-muted-foreground">Tiruchirappalli</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Medical Institutions */}
              <Card>
                <CardHeader className="bg-purple-50 border-b">
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-purple-600" />
                    Top Medical Institutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="font-medium">AIIMS Delhi</span>
                      <span className="text-sm text-muted-foreground">New Delhi</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">JIPMER</span>
                      <span className="text-sm text-muted-foreground">Puducherry</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">CMC Vellore</span>
                      <span className="text-sm text-muted-foreground">Vellore</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">AFMC</span>
                      <span className="text-sm text-muted-foreground">Pune</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">KGMU</span>
                      <span className="text-sm text-muted-foreground">Lucknow</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">Maulana Azad Medical College</span>
                      <span className="text-sm text-muted-foreground">Delhi</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Law Institutions */}
              <Card>
                <CardHeader className="bg-green-50 border-b">
                  <CardTitle className="flex items-center">
                    <Scale className="mr-2 h-5 w-5 text-green-600" />
                    Top Law Institutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="font-medium">NLSIU</span>
                      <span className="text-sm text-muted-foreground">Bangalore</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">NALSAR</span>
                      <span className="text-sm text-muted-foreground">Hyderabad</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">NLU Delhi</span>
                      <span className="text-sm text-muted-foreground">Delhi</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">WBNUJS</span>
                      <span className="text-sm text-muted-foreground">Kolkata</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">ILS Law College</span>
                      <span className="text-sm text-muted-foreground">Pune</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">Symbiosis Law School</span>
                      <span className="text-sm text-muted-foreground">Pune</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Management Institutions */}
              <Card>
                <CardHeader className="bg-blue-50 border-b">
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                    Top Management Institutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IIM Ahmedabad</span>
                      <span className="text-sm text-muted-foreground">Ahmedabad</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IIM Bangalore</span>
                      <span className="text-sm text-muted-foreground">Bangalore</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IIM Calcutta</span>
                      <span className="text-sm text-muted-foreground">Kolkata</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">XLRI</span>
                      <span className="text-sm text-muted-foreground">Jamshedpur</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">ISB</span>
                      <span className="text-sm text-muted-foreground">Hyderabad</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">FMS Delhi</span>
                      <span className="text-sm text-muted-foreground">Delhi</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Arts & Humanities Institutions */}
              <Card>
                <CardHeader className="bg-amber-50 border-b">
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-amber-600" />
                    Top Arts & Humanities Institutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="font-medium">JNU</span>
                      <span className="text-sm text-muted-foreground">New Delhi</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">Delhi University</span>
                      <span className="text-sm text-muted-foreground">Delhi</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">Jadavpur University</span>
                      <span className="text-sm text-muted-foreground">Kolkata</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">Jamia Millia Islamia</span>
                      <span className="text-sm text-muted-foreground">New Delhi</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">Loyola College</span>
                      <span className="text-sm text-muted-foreground">Chennai</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">Christ University</span>
                      <span className="text-sm text-muted-foreground">Bangalore</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Science Institutions */}
              <Card>
                <CardHeader className="bg-indigo-50 border-b">
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-indigo-600" />
                    Top Science Institutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IISc</span>
                      <span className="text-sm text-muted-foreground">Bangalore</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IISER Pune</span>
                      <span className="text-sm text-muted-foreground">Pune</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">TIFR</span>
                      <span className="text-sm text-muted-foreground">Mumbai</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IISER Mohali</span>
                      <span className="text-sm text-muted-foreground">Mohali</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">IISC Bombay</span>
                      <span className="text-sm text-muted-foreground">Mumbai</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-medium">CMI</span>
                      <span className="text-sm text-muted-foreground">Chennai</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link to="/career-assessment">
            <Button>
              Take Career Assessment
              <GraduationCap className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
