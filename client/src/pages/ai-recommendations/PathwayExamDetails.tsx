import { useState, useEffect } from "react";
import { BookOpen, Calendar, School, ArrowLeft, ExternalLink, Check, Info } from "lucide-react";
import { getExamsByCareer, EntranceExam } from "@/data/entranceExams";
import { getCollegesByFilters, College } from "@/data/colleges";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PathwayExamDetailsProps {
  pathwayId: number;
  pathwayTitle: string;
  budget: string;
  onBack: () => void;
}

export default function PathwayExamDetails({ 
  pathwayId, 
  pathwayTitle, 
  budget = "medium", 
  onBack 
}: PathwayExamDetailsProps) {
  const [activeTab, setActiveTab] = useState("exams");
  const [relevantExams, setRelevantExams] = useState<EntranceExam[]>([]);
  const [recommendedColleges, setRecommendedColleges] = useState<College[]>([]);
  
  // Get color based on pathway title
  const getPathwayColor = (title: string) => {
    if (title.includes("Engineering") || title.includes("Manufacturing")) return {
      bg: "bg-primary-600",
      text: "text-primary-700",
      highlight: "text-primary-600",
      border: "border-primary-200",
      bgLight: "bg-primary-50",
    };
    if (title.includes("Medical") || title.includes("Healthcare")) return {
      bg: "bg-purple-600",
      text: "text-purple-700",
      highlight: "text-purple-600",
      border: "border-purple-200",
      bgLight: "bg-purple-50",
    };
    if (title.includes("Law") || title.includes("Legal")) return {
      bg: "bg-green-600",
      text: "text-green-700",
      highlight: "text-green-600",
      border: "border-green-200",
      bgLight: "bg-green-50",
    };
    return {
      bg: "bg-blue-600",
      text: "text-blue-700",
      highlight: "text-blue-600",
      border: "border-blue-200",
      bgLight: "bg-blue-50",
    };
  };
  
  const colors = getPathwayColor(pathwayTitle);
  
  // Load exams and colleges based on pathway and budget
  useEffect(() => {
    // Extract career path from title
    let careerPath = "Arts";
    
    if (pathwayTitle.includes("Engineering") || pathwayTitle.includes("Manufacturing")) {
      careerPath = "Engineering";
    } else if (pathwayTitle.includes("Medical") || pathwayTitle.includes("Healthcare")) {
      careerPath = "Medical";
    } else if (pathwayTitle.includes("Law") || pathwayTitle.includes("Legal")) {
      careerPath = "Law";
    } else if (pathwayTitle.includes("Business") || pathwayTitle.includes("Management") || pathwayTitle.includes("Commerce")) {
      careerPath = "Business";
    }
    
    console.log("Career path:", careerPath, "Budget:", budget);
    
    // Get filtered colleges
    const colleges = getCollegesByFilters(careerPath, budget);
    setRecommendedColleges(colleges);
    
    // Get exams for this career path
    const exams = getExamsByCareer(careerPath);
    setRelevantExams(exams);
  }, [pathwayTitle, budget]);
  
  return (
    <div className="space-y-6 animate-float-delay">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recommendations
        </Button>
        
        <Badge className={`${colors.bgLight} ${colors.text} px-3 py-1`}>
          {budget === "low" ? "Low Budget" : 
           budget === "medium" ? "Medium Budget" : 
           budget === "high" ? "High Budget" : "Very High Budget"}
        </Badge>
      </div>
      
      <Card>
        <div className={`h-2 w-full ${colors.bg}`} />
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-lg ${colors.bgLight} ${colors.text}`}>
              {pathwayTitle.includes("Engineering") || pathwayTitle.includes("Manufacturing") ? 
               <School className="h-8 w-8" /> : 
               pathwayTitle.includes("Medical") ? 
               <BookOpen className="h-8 w-8" /> : 
               <School className="h-8 w-8" />}
            </div>
            <div>
              <CardTitle className="text-2xl text-gradient">{pathwayTitle}</CardTitle>
              <CardDescription className="text-base mt-1">
                Entrance Exam Details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-6 glass-card-colored animate-pulse-slow">
            <Info className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              These entrance exams and colleges are filtered based on your selected budget: <strong>{budget.toUpperCase()}</strong>. Different budget ranges give you access to different educational institutions.
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger value="exams">
                <BookOpen className="mr-2 h-4 w-4" />
                Entrance Exams
              </TabsTrigger>
              <TabsTrigger value="colleges">
                <School className="mr-2 h-4 w-4" />
                Recommended Colleges
              </TabsTrigger>
            </TabsList>
            
            {/* Entrance Exams Tab */}
            <TabsContent value="exams">
              <div className="space-y-6">
                {relevantExams.length > 0 ? (
                  relevantExams.map((exam) => (
                    <div 
                      key={exam.id} 
                      className={`p-4 border rounded-lg ${colors.border} flex items-start card-hover-effect glass-card-colored animate-pulse-slow`}
                    >
                      <div className={`p-2 rounded-full ${colors.bgLight} ${colors.text} mr-4`}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gradient">{exam.name}</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          {exam.fullName} for admission to top institutes
                        </p>
                        <div className="flex flex-wrap justify-between mt-2 gap-y-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {exam.examMonth} annually
                            </span>
                          </div>
                          
                          <div className="flex items-center ml-8">
                            <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border-gradient">
                              {exam.examLevel.charAt(0).toUpperCase() + exam.examLevel.slice(1)} level
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Eligibility:</span>
                            <span>{exam.eligibility}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-muted-foreground">Application Period:</span>
                            <span>{exam.applicationMonth}</span>
                          </div>
                          
                          <div className="mt-3 text-right">
                            <Button size="sm" variant="outline" className="btn-gradient" asChild>
                              <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer">
                                Official Website
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No entrance exams found for this pathway.</p>
                    <p className="mt-2">Try selecting a different budget option or pathway.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Colleges Tab */}
            <TabsContent value="colleges">
              <div className="space-y-6">
                {recommendedColleges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedColleges.map((college) => (
                      <Card key={college.id} className={`border ${colors.border} card-hover-effect glass-card-colored animate-pulse-slow`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base text-gradient">{college.name}</CardTitle>
                          <CardDescription className="text-xs flex items-center mt-1">
                            <span className="inline-block w-2 h-2 rounded-full mr-1 bg-gray-400"></span>
                            {college.location}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="font-medium capitalize">{college.type}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Fees:</span>
                              <span className="font-medium">{college.feesRange}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Entrance Exams:</span>
                              <span className="font-medium">{college.entranceExams.join(", ")}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Ranking:</span>
                              <span className="font-medium">#{college.ranking} in category</span>
                            </div>
                            
                            <div className="pt-2 mt-2 border-t">
                              <Button variant="outline" size="sm" className="w-full btn-gradient" asChild>
                                <a href={college.websiteUrl} target="_blank" rel="noopener noreferrer">
                                  Visit Website
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No colleges found in your budget range for this pathway.</p>
                    <p className="mt-2">Try selecting a different budget option.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <Button onClick={onBack} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recommendations
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}