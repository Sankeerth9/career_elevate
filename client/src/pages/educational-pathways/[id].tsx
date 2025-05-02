import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { EducationalPathway } from "@shared/schema";
import { getEducationalPathway } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getExamsByCareer } from "@/data/entranceExams";

import {
  Building,
  Heart,
  Scale,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  DollarSign,
  Landmark,
  User,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  School,
  Clock,
  Globe,
  CheckCircle2,
  FileText,
} from "lucide-react";

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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function PathwayDetailPage() {
  const [, params] = useRoute<{ id: string }>("/educational-pathways/:id");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Get pathway ID from route parameter
  const pathwayId = params?.id ? parseInt(params.id, 10) : 0;

  // Fetch pathway details
  const {
    data: pathway,
    isLoading,
    error,
  } = useQuery<EducationalPathway>({
    queryKey: [`/api/pathways/${pathwayId}`],
    queryFn: () => getEducationalPathway(pathwayId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: pathwayId > 0,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading pathway",
        description: "Unable to load the pathway details. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Get the appropriate icon
  const getPathwayIcon = (title: string, icon?: string | null) => {
    if (icon === "building") return <Building className="h-8 w-8" />;
    if (icon === "heart") return <Heart className="h-8 w-8" />;
    if (icon === "scale") return <Scale className="h-8 w-8" />;

    if (title.includes("Engineering")) return <Building className="h-8 w-8" />;
    if (title.includes("Medical")) return <Heart className="h-8 w-8" />;
    if (title.includes("Law")) return <Scale className="h-8 w-8" />;
    if (title.includes("Commerce") || title.includes("MBA"))
      return <Briefcase className="h-8 w-8" />;
    return <GraduationCap className="h-8 w-8" />;
  };

  // Get relevant entrance exams based on pathway title
  const getRelevantExams = (title: string) => {
    if (title.includes("Engineering")) return getExamsByCareer("Engineering");
    if (title.includes("Medical")) return getExamsByCareer("Medical");
    if (title.includes("Law")) return getExamsByCareer("Law");
    if (title.includes("Commerce") || title.includes("MBA"))
      return getExamsByCareer("Chartered Accountancy");
    return [];
  };

  // Determine growth rate color
  const getGrowthRateColor = (rate: string) => {
    const percentValue = parseInt(rate.replace("+", "").replace("%", ""), 10);
    if (percentValue >= 25) return "text-green-600";
    if (percentValue >= 15) return "text-green-500";
    if (percentValue >= 10) return "text-amber-500";
    return "text-amber-600";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Error state
  if (!pathway) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Pathway Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          The educational pathway you're looking for doesn't exist or has been
          removed.
        </p>
        <Button asChild>
          <Link to="/educational-pathways">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pathways
          </Link>
        </Button>
      </div>
    );
  }

  const relevantExams = getRelevantExams(pathway.title);

  return (
    <>
      <Helmet>
        <title>{`${pathway.title} | Career Pathways`}</title>
      </Helmet>

      {/* Pathway Hero Section */}
      <div
        className={`py-12 px-4 sm:px-6 lg:px-8 ${
          pathway.title.includes("Engineering")
            ? "bg-primary-700"
            : pathway.title.includes("Medical")
            ? "bg-purple-700"
            : pathway.title.includes("Law")
            ? "bg-green-700"
            : "bg-blue-700"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              asChild
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/20"
            >
              <Link to="/educational-pathways">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pathways
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div
              className={`p-4 rounded-xl ${
                pathway.title.includes("Engineering")
                  ? "bg-primary-600"
                  : pathway.title.includes("Medical")
                  ? "bg-purple-600"
                  : pathway.title.includes("Law")
                  ? "bg-green-600"
                  : "bg-blue-600"
              } text-white`}
            >
              {getPathwayIcon(pathway.title, pathway.icon)}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {pathway.title}
              </h1>
              <p className="mt-3 text-xl text-white/75">{pathway.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white border-white/20"
                >
                  <User className="h-3 w-3 mr-1" />
                  After {pathway.afterEducationLevel}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white border-white/20"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  {pathway.entranceExams?.length || 0} Entrance Exams
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white border-white/20"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {pathway.growthRate} Growth
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-md mb-8">
            <TabsTrigger value="overview">
              <FileText className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="exams">
              <BookOpen className="mr-2 h-4 w-4" />
              Entrance Exams
            </TabsTrigger>
            <TabsTrigger value="institutes">
              <School className="mr-2 h-4 w-4" />
              Institutes
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Main Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pathway Details</CardTitle>
                    <CardDescription>
                      Key information about this educational pathway
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Description</h3>
                      <p className="text-muted-foreground">
                        {pathway.description}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3">Job Prospects</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{pathway.jobProspects}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pathway.title.includes("Engineering")
                          ? "Graduates find roles in technology companies, manufacturing, infrastructure, and emerging tech sectors."
                          : pathway.title.includes("Medical")
                          ? "Opportunities in hospitals, clinics, research institutions, and pharmaceutical companies."
                          : pathway.title.includes("Law")
                          ? "Career options in corporate firms, litigation, judiciary, legal consultancy, and government."
                          : "Various positions across industries with good growth potential."}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3">Educational Journey</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Years 1-2</h4>
                            <p className="text-sm text-muted-foreground">
                              {pathway.title.includes("Engineering")
                                ? "Foundation courses in mathematics, physics, programming, and engineering basics."
                                : pathway.title.includes("Medical")
                                ? "Pre-clinical subjects like anatomy, physiology, biochemistry, and microbiology."
                                : pathway.title.includes("Law")
                                ? "Legal methods, constitutional law, and legal theory fundamentals."
                                : "Core subjects and foundational principles."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Years 3-4</h4>
                            <p className="text-sm text-muted-foreground">
                              {pathway.title.includes("Engineering")
                                ? "Specialization in chosen branch, advanced subjects, projects, and internships."
                                : pathway.title.includes("Medical")
                                ? "Clinical subjects, hospital rotations, and speciality introductions."
                                : pathway.title.includes("Law")
                                ? "Specialized laws, moot courts, internships, and practical legal training."
                                : "Advanced topics, specializations, and professional development."}
                            </p>
                          </div>
                        </div>

                        {(pathway.title.includes("Medical") || pathway.title.includes("Law")) && (
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">
                                {pathway.title.includes("Medical") ? "Year 5 (Internship)" : "Year 5 (Optional)"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {pathway.title.includes("Medical")
                                  ? "Compulsory rotating internship in different departments."
                                  : "LLM or specialized diploma courses for further expertise."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Gained */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Gained</CardTitle>
                    <CardDescription>
                      Key competencies developed through this pathway
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pathway.title.includes("Engineering") ? (
                        <>
                          <div className="space-y-2">
                            <h4 className="font-medium">Technical Skills</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Problem Solving</span>
                                  <span className="text-sm">90%</span>
                                </div>
                                <Progress value={90} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Software Development</span>
                                  <span className="text-sm">85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Data Analysis</span>
                                  <span className="text-sm">80%</span>
                                </div>
                                <Progress value={80} className="h-2" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Soft Skills</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Project Management</span>
                                  <span className="text-sm">85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Teamwork</span>
                                  <span className="text-sm">90%</span>
                                </div>
                                <Progress value={90} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Communication</span>
                                  <span className="text-sm">75%</span>
                                </div>
                                <Progress value={75} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : pathway.title.includes("Medical") ? (
                        <>
                          <div className="space-y-2">
                            <h4 className="font-medium">Clinical Skills</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Patient Care</span>
                                  <span className="text-sm">95%</span>
                                </div>
                                <Progress value={95} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Diagnostic Abilities</span>
                                  <span className="text-sm">90%</span>
                                </div>
                                <Progress value={90} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Medical Knowledge</span>
                                  <span className="text-sm">95%</span>
                                </div>
                                <Progress value={95} className="h-2" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Professional Skills</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Communication</span>
                                  <span className="text-sm">90%</span>
                                </div>
                                <Progress value={90} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Empathy</span>
                                  <span className="text-sm">95%</span>
                                </div>
                                <Progress value={95} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Research Aptitude</span>
                                  <span className="text-sm">80%</span>
                                </div>
                                <Progress value={80} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <h4 className="font-medium">Legal Skills</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Legal Analysis</span>
                                  <span className="text-sm">95%</span>
                                </div>
                                <Progress value={95} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Research</span>
                                  <span className="text-sm">90%</span>
                                </div>
                                <Progress value={90} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Case Building</span>
                                  <span className="text-sm">85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Professional Skills</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Argumentation</span>
                                  <span className="text-sm">95%</span>
                                </div>
                                <Progress value={95} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Negotiation</span>
                                  <span className="text-sm">90%</span>
                                </div>
                                <Progress value={90} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Critical Thinking</span>
                                  <span className="text-sm">95%</span>
                                </div>
                                <Progress value={95} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Average Fees</span>
                      </div>
                      <span className="font-medium">{pathway.averageFees}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Course Duration</span>
                      </div>
                      <span className="font-medium">
                        {pathway.title.includes("Medical")
                          ? "5.5 Years"
                          : pathway.title.includes("Law")
                          ? "5 Years"
                          : "4 Years"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Growth Rate</span>
                      </div>
                      <span className={`font-medium ${getGrowthRateColor(pathway.growthRate || "+10%")}`}>
                        {pathway.growthRate}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Global Opportunities</span>
                      </div>
                      <span className="font-medium">
                        {pathway.title.includes("Engineering")
                          ? "High"
                          : pathway.title.includes("Medical")
                          ? "Medium-High"
                          : "Medium"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Entrance Exams</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pathway.entranceExams?.map((exam, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 text-primary mr-2" />
                          <span>{exam}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setActiveTab("exams")}
                      >
                        View All Exams
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Career Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Take our comprehensive career assessment to determine if this pathway
                      aligns with your interests and aptitude.
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/ai-recommendations">Start Assessment</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Entrance Exams Tab */}
          <TabsContent value="exams">
            <Card>
              <CardHeader>
                <CardTitle>Entrance Exams for {pathway.title}</CardTitle>
                <CardDescription>
                  Key competitive exams to pursue this educational pathway
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {pathway.entranceExams?.map((exam, index) => {
                    const examDetails = relevantExams.find(e => e.name === exam);
                    
                    return (
                      <AccordionItem key={index} value={`exam-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium text-left">{exam}</div>
                              <div className="text-sm text-muted-foreground text-left">
                                {examDetails?.fullName || 
                                 `Competitive entrance exam for ${pathway.title.replace(" Path", "")}`}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          <div className="flex">
                            <div className="w-40 font-medium">Eligibility:</div>
                            <div>
                              {examDetails?.eligibility || 
                               `${pathway.afterEducationLevel} pass with required subjects`}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Exam Month:</div>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {examDetails?.examMonth || "Varies"}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Application:</div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {examDetails?.applicationMonth || "2-3 months before exam"}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Website:</div>
                            <a 
                              href={examDetails?.officialWebsite || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center"
                            >
                              Visit Official Website
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                          <div className="flex">
                            <div className="w-40 font-medium">Importance:</div>
                            <div className="flex items-center">
                              <div className="flex">
                                {Array(examDetails?.importance || 4).fill(0).map((_, i) => (
                                  <Award key={i} className="h-4 w-4 text-amber-500" />
                                ))}
                                {Array(5 - (examDetails?.importance || 4)).fill(0).map((_, i) => (
                                  <Award key={i} className="h-4 w-4 text-muted-foreground" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Note: Exam patterns, eligibility criteria, and dates may change. 
                  Always check the official websites for the most up-to-date information.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Institutes Tab */}
          <TabsContent value="institutes">
            <Card>
              <CardHeader>
                <CardTitle>Top Institutes for {pathway.title}</CardTitle>
                <CardDescription>
                  Prestigious institutions offering excellent education in this field
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pathway.topInstitutes?.map((institute, index) => (
                    <Card key={index} className="overflow-hidden border-0 shadow-md">
                      <div
                        className={`h-3 w-full ${
                          index === 0
                            ? "bg-amber-500"
                            : index === 1
                            ? "bg-slate-400"
                            : index === 2
                            ? "bg-amber-700"
                            : "bg-primary/60"
                        }`}
                      />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{institute}</CardTitle>
                        <CardDescription>
                          {index === 0
                            ? "Premier Institute"
                            : index === 1
                            ? "Top Ranked"
                            : "Highly Regarded"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">NIRF Ranking:</span>
                          <span className="text-sm font-medium">
                            {index === 0 ? "#1" : index === 1 ? "#2" : `Top ${5 + index * 3}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Acceptance Rate:</span>
                          <span className="text-sm font-medium">
                            {index === 0
                              ? "< 1%"
                              : index === 1
                              ? "~2%"
                              : index === 2
                              ? "~5%"
                              : "10-15%"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Facilities:</span>
                          <span className="text-sm font-medium flex">
                            {Array(5).fill(0).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < (5 - index/2) ? "text-amber-500" : "text-muted-foreground"}`} 
                              />
                            ))}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          <Globe className="mr-2 h-3 w-3" />
                          Visit Website
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground mb-4">
                  These institutes are renowned for their academic excellence, 
                  faculty expertise, infrastructure, and placement records.
                </p>
                
                <div className="w-full pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Admission Process</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-muted rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Entrance Exam</h4>
                        <p className="text-sm text-muted-foreground">
                          Qualify in the relevant entrance examinations with good scores
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-muted rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Counseling</h4>
                        <p className="text-sm text-muted-foreground">
                          Participate in centralized or institute-level counseling process
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-muted rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Document Verification</h4>
                        <p className="text-sm text-muted-foreground">
                          Submit required documents and complete verification process
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-muted rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Fee Payment</h4>
                        <p className="text-sm text-muted-foreground">
                          Pay the required fees and complete admission formalities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// Star component for institute ratings
function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}