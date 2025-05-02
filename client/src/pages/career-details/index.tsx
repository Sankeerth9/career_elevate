import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useRoute, Link } from "wouter";
import { trendingCareerFields } from "@/lib/careerData";
import { getEducationalPathways } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { calculateMatchPercentage } from "@/lib/utils";
import { useAuth } from "@/context/authContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  DollarSign,
  MapPin,
  Building,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Award,
  BarChart,
  FileText,
  Lightbulb,
  Share2,
} from "lucide-react";
import { jobListings } from "@/data/jobMarketData";

export default function CareerDetails() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/career/:id");
  const id = params?.id;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get career field data
  const careerField = trendingCareerFields.find((career) => career.id === id);
  
  // Get related jobs
  const relatedJobs = jobListings.filter((job) => {
    if (!careerField) return false;
    return job.title.toLowerCase().includes(careerField.name.toLowerCase()) ||
           careerField.skills.some(skill => 
             job.title.toLowerCase().includes(skill.toLowerCase())
           );
  }).slice(0, 3);

  // Get educational pathways
  const { data: pathways } = useQuery({
    queryKey: ['/api/pathways'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter relevant educational pathways
  const relevantPathways = pathways?.filter(pathway => {
    if (!careerField) return false;
    
    // Match pathways to career field
    if (careerField.name.includes("Engineering")) {
      return pathway.title.includes("Engineering");
    }
    if (careerField.name.includes("Science")) {
      return pathway.title.includes("Science") || pathway.title.includes("Engineering");
    }
    if (careerField.name.includes("Healthcare") || careerField.name.includes("Medical")) {
      return pathway.title.includes("Medical");
    }
    if (careerField.name.includes("Marketing")) {
      return pathway.title.includes("Arts") || pathway.title.includes("Commerce");
    }
    
    return false;
  }).slice(0, 2);

  // Calculate mock match percentage for demo purposes
  const matchPercentage = user ? 
    calculateMatchPercentage(
      { 
        skills: ["analytical", "teamwork", "programming"], 
        interests: ["technology", "science"], 
        educationLevel: "graduation" 
      },
      { 
        skills: careerField?.skills || [], 
        interests: ["technology", "science", "business"], 
        education: ["graduation", "post_graduation"] 
      }
    ) : 
    0;

  if (!careerField) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Career not found</h1>
            <p className="text-muted-foreground mb-6">The career you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/explore-careers">Browse Careers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{careerField.name} Career | {t("appName")}</title>
        <meta name="description" content={`Learn about ${careerField.name} career path, skills requirements, education, and job prospects`} />
      </Helmet>

      <div className="bg-primary-700 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {careerField.name}
              </h1>
              <p className="mt-3 text-xl text-primary-200 max-w-3xl">
                {careerField.description}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge className="text-lg py-2 px-4 bg-green-600 font-bold">
                {careerField.growthRate} Growth
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="w-full max-w-md mb-6">
                <TabsTrigger value="overview">
                  <FileText className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="education">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="jobs">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Jobs
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>About {careerField.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Description</h3>
                        <p className="mt-2">
                          {careerField.description} Professionals in this field apply specialized knowledge to solve complex problems, develop innovative solutions, and drive progress in various industries including technology, healthcare, finance, and more.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center">
                            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                            <h4 className="font-medium">Average Salary</h4>
                          </div>
                          <p className="mt-2 text-2xl font-bold">{careerField.averageSalary}</p>
                          <p className="text-sm text-muted-foreground">Annual in India</p>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                            <h4 className="font-medium">Job Growth</h4>
                          </div>
                          <p className="mt-2 text-2xl font-bold">{careerField.growthRate}</p>
                          <p className="text-sm text-muted-foreground">Over next 5 years</p>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                            <h4 className="font-medium">Job Openings</h4>
                          </div>
                          <p className="mt-2 text-2xl font-bold">{careerField.jobOpenings}</p>
                          <p className="text-sm text-muted-foreground">Current vacancies</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium">Work Environment</h3>
                        <p className="mt-2">
                          {careerField.name} professionals typically work in office environments, research facilities, or remotely. The work may involve collaboration with cross-functional teams, independent research, and regular interaction with stakeholders. Many positions offer flexible work arrangements, particularly in technology-focused roles.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium">Career Progression</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">1</span>
                            <span>Entry Level (0-2 years)</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">2</span>
                            <span>Mid-Level (2-5 years)</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">3</span>
                            <span>Senior Level (5-10 years)</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">4</span>
                            <span>Management/Leadership (10+ years)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education">
                <Card>
                  <CardHeader>
                    <CardTitle>Educational Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Required Education</h3>
                        <ul className="mt-2 space-y-2">
                          {careerField.educationRequired.map((education, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span>{education}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium">Recommended Educational Pathways</h3>
                        <div className="mt-4 space-y-4">
                          {relevantPathways && relevantPathways.length > 0 ? (
                            relevantPathways.map((pathway) => (
                              <Card key={pathway.id} className="bg-muted/20">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg">{pathway.title}</CardTitle>
                                  <CardDescription>{pathway.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Entrance Exams:</span>
                                      <span className="text-sm font-medium">{pathway.entranceExams?.join(", ")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Top Institutes:</span>
                                      <span className="text-sm font-medium">{pathway.topInstitutes?.join(", ")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Average Fees:</span>
                                      <span className="text-sm font-medium">{pathway.averageFees}</span>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter>
                                  <Button variant="outline" asChild className="w-full">
                                    <Link to={`/educational-pathways/${pathway.id}`}>
                                      View Details
                                    </Link>
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))
                          ) : (
                            <div className="text-center py-6">
                              <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                              <p>Relevant pathways loading or not available.</p>
                              <Button className="mt-4" asChild>
                                <Link to="/educational-pathways">
                                  Browse All Pathways
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium">Certifications & Continuing Education</h3>
                        <p className="mt-2 text-muted-foreground">
                          Professional certifications can significantly enhance career prospects and earning potential.
                        </p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center">
                              <Award className="h-5 w-5 text-primary mr-2" />
                              <h4 className="font-medium">Industry Certifications</h4>
                            </div>
                            <ul className="mt-2 space-y-1 text-sm">
                              {careerField.name.includes("Data") && (
                                <>
                                  <li>• Microsoft Certified: Data Analyst Associate</li>
                                  <li>• IBM Data Science Professional Certificate</li>
                                  <li>• Google Data Analytics Professional Certificate</li>
                                </>
                              )}
                              {careerField.name.includes("AI") && (
                                <>
                                  <li>• Google TensorFlow Developer Certificate</li>
                                  <li>• AWS Certified Machine Learning</li>
                                  <li>• IBM AI Engineering Professional Certificate</li>
                                </>
                              )}
                              {careerField.name.includes("Healthcare") && (
                                <>
                                  <li>• Healthcare Information Management Certification</li>
                                  <li>• Medical Coding Certification</li>
                                  <li>• Healthcare Analytics Certificate</li>
                                </>
                              )}
                              {careerField.name.includes("Marketing") && (
                                <>
                                  <li>• Google Digital Marketing Certification</li>
                                  <li>• Facebook Blueprint Certification</li>
                                  <li>• HubSpot Content Marketing Certification</li>
                                </>
                              )}
                            </ul>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center">
                              <BookOpen className="h-5 w-5 text-primary mr-2" />
                              <h4 className="font-medium">Online Learning Platforms</h4>
                            </div>
                            <ul className="mt-2 space-y-1 text-sm">
                              <li>• Coursera - www.coursera.org</li>
                              <li>• edX - www.edx.org</li>
                              <li>• Udemy - www.udemy.com</li>
                              <li>• LinkedIn Learning - www.linkedin.com/learning</li>
                              <li>• Swayam - swayam.gov.in</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                    <CardDescription>
                      Key skills and competencies for success in {careerField.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Technical Skills</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {careerField.skills.map((skill, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium">{skill}</span>
                                <span className="text-sm text-muted-foreground">
                                  {index % 3 === 0 ? "Advanced" : index % 3 === 1 ? "Intermediate" : "Essential"}
                                </span>
                              </div>
                              <Progress value={index % 3 === 0 ? 90 : index % 3 === 1 ? 75 : 60} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium">Soft Skills</h3>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            "Communication", 
                            "Problem Solving", 
                            "Critical Thinking",
                            "Teamwork", 
                            "Time Management", 
                            "Adaptability"
                          ].map((skill, index) => (
                            <div key={index} className="border rounded-lg p-4 flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              <span>{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium">Skill Development Resources</h3>
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-muted/10">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Online Courses</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex justify-between">
                                    <span>• Coursera Specializations</span>
                                    <Badge variant="outline">Free/Paid</Badge>
                                  </li>
                                  <li className="flex justify-between">
                                    <span>• Udemy Professional Courses</span>
                                    <Badge variant="outline">Paid</Badge>
                                  </li>
                                  <li className="flex justify-between">
                                    <span>• edX MicroMasters</span>
                                    <Badge variant="outline">Free/Paid</Badge>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-muted/10">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Skill Practice</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex justify-between">
                                    <span>• GitHub Projects</span>
                                    <Badge variant="outline">Free</Badge>
                                  </li>
                                  <li className="flex justify-between">
                                    <span>• Kaggle Competitions</span>
                                    <Badge variant="outline">Free</Badge>
                                  </li>
                                  <li className="flex justify-between">
                                    <span>• HackerRank Challenges</span>
                                    <Badge variant="outline">Free</Badge>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Jobs Tab */}
              <TabsContent value="jobs">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Opportunities</CardTitle>
                    <CardDescription>
                      Current openings and career opportunities in {careerField.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Related Job Roles</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {(() => {
                            let roles = [];
                            if (careerField.name.includes("Data")) {
                              roles = ["Data Analyst", "Data Scientist", "Data Engineer", "Business Intelligence Analyst", "Database Administrator", "Data Architect"];
                            } else if (careerField.name.includes("AI")) {
                              roles = ["Machine Learning Engineer", "AI Researcher", "NLP Specialist", "Computer Vision Engineer", "AI Solutions Architect", "Deep Learning Engineer"];
                            } else if (careerField.name.includes("Healthcare")) {
                              roles = ["Medical Technologist", "Healthcare Analyst", "Clinical Researcher", "Biomedical Engineer", "Health Informatics Specialist", "Medical Scientist"];
                            } else if (careerField.name.includes("Marketing")) {
                              roles = ["Digital Marketing Specialist", "SEO Analyst", "Social Media Manager", "Content Strategist", "Marketing Analyst", "Campaign Manager"];
                            } else {
                              roles = ["Industry Specialist", "Research Analyst", "Technical Consultant", "Product Developer", "Project Manager", "Team Lead"];
                            }
                            
                            return roles.map((role, index) => (
                              <div key={index} className="border rounded-lg p-3">
                                <div className="flex items-center">
                                  <Briefcase className="h-4 w-4 text-primary mr-2" />
                                  <span>{role}</span>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium">Current Job Listings</h3>
                        {relatedJobs.length > 0 ? (
                          <div className="mt-4 space-y-4">
                            {relatedJobs.map((job) => (
                              <div key={job.id} className="border rounded-lg p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <h4 className="font-medium text-primary-600">{job.title}</h4>
                                    <div className="flex items-center mt-1">
                                      <Building className="h-4 w-4 text-muted-foreground mr-1" />
                                      <span className="text-sm text-muted-foreground">{job.company}</span>
                                    </div>
                                  </div>
                                  <div className="flex mt-2 md:mt-0 gap-x-2">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                      {job.jobType}
                                    </Badge>
                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                      {job.workMode}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                                    <span className="text-sm">{job.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                                    <span className="text-sm">{job.salary}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 flex justify-end">
                                  <Button asChild>
                                    <Link to={`/job-listings/${job.id}`}>
                                      View Job
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 mt-4 border rounded-lg">
                            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <p>No matching job listings available at the moment.</p>
                          </div>
                        )}
                        
                        <div className="mt-6 text-center">
                          <Button asChild variant="outline">
                            <Link to="/job-listings">
                              View All Job Listings
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {user && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Career Match</CardTitle>
                  <CardDescription>
                    How well this career matches your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{matchPercentage}% Match</span>
                    <span className={
                      matchPercentage >= 70 ? "text-green-600" : 
                      matchPercentage >= 50 ? "text-amber-600" : 
                      "text-red-600"
                    }>
                      {matchPercentage >= 70 ? "High" : 
                       matchPercentage >= 50 ? "Medium" : 
                       "Low"} Match
                    </span>
                  </div>
                  <Progress 
                    value={matchPercentage} 
                    className={
                      matchPercentage >= 70 ? "bg-green-100" : 
                      matchPercentage >= 50 ? "bg-amber-100" : 
                      "bg-red-100"
                    }
                  />
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Matching Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {careerField.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Skills to Develop</h4>
                    <div className="flex flex-wrap gap-1">
                      {careerField.skills.slice(3).map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to="/ai-recommendations">
                      Take Full Assessment
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Market Demand</CardTitle>
                <CardDescription>
                  Industry demand for {careerField.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Industry Growth</span>
                      <span className="text-sm font-medium text-green-600">{careerField.growthRate}</span>
                    </div>
                    <Progress value={parseInt(careerField.growthRate.replace('%', '').replace('+', ''))} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Job Openings</span>
                      <span className="text-sm font-medium">{careerField.jobOpenings}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Remote Work Availability</span>
                      <span className="text-sm font-medium">
                        {careerField.name.includes("Data") || careerField.name.includes("AI") ? "High" : 
                         careerField.name.includes("Marketing") ? "Very High" : "Medium"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Top Hiring Regions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm">Bangalore</span>
                        </div>
                        <Progress value={90} className="w-24" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm">Hyderabad</span>
                        </div>
                        <Progress value={75} className="w-24" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm">Mumbai</span>
                        </div>
                        <Progress value={65} className="w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Resources</CardTitle>
                <CardDescription>
                  Helpful resources to learn more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a 
                    href="#" 
                    className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">Complete Learning Guide</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Comprehensive guide to mastering {careerField.name}
                    </p>
                  </a>
                  
                  <a 
                    href="#" 
                    className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">Salary Reports</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Detailed salary data across experience levels
                    </p>
                  </a>
                  
                  <a 
                    href="#" 
                    className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">Top Employers</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Companies actively hiring in this field
                    </p>
                  </a>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/educational-pathways">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Educational Pathways
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share This Career
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
