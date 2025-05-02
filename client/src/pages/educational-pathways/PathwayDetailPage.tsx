import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { EducationalPathway } from "@shared/schema";
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
              <Card>
                <CardHeader>
                  <CardTitle>Entrance Examinations</CardTitle>
                  <CardDescription>Important competitive exams for this pathway</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pathway.entranceExams?.map((exam, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${colors.border} flex items-start`}>
                        <div className={`p-2 rounded-full ${colors.bgLight} ${colors.text} mr-4`}>
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{exam}</h4>
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
            </TabsContent>
            
            {/* Institutes Tab */}
            <TabsContent value="institutes">
              <Card>
                <CardHeader>
                  <CardTitle>Top Institutions</CardTitle>
                  <CardDescription>Leading institutions offering this pathway</CardDescription>
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