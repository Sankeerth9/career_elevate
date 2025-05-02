import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { educationLevels, careerAims, states, budgetRanges } from "@shared/schema";
import EducationBasedRecommendations from "./EducationBasedRecommendations";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Brain,
  ChevronRight,
  Briefcase,
  GraduationCap,
  TrendingUp,
  DollarSign,
  CheckCircle,
  PieChart,
  Star,
  Lightbulb,
  Award,
  Rocket,
  MapPin,
  Clock,
  AlertCircle,
  FileText,
  Building,
} from "lucide-react";

// Define form schema
const formSchema = z.object({
  educationLevel: z.string().min(1, { message: "Please select your education level" }),
  careerAim: z.string().min(1, { message: "Please select your career aim" }),
  state: z.string().min(1, { message: "Please select your state" }),
  budget: z.string().min(1, { message: "Please select your budget range" }),
  preferredDistance: z.string().optional(),
  interests: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  willingToRelocate: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AIRecommendations() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);

  // Define interests and skills options
  const interestOptions = [
    { id: "technology", label: "Technology" },
    { id: "science", label: "Science" },
    { id: "mathematics", label: "Mathematics" },
    { id: "art", label: "Art & Design" },
    { id: "literature", label: "Literature" },
    { id: "business", label: "Business" },
    { id: "healthcare", label: "Healthcare" },
    { id: "sports", label: "Sports" },
    { id: "music", label: "Music" },
  ];

  const skillOptions = [
    { id: "problem-solving", label: "Problem Solving" },
    { id: "creativity", label: "Creativity" },
    { id: "analytical", label: "Analytical Thinking" },
    { id: "teamwork", label: "Teamwork" },
    { id: "communication", label: "Communication" },
    { id: "coding", label: "Coding" },
    { id: "design", label: "Design" },
    { id: "writing", label: "Writing" },
    { id: "leadership", label: "Leadership" },
    { id: "organization", label: "Organization" },
  ];

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationLevel: "",
      careerAim: "",
      state: "",
      budget: "",
      preferredDistance: "any",
      interests: [],
      skills: [],
      willingToRelocate: false,
    },
  });

  // Submit handler
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const response = await apiRequest(
        "POST",
        "/api/test-ai-recommendation",
        data
      );
      
      const responseData = await response.json();
      
      if (responseData && responseData.recommendations) {
        setRecommendations(responseData.recommendations);
        setAssessment(responseData.assessment);
        toast({
          title: "AI Recommendations Generated",
          description: "Based on your profile, we've found career pathways that match your interests and skills.",
        });
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to generate career recommendations. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Career Recommendations | {t("appName")}</title>
        <meta
          name="description"
          content="Get personalized AI-powered career recommendations based on your profile"
        />
      </Helmet>

      <div className="bg-primary-700 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary-200" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              AI Career Recommendations
            </h1>
          </div>
          <p className="mt-3 text-xl text-primary-200 max-w-3xl">
            Our AI-powered system analyzes your profile, skills, and preferences to suggest ideal career pathways tailored 
            specifically for you. Get personalized guidance for your future.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Your Profile Information
                </CardTitle>
                <CardDescription>
                  Complete the form below to get personalized AI recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="educationLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your education level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {educationLevels.map((level) => (
                                <SelectItem key={level} value={level || "default_value"}>
                                  {t(`educationLevels.${level}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="careerAim"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Career Aim</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your career aim" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {careerAims.map((aim) => (
                                <SelectItem key={aim} value={aim || "default_value"}>
                                  {t(`careerAims.${aim}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state} value={state || "default_value"}>
                                  {t(`states.${state}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Range</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {budgetRanges.map((range) => (
                                <SelectItem key={range} value={range || "default_value"}>
                                  {t(`budgetRanges.${range}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interests"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Interests</FormLabel>
                            <FormDescription>
                              Select areas that interest you
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {interestOptions.map((interest) => (
                              <FormField
                                key={interest.id}
                                control={form.control}
                                name="interests"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={interest.id}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(interest.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], interest.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== interest.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {interest.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="skills"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Skills</FormLabel>
                            <FormDescription>
                              Select skills you possess
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {skillOptions.map((skill) => (
                              <FormField
                                key={skill.id}
                                control={form.control}
                                name="skills"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={skill.id}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(skill.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], skill.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== skill.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {skill.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="willingToRelocate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Willing to Relocate</FormLabel>
                            <FormDescription>
                              Are you open to relocating for education or career?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Generating Recommendations..." : "Get AI Recommendations"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2">
            {recommendations.length > 0 ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Rocket className="mr-2 h-5 w-5 text-primary" />
                      AI-Powered Career Recommendations
                    </CardTitle>
                    <CardDescription>
                      Based on your profile, we've identified these career pathways as excellent matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {recommendations.map((recommendation, index) => (
                      <Card key={index} className={`bg-muted/20 ${index === 0 ? 'border-primary-600 shadow-md' : ''}`}>
                        <CardHeader className="pb-2">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <CardTitle className="text-xl flex items-center">
                                Pathway #{recommendation.pathwayId}
                                {index === 0 && (
                                  <Badge className="ml-2 bg-primary text-primary-foreground">
                                    Top Match
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {recommendation.reason}
                              </CardDescription>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center">
                              <Progress
                                value={recommendation.score}
                                className="h-2 w-24 md:w-32"
                              />
                              <span className="ml-2 text-sm font-medium">
                                {recommendation.score}% Match
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium flex items-center mb-2">
                                <Briefcase className="mr-2 h-4 w-4 text-primary-600" />
                                Career Options
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {recommendation.careerOptions.map((career: string, idx: number) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="bg-primary-50 text-primary-700"
                                  >
                                    {career}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="text-sm font-medium flex items-center">
                                  <DollarSign className="mr-1 h-4 w-4 text-green-600" />
                                  Estimated Salary
                                </h4>
                                <p className="text-sm">{recommendation.estimatedSalary}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium flex items-center">
                                  <TrendingUp className="mr-1 h-4 w-4 text-blue-600" />
                                  Growth Potential
                                </h4>
                                <p className="text-sm">{recommendation.growthPotential}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium flex items-center">
                                  <Clock className="mr-1 h-4 w-4 text-orange-600" />
                                  Time to Employment
                                </h4>
                                <p className="text-sm">{recommendation.timeToEmployment || "2-4 years"}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium flex items-center mb-2">
                                <GraduationCap className="mr-2 h-4 w-4 text-primary-600" />
                                Suggested Courses
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {recommendation.suggestedCourses.map((course: string, idx: number) => (
                                  <Badge key={idx} variant="outline">
                                    {course}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {recommendation.entranceExams && (
                              <div>
                                <h4 className="text-sm font-medium flex items-center mb-2">
                                  <FileText className="mr-2 h-4 w-4 text-purple-600" />
                                  Required Entrance Exams
                                </h4>
                                <p className="text-sm bg-purple-50 p-2 rounded-md">
                                  {recommendation.entranceExams}
                                </p>
                              </div>
                            )}

                            {recommendation.recommendedColleges && (
                              <div>
                                <h4 className="text-sm font-medium flex items-center mb-2">
                                  <Building className="mr-2 h-4 w-4 text-blue-600" />
                                  College Recommendations
                                  {recommendation.budgetCategory && (
                                    <Badge className="ml-2" variant="outline">
                                      {recommendation.budgetCategory === "low" ? "Budget Friendly" : 
                                       recommendation.budgetCategory === "medium" ? "Moderate Cost" : 
                                       "Premium Options"}
                                    </Badge>
                                  )}
                                </h4>
                                <p className="text-sm bg-blue-50 p-2 rounded-md">
                                  {recommendation.recommendedColleges}
                                </p>
                              </div>
                            )}

                            {recommendation.strengthsMatchScore && typeof recommendation.strengthsMatchScore === 'number' && (
                              <div>
                                <h4 className="text-sm font-medium flex items-center mb-1">
                                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                  Strengths Match
                                </h4>
                                <div className="flex items-center">
                                  <Progress
                                    value={recommendation.strengthsMatchScore}
                                    className="h-2 w-full max-w-md"
                                  />
                                  <span className="ml-2 text-sm">
                                    {recommendation.strengthsMatchScore}%
                                  </span>
                                </div>
                              </div>
                            )}

                            {recommendation.regionalDemand && Array.isArray(recommendation.regionalDemand) && (
                              <div>
                                <h4 className="text-sm font-medium flex items-center mb-2">
                                  <MapPin className="mr-2 h-4 w-4 text-red-500" />
                                  Regional Demand
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {recommendation.regionalDemand.map((region: {region: string, demandLevel: string, notes: string}, idx: number) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-sm border rounded px-2 py-1"
                                    >
                                      <span>{region.region}</span>
                                      <Badge
                                        variant="outline"
                                        className={
                                          region.demandLevel === "high"
                                            ? "bg-green-50 text-green-700"
                                            : region.demandLevel === "medium"
                                            ? "bg-yellow-50 text-yellow-700"
                                            : "bg-red-50 text-red-700"
                                        }
                                      >
                                        {region.demandLevel.charAt(0).toUpperCase() + region.demandLevel.slice(1)}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" asChild>
                            <a href={`/educational-pathways/${recommendation.pathwayId}`}>
                              View Pathway Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* Additional guidance section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                      Personalized Guidance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        Based on your profile as someone interested in {assessment?.careerAim || "your selected field"} 
                        with skills in {assessment?.skills?.join(", ") || "the areas you selected"}, here are some 
                        key steps you can take to progress toward your career goals:
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex">
                          <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">1</div>
                          <div>
                            <h4 className="font-medium">Prepare for entrance exams</h4>
                            <p className="text-sm text-muted-foreground">Focus on standardized tests required for your chosen educational pathway</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">2</div>
                          <div>
                            <h4 className="font-medium">Research scholarship opportunities</h4>
                            <p className="text-sm text-muted-foreground">Given your budget range, explore financial aid options</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">3</div>
                          <div>
                            <h4 className="font-medium">Develop key skills</h4>
                            <p className="text-sm text-muted-foreground">Build proficiency in the core competencies needed for your target careers</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">4</div>
                          <div>
                            <h4 className="font-medium">Connect with professionals</h4>
                            <p className="text-sm text-muted-foreground">Network with people already in your desired field</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="flex flex-col justify-center items-center py-12 px-4 text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">AI Recommendations</h2>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Fill out your profile information to get personalized AI-powered career recommendations
                    tailored to your skills, interests, and goals.
                  </p>
                  <div className="flex flex-col items-center space-y-4 max-w-md">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div className="text-left">
                        <p className="font-medium">Career Pathway Matching</p>
                        <p className="text-sm text-muted-foreground">Our AI analyzes your profile to identify the best career paths</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div className="text-left">
                        <p className="font-medium">Educational Guidance</p>
                        <p className="text-sm text-muted-foreground">Get recommendations for courses and institutions</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div className="text-left">
                        <p className="font-medium">Regional Job Market Insights</p>
                        <p className="text-sm text-muted-foreground">Understand demand for your skills in different regions</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Education-based career recommendations */}
                <EducationBasedRecommendations />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}