import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getAssessmentById, getEducationalPathway } from "@/lib/api";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ExternalLink,
  BarChart,
  Clock,
  GraduationCap,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Building,
  MapPin,
  AlertCircle,
  CircleDollarSign,
  BookOpen,
  Star,
  Compass
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Recommendation {
  pathwayId: number;
  score: number;
  reason: string;
  careerOptions: string[];
  estimatedSalary: string;
  growthPotential: string;
  suggestedCourses: string[];
  // Additional fields for AI-enhanced recommendations (optional)
  strengthsMatchScore?: number;
  weaknessAreas?: string[];
  timeToEmployment?: string;
  regionalDemand?: {
    region: string;
    demandLevel: "high" | "medium" | "low";
    notes: string;
  }[];
}

export default function AssessmentResultsPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, params] = useRoute<{ id: string }>("/career-assessment/results/:id");
  const [activeTab, setActiveTab] = useState("recommendations");
  
  // If not authenticated, show a message
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to view your assessment results.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link to="/">Go to Home</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const assessmentId = params ? parseInt(params.id) : 0;
  
  // Fetch assessment data
  const { 
    data: assessment, 
    isLoading: isLoadingAssessment,
    error: assessmentError 
  } = useQuery({
    queryKey: ['/api/assessments', assessmentId],
    queryFn: () => getAssessmentById(assessmentId),
    enabled: !!assessmentId && isAuthenticated,
  });

  // Pick colors for the score badges
  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-blue-100 text-blue-800";
    if (score >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  // Pick icon for demand level
  const getDemandIcon = (level: string) => {
    switch (level) {
      case "high": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "medium": return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case "low": return <TrendingUp className="h-4 w-4 text-gray-600" />;
      default: return <TrendingUp className="h-4 w-4 text-blue-600" />;
    }
  };

  if (isLoadingAssessment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (assessmentError || !assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              We couldn't load your assessment results. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link to="/ai-recommendations">Take New Assessment</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const recommendations = assessment.results as unknown as Recommendation[];

  return (
    <>
      <Helmet>
        <title>Career Assessment Results | {t("appName")}</title>
      </Helmet>

      <div className="bg-primary-700 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your Career Pathway Recommendations
          </h1>
          <p className="mt-3 text-xl text-primary-200">
            Based on your assessment, we've found educational pathways that match your profile
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
            <CardDescription>
              Completed on {new Date(assessment.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Education Level</h3>
                <p className="mt-1 text-lg font-medium">{t(`educationLevels.${assessment.educationLevel}`)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1 text-lg font-medium">{t(`states.${assessment.state}`)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Career Interest</h3>
                <p className="mt-1 text-lg font-medium">
                  {assessment.careerAim ? t(`careerAims.${assessment.careerAim}`) : "Multiple Areas"}
                </p>
              </div>
            </div>
            
            {assessment.interests && assessment.interests.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {assessment.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {assessment.skills && assessment.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {assessment.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="recommendations">
              <Award className="mr-2 h-4 w-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="insights">
              <BarChart className="mr-2 h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="next-steps">
              <Compass className="mr-2 h-4 w-4" />
              Next Steps
            </TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <h2 className="text-2xl font-bold mb-4">Recommended Pathways</h2>
            
            {!recommendations || recommendations.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
                    <h3 className="mt-2 text-lg font-medium">No recommendations available</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      We couldn't generate recommendations based on your assessment.
                      Please try taking the assessment again.
                    </p>
                    <div className="mt-6">
                      <Button asChild>
                        <Link to="/ai-recommendations">Retake Assessment</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {recommendations.slice(0, 5).map((rec, index) => (
                  <Card key={index} className={index === 0 ? "border-primary" : ""}>
                    {index === 0 && (
                      <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-t-lg w-fit">
                        TOP MATCH
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">
                          Pathway #{rec.pathwayId}: {rec.careerOptions && rec.careerOptions[0] ? rec.careerOptions[0] : "Career"} & Related Fields
                        </CardTitle>
                        <Badge className={getScoreColor(rec.score)}>
                          {rec.score}% Match
                        </Badge>
                      </div>
                      <CardDescription>{rec.reason}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Career Options</h3>
                          <ul className="space-y-1">
                            {rec.careerOptions && rec.careerOptions.map((career, i) => (
                              <li key={i} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                {career}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Key Details</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="flex items-center text-sm">
                                <CircleDollarSign className="h-4 w-4 mr-2 text-gray-500" />
                                Average Salary:
                              </span>
                              <span className="text-sm font-medium">{rec.estimatedSalary}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="flex items-center text-sm">
                                <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                                Growth Potential:
                              </span>
                              <span className="text-sm font-medium text-green-600">{rec.growthPotential}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                Time to Employment:
                              </span>
                              <span className="text-sm font-medium">{rec.timeToEmployment || "3-4 years"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Suggested Courses */}
                      {rec.suggestedCourses && rec.suggestedCourses.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Suggested Courses</h3>
                          <div className="flex flex-wrap gap-2">
                            {rec.suggestedCourses.map((course, i) => (
                              <Badge key={i} variant="outline" className="bg-blue-50">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Regional Demand */}
                      {rec.regionalDemand && rec.regionalDemand.length > 0 && (
                        <div className="mt-4">
                          <Accordion type="single" collapsible>
                            <AccordionItem value="regional-demand">
                              <AccordionTrigger className="text-sm font-medium text-gray-700">
                                Regional Job Market Demand
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {rec.regionalDemand.map((region, i) => (
                                    <div key={i} className="flex items-start">
                                      <MapPin className="h-4 w-4 mt-0.5 mr-2 text-gray-500" />
                                      <div>
                                        <div className="flex items-center">
                                          <span className="font-medium">{region.region}:</span>
                                          <span className="ml-2 flex items-center">
                                            {getDemandIcon(region.demandLevel)}
                                            <span className="ml-1 text-sm capitalize">{region.demandLevel} demand</span>
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{region.notes}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/educational-pathways/${rec.pathwayId}`}>
                          Explore This Pathway
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <h2 className="text-2xl font-bold mb-4">Personal Insights</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Strengths Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendations && recommendations.length > 0 && recommendations[0].strengthsMatchScore && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Strength Match Score</span>
                        <span className="text-sm font-medium">{recommendations[0].strengthsMatchScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${recommendations[0].strengthsMatchScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {assessment.skills && assessment.skills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>{skill}</span>
                      </div>
                    ))}
                    {(!assessment.skills || assessment.skills.length === 0) && (
                      <p className="text-sm text-gray-500">No specific strengths were identified in your assessment.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Areas for Improvement Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                    Areas for Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recommendations && recommendations.length > 0 && recommendations[0].weaknessAreas && 
                     recommendations[0].weaknessAreas.map((area, index) => (
                      <div key={index} className="flex items-start">
                        <ArrowRight className="h-4 w-4 mt-0.5 text-blue-500 mr-2" />
                        <span>{area}</span>
                      </div>
                    ))}
                    {(!recommendations || !recommendations.length || !recommendations[0].weaknessAreas || recommendations[0].weaknessAreas.length === 0) && (
                      <p className="text-sm text-gray-500">No specific areas for improvement were identified in your assessment.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Skills Gap Analysis */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Skills Gap Analysis</CardTitle>
                <CardDescription>
                  Based on your current skills and the requirements for your recommended career paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Skills you may want to develop for your top career choices</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Career Path</TableHead>
                      <TableHead>Required Skills</TableHead>
                      <TableHead>Your Current Skills</TableHead>
                      <TableHead>Gap Analysis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendations && recommendations.length > 0 && recommendations.slice(0, 3).map((rec, index) => {
                      // Create a mock list of required skills based on career options
                      const requiredSkills = [
                        "Technical Knowledge",
                        "Problem Solving",
                        "Communication",
                        "Teamwork",
                        "Critical Thinking"
                      ];
                      
                      // Filter out skills the user already has
                      const userSkills = assessment.skills || [];
                      const skillGaps = requiredSkills.filter(skill => 
                        !userSkills.some(userSkill => 
                          userSkill.toLowerCase().includes(skill.toLowerCase())
                        )
                      );
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{rec.careerOptions && rec.careerOptions[0] ? rec.careerOptions[0] : "Career Option"}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {requiredSkills.map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {userSkills.map((skill, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {skillGaps.length === 0 ? (
                              <span className="text-green-600 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                No significant gaps
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {skillGaps.map((skill, i) => (
                                  <Badge key={i} variant="outline" className="bg-yellow-50 text-yellow-800 text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Next Steps Tab */}
          <TabsContent value="next-steps">
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            
            <div className="space-y-6">
              {/* Preparation Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Preparation Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="relative z-10 mb-8">
                      <div className="flex items-start">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold mr-4">
                          1
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border w-full">
                          <h3 className="font-semibold mb-2">Short Term (1-3 months)</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Research specific courses for {recommendations && recommendations.length > 0 && recommendations[0].careerOptions && recommendations[0].careerOptions[0] ? recommendations[0].careerOptions[0] : "your top career choice"}</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Connect with professionals in the field through LinkedIn or career fairs</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Start building fundamental skills through online courses</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative z-10 mb-8">
                      <div className="flex items-start">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">
                          2
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border w-full">
                          <h3 className="font-semibold mb-2">Medium Term (3-12 months)</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Prepare for entrance exams if required (JEE, NEET, CLAT, etc.)</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Apply for scholarships and financial aid</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Complete certification courses in relevant skills</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-bold mr-4">
                          3
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border w-full">
                          <h3 className="font-semibold mb-2">Long Term (1-4 years)</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Enroll in degree program for {recommendations && recommendations.length > 0 && recommendations[0].suggestedCourses && recommendations[0].suggestedCourses[0] ? recommendations[0].suggestedCourses[0] : "your chosen field"}</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Seek internships and practical experience opportunities</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Build professional network and portfolio</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Recommended Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Educational Institutions
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-500" />
                          <a href="#" className="text-blue-600 hover:underline">
                            Top Engineering Colleges
                          </a>
                        </li>
                        <li className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-500" />
                          <a href="#" className="text-blue-600 hover:underline">
                            Medical Institutes Directory
                          </a>
                        </li>
                        <li className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-500" />
                          <a href="#" className="text-blue-600 hover:underline">
                            Business Schools Rankings
                          </a>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Learning Resources
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-500" />
                          <a href="#" className="text-blue-600 hover:underline">
                            Online Courses (Coursera, edX)
                          </a>
                        </li>
                        <li className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-500" />
                          <a href="#" className="text-blue-600 hover:underline">
                            Entrance Exam Preparation Guides
                          </a>
                        </li>
                        <li className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-500" />
                          <a href="#" className="text-blue-600 hover:underline">
                            Skill Development Platforms
                          </a>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Career Resources
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-500" />
                          <a href="#" className="text-blue-600 hover:underline">
                            Industry Insights & Trends
                          </a>
                        </li>
                        <li className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-500" />
                          <a href="#" className="text-blue-600 hover:underline">
                            Professional Associations
                          </a>
                        </li>
                        <li className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-500" />
                          <a href="#" className="text-blue-600 hover:underline">
                            Internship Opportunities
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Call-to-Action */}
              <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <GraduationCap className="mx-auto h-12 w-12 text-primary" />
                    <h3 className="mt-2 text-lg font-medium">Ready to take the next step?</h3>
                    <p className="mt-1 text-sm text-gray-700 max-w-md mx-auto">
                      Explore detailed educational pathways, connect with counselors, or browse job opportunities aligned with your career goals.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                      <Button asChild variant="outline">
                        <Link to="/educational-pathways">
                          View All Pathways
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link to="/job-listings">
                          Browse Job Listings
                        </Link>
                      </Button>
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