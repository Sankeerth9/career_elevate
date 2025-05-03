import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { EducationalPathway } from "@shared/schema";
import { getCollegesByFilters, College } from "@/data/colleges";
import { getExamsByCareer, EntranceExam } from "@/data/entranceExams";
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
  GraduationCap,
  BookOpen,
  Building,
  Heart,
  Scale,
  Briefcase,
  TrendingUp,
  Calendar,
  School,
  DollarSign,
  ArrowLeft
} from "lucide-react";

// Detail view component for pathway
export default function PathwayDetailPage({ pathway }: { pathway: EducationalPathway }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [location] = useLocation();
  const [budgetFilter, setBudgetFilter] = useState<string>("medium");
  const [recommendedColleges, setRecommendedColleges] = useState<College[]>([]);
  const [relevantExams, setRelevantExams] = useState<EntranceExam[]>([]);
  
  // Parse query parameters to get user budget preference
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const budget = params.get('budget');
    
    // If budget is provided in URL parameters, use it
    if (budget) {
      setBudgetFilter(budget);
    } else {
      // Check localStorage for user preferences
      try {
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        if (preferences.budget) {
          setBudgetFilter(preferences.budget);
        }
      } catch (error) {
        console.error('Error parsing user preferences:', error);
      }
    }
  }, [location]);
  
  // Load recommended colleges and exams when pathway or budget changes
  useEffect(() => {
    if (pathway && pathway.title) {
      // Extract career path from title
      let careerPath = "Arts";
      
      if (pathway.title.includes("Engineering") || pathway.title.includes("Manufacturing")) {
        careerPath = "Engineering";
      } else if (pathway.title.includes("Medical") || pathway.title.includes("Healthcare")) {
        careerPath = "Medical";
      } else if (pathway.title.includes("Law") || pathway.title.includes("Legal")) {
        careerPath = "Law";
      } else if (pathway.title.includes("Business") || pathway.title.includes("Management") || pathway.title.includes("Commerce")) {
        careerPath = "Business";
      }
      
      console.log("Career path:", careerPath, "Budget:", budgetFilter);
      
      // Get filtered colleges
      const colleges = getCollegesByFilters(careerPath, budgetFilter);
      setRecommendedColleges(colleges);
      
      // Get exams for this career path
      const exams = getExamsByCareer(careerPath);
      setRelevantExams(exams);
    }
  }, [pathway, budgetFilter]);
  
  // Get color based on pathway title
  const getPathwayColor = (title: string) => {
    if (title.includes("Engineering")) return {
      bg: "bg-primary-600",
      text: "text-primary-700",
      highlight: "text-primary-600",
      border: "border-primary-200",
      bgLight: "bg-primary-50",
    };
    if (title.includes("Medical")) return {
      bg: "bg-purple-600",
      text: "text-purple-700",
      highlight: "text-purple-600",
      border: "border-purple-200",
      bgLight: "bg-purple-50",
    };
    if (title.includes("Law")) return {
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
  
  const colors = getPathwayColor(pathway.title);
  
  return (
    <div className="space-y-6">
      <Card>
        <div className={`h-2 w-full ${colors.bg}`} />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-lg ${colors.bgLight} ${colors.text}`}>
                {pathway.title.includes("Engineering") ? <Building className="h-8 w-8" /> :
                 pathway.title.includes("Medical") ? <Heart className="h-8 w-8" /> :
                 pathway.title.includes("Law") ? <Scale className="h-8 w-8" /> :
                 <GraduationCap className="h-8 w-8" />}
              </div>
              <div>
                <CardTitle className="text-2xl">{pathway.title}</CardTitle>
                <CardDescription className="text-base mt-1">
                  After {pathway.afterEducationLevel} education
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" asChild className="flex items-center gap-1">
              <Link to="/educational-pathways">
                <ArrowLeft className="h-4 w-4" />
                Back to Pathways
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert mb-6">
            <p>{pathway.description}</p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="mt-6"
          >
            <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-6">
              <TabsTrigger value="overview">
                <GraduationCap className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="exams">
                <BookOpen className="mr-2 h-4 w-4" />
                Entrance Exams
              </TabsTrigger>
              <TabsTrigger value="institutes">
                <Building className="mr-2 h-4 w-4" />
                Institutes
              </TabsTrigger>
              <TabsTrigger value="career">
                <Briefcase className="mr-2 h-4 w-4" />
                Career Prospects
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Key Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between py-1 border-b">
                        <span className="font-medium">Education Required</span>
                        <span>{pathway.afterEducationLevel}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="font-medium">Average Fees</span>
                        <span className="font-semibold">{pathway.averageFees}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="font-medium">Growth Rate</span>
                        <span className={`font-semibold ${
                          pathway.growthRate?.includes("28") ? "text-green-600" : 
                          pathway.growthRate?.includes("20") ? "text-green-500" : 
                          "text-amber-500"
                        }`}>{pathway.growthRate}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Duration</span>
                        <span>{pathway.title.includes("Engineering") ? "4 years" : 
                              pathway.title.includes("Medical") ? "5+ years" : 
                              pathway.title.includes("Law") ? "3-5 years" : "3-4 years"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Eligibility Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="h-5 w-5 mr-2 flex items-center justify-center rounded-full bg-gray-100">
                          <span className="text-xs font-bold">1</span>
                        </div>
                        <div>
                          <p>Completed {pathway.afterEducationLevel} with minimum 50-60% marks (varies by institute)</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-5 w-5 mr-2 flex items-center justify-center rounded-full bg-gray-100">
                          <span className="text-xs font-bold">2</span>
                        </div>
                        <div>
                          <p>Qualify relevant entrance examinations with good rank/percentile</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-5 w-5 mr-2 flex items-center justify-center rounded-full bg-gray-100">
                          <span className="text-xs font-bold">3</span>
                        </div>
                        <div>
                          <p>Some institutes may conduct interviews or group discussions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {pathway.title.includes("Engineering") ? (
                          <>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Mathematics</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Physics</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Problem Solving</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Analytical Thinking</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Computer Skills</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Technical Drawing</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Teamwork</span>
                          </>
                        ) : pathway.title.includes("Medical") ? (
                          <>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Biology</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Chemistry</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Physics</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Communication</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Empathy</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Attention to Detail</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Stress Management</span>
                          </>
                        ) : pathway.title.includes("Law") ? (
                          <>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Reading Comprehension</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Critical Thinking</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Logical Reasoning</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Communication</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Research</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Analysis</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Public Speaking</span>
                          </>
                        ) : (
                          <>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Communication</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Critical Thinking</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Problem Solving</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Adaptability</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Teamwork</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Entrance Exams Tab */}
            <TabsContent value="exams">
              <div className="space-y-6">
                {/* Budget filter for entrance exams */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Entrance Exams by Budget</CardTitle>
                    <CardDescription>
                      View entrance exams based on your budget preference. Current budget: <span className="font-semibold">
                        {budgetFilter === "low" ? "Low (Up to ₹2 lakhs/year)" :
                         budgetFilter === "medium" ? "Medium (₹2-3 lakhs/year)" :
                         budgetFilter === "high" ? "High (₹3-5 lakhs/year)" :
                         "Very High (₹5+ lakhs/year)"}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        variant={budgetFilter === "low" ? "default" : "outline"} 
                        onClick={() => setBudgetFilter("low")}
                        className="flex-1"
                      >
                        Low
                      </Button>
                      <Button 
                        variant={budgetFilter === "medium" ? "default" : "outline"} 
                        onClick={() => setBudgetFilter("medium")}
                        className="flex-1"
                      >
                        Medium
                      </Button>
                      <Button 
                        variant={budgetFilter === "high" ? "default" : "outline"} 
                        onClick={() => setBudgetFilter("high")}
                        className="flex-1"
                      >
                        High
                      </Button>
                      <Button 
                        variant={budgetFilter === "veryhigh" ? "default" : "outline"} 
                        onClick={() => setBudgetFilter("veryhigh")}
                        className="flex-1"
                      >
                        Very High
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Exams required for colleges in this budget */}
                <Card>
                  <CardHeader>
                    <CardTitle>Required Entrance Exams</CardTitle>
                    <CardDescription>
                      Exams required for colleges in your budget range ({budgetFilter})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Get unique exams from the filtered colleges */}
                      {recommendedColleges.length > 0 ? (
                        [...new Set(recommendedColleges.flatMap(college => college.entranceExams))].map((examName, index) => {
                          // Find matching exam details from the relevant exams
                          const exam = relevantExams.find(e => e.name === examName || examName.includes(e.name));
                          
                          return (
                            <div key={index} className={`p-4 border rounded-lg ${colors.border} flex items-start card-hover-effect glass-card-colored animate-pulse-slow`}>
                              <div className={`p-2 rounded-full ${colors.bgLight} ${colors.text} mr-4`}>
                                <BookOpen className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-gradient">{examName}</h4>
                                <p className="text-muted-foreground text-sm mt-1">
                                  {exam ? exam.fullName : "Entrance examination"} for admission to top institutes
                                </p>
                                <div className="flex flex-wrap justify-between mt-2 gap-y-3">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {exam ? exam.examMonth : "Check official website"} annually
                                    </span>
                                  </div>
                                  
                                  {exam && (
                                    <div className="flex items-center ml-8">
                                      <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border-gradient">
                                        {exam.examLevel.charAt(0).toUpperCase() + exam.examLevel.slice(1)} level
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {exam && (
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
                                      <Button size="sm" variant="outline" asChild>
                                        <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer">
                                          Official Website
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No colleges found in your budget range for this pathway.</p>
                          <p className="mt-2">Try selecting a different budget option.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Original exams from pathway */}
                <Card>
                  <CardHeader>
                    <CardTitle>Other Important Exams</CardTitle>
                    <CardDescription>Other exams relevant for this pathway</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {pathway.entranceExams?.map((exam, index) => (
                        <div key={index} className={`p-4 border rounded-lg ${colors.border} flex items-start card-hover-effect glass-card animate-pulse-slow`}>
                          <div className={`p-2 rounded-full ${colors.bgLight} ${colors.text} mr-4`}>
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-gradient-warm">{exam}</h4>
                            <p className="text-muted-foreground text-sm mt-1">
                              National-level entrance examination for admission to top institutes
                            </p>
                            <div className="flex items-center mt-2">
                              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {index % 2 === 0 ? "May-June" : "April-May"} annually
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Institutes Tab */}
            <TabsContent value="institutes">
              <div className="space-y-6">
                {/* Budget filter selector */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Institutions by Budget</CardTitle>
                    <CardDescription>
                      View institutions based on your budget preference. Current budget: <span className="font-semibold">
                        {budgetFilter === "low" ? "Low (Up to ₹2 lakhs/year)" :
                         budgetFilter === "medium" ? "Medium (₹2-3 lakhs/year)" :
                         budgetFilter === "high" ? "High (₹3-5 lakhs/year)" :
                         "Very High (₹5+ lakhs/year)"}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        variant={budgetFilter === "low" ? "default" : "outline"} 
                        onClick={() => setBudgetFilter("low")}
                        className="flex-1"
                      >
                        Low
                      </Button>
                      <Button 
                        variant={budgetFilter === "medium" ? "default" : "outline"} 
                        onClick={() => setBudgetFilter("medium")}
                        className="flex-1"
                      >
                        Medium
                      </Button>
                      <Button 
                        variant={budgetFilter === "high" ? "default" : "outline"} 
                        onClick={() => setBudgetFilter("high")}
                        className="flex-1"
                      >
                        High
                      </Button>
                      <Button 
                        variant={budgetFilter === "veryhigh" ? "default" : "outline"} 
                        onClick={() => setBudgetFilter("veryhigh")}
                        className="flex-1"
                      >
                        Very High
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Budget-based recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Institutions</CardTitle>
                    <CardDescription>
                      Colleges and universities matching your budget ({budgetFilter}) for {pathway.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <p className="text-muted-foreground">No institutions found matching your budget for this pathway.</p>
                        <p className="mt-2">Try selecting a different budget range.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Original institutions from pathway */}
                <Card>
                  <CardHeader>
                    <CardTitle>Other Top Institutions</CardTitle>
                    <CardDescription>Other leading institutions offering this pathway</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pathway.topInstitutes?.map((institute, index) => (
                        <Card key={index} className={`border ${colors.border}`}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{institute}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <div className="flex items-center mr-4">
                                <School className="h-3 w-3 mr-1 opacity-70" />
                                <span>Established {1950 + (index * 5)}</span>
                              </div>
                              <div className="flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1 opacity-70" />
                                <span>Rank #{index + 1} in India</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Career Prospects Tab */}
            <TabsContent value="career">
              <Card>
                <CardHeader>
                  <CardTitle>Career Prospects</CardTitle>
                  <CardDescription>Job opportunities available after this pathway</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Job Prospects</h3>
                      <p className="text-muted-foreground mb-4">{pathway.jobProspects}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center">
                              <DollarSign className={`h-4 w-4 mr-2 ${colors.highlight}`} />
                              <CardTitle className="text-sm">Average Salary</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-2xl font-bold">
                              {pathway.title.includes("Engineering") ? "₹6-12 LPA" : 
                               pathway.title.includes("Medical") ? "₹8-20 LPA" : 
                               pathway.title.includes("Law") ? "₹5-15 LPA" : "₹4-10 LPA"}
                            </div>
                            <p className="text-xs text-muted-foreground">Starting salary range for freshers</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center">
                              <TrendingUp className={`h-4 w-4 mr-2 ${colors.highlight}`} />
                              <CardTitle className="text-sm">Growth Rate</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-2xl font-bold">{pathway.growthRate}</div>
                            <p className="text-xs text-muted-foreground">Annual growth in job opportunities</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center">
                              <Briefcase className={`h-4 w-4 mr-2 ${colors.highlight}`} />
                              <CardTitle className="text-sm">Demand</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-2xl font-bold">
                              {pathway.title.includes("Engineering") ? "Very High" : 
                               pathway.title.includes("Medical") ? "High" : 
                               pathway.title.includes("Law") ? "Moderate" : "Moderate"}
                            </div>
                            <p className="text-xs text-muted-foreground">Current market demand</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Top Employers</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {pathway.title.includes("Engineering") ? (
                          <>
                            <div className="p-4 rounded-lg border text-center">Google</div>
                            <div className="p-4 rounded-lg border text-center">Microsoft</div>
                            <div className="p-4 rounded-lg border text-center">Amazon</div>
                            <div className="p-4 rounded-lg border text-center">Infosys</div>
                          </>
                        ) : pathway.title.includes("Medical") ? (
                          <>
                            <div className="p-4 rounded-lg border text-center">Apollo Hospitals</div>
                            <div className="p-4 rounded-lg border text-center">Max Healthcare</div>
                            <div className="p-4 rounded-lg border text-center">Fortis Healthcare</div>
                            <div className="p-4 rounded-lg border text-center">AIIMS</div>
                          </>
                        ) : pathway.title.includes("Law") ? (
                          <>
                            <div className="p-4 rounded-lg border text-center">Cyril Amarchand</div>
                            <div className="p-4 rounded-lg border text-center">AZB & Partners</div>
                            <div className="p-4 rounded-lg border text-center">Khaitan & Co</div>
                            <div className="p-4 rounded-lg border text-center">Luthra & Luthra</div>
                          </>
                        ) : (
                          <>
                            <div className="p-4 rounded-lg border text-center">ICICI Bank</div>
                            <div className="p-4 rounded-lg border text-center">HDFC Bank</div>
                            <div className="p-4 rounded-lg border text-center">Deloitte</div>
                            <div className="p-4 rounded-lg border text-center">EY</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}