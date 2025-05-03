import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { educationLevels, careerAims, states, budgetRanges } from "@shared/schema";
import PathwayExamDetails from "./PathwayExamDetails";
import { useLocation } from "wouter";

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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  MapPin,
  FileText,
  Building,
  BookOpen
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
  const [_, setLocation] = useLocation();
  const [selectedPathway, setSelectedPathway] = useState<{
    id: number;
    title: string;
  } | null>(null);

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

  // Add a useEffect to show message
  useEffect(() => {
    setTimeout(() => {
      toast({
        title: "Recommendation System Improved",
        description: "We've enhanced our system to directly show educational pathways and entrance exams based on your preferences.",
      });
    }, 500);
  }, [toast]);

  // Function to generate recommendations based on education level and career aim
  const getEducationBasedRecommendations = async (educationLevel: string, careerAim: string = "") => {
    // Base recommendations by career aim
    const recommendationsByCareerAim: {[key: string]: any[]} = {
      "engineering": [
        {
          pathwayId: 1,
          pathwayTitle: "Engineering & Manufacturing",
          score: 95,
          reason: "Perfect match for your selected career aim",
          careerOptions: ["Software Engineer", "Mechanical Engineer", "Civil Engineer"],
          estimatedSalary: "₹6-12 LPA",
          growthPotential: "28% growth over 5 years",
          suggestedCourses: ["B.Tech", "B.E."],
          entranceExams: "JEE Main, JEE Advanced, BITSAT"
        },
        {
          pathwayId: 5,
          pathwayTitle: "Computer Science & IT",
          score: 88,
          reason: "Strong alignment with engineering interests",
          careerOptions: ["Software Developer", "Data Scientist", "Systems Architect"],
          estimatedSalary: "₹8-15 LPA",
          growthPotential: "30% growth over 5 years",
          suggestedCourses: ["B.Tech in CS", "BCA", "B.Sc in IT"],
          entranceExams: "JEE Main, COMEDK, BITSAT"
        },
        {
          pathwayId: 7,
          pathwayTitle: "Electronics & Communication",
          score: 82,
          reason: "Related technical field with strong job prospects",
          careerOptions: ["Electronics Engineer", "VLSI Designer", "Network Engineer"],
          estimatedSalary: "₹5-11 LPA",
          growthPotential: "22% growth over 5 years",
          suggestedCourses: ["B.Tech in ECE", "Diploma in Electronics"],
          entranceExams: "JEE Main, COMEDK, KCET"
        }
      ],
      "medical": [
        {
          pathwayId: 2,
          pathwayTitle: "Medical & Healthcare",
          score: 95,
          reason: "Perfect match for your selected career aim",
          careerOptions: ["Doctor", "Dentist", "Pharmacist"],
          estimatedSalary: "₹8-15 LPA",
          growthPotential: "22% growth over 5 years",
          suggestedCourses: ["MBBS", "BDS", "B.Pharm"],
          entranceExams: "NEET, AIIMS"
        },
        {
          pathwayId: 8,
          pathwayTitle: "Allied Health Sciences",
          score: 88,
          reason: "Related healthcare field with good opportunities",
          careerOptions: ["Physiotherapist", "Radiologist", "Medical Lab Technician"],
          estimatedSalary: "₹4-8 LPA",
          growthPotential: "25% growth over 5 years",
          suggestedCourses: ["BPT", "B.Sc in MLT", "B.Sc in Radiology"],
          entranceExams: "NEET, AIIMS, JIPMER"
        },
        {
          pathwayId: 9,
          pathwayTitle: "Nursing & Patient Care",
          score: 82,
          reason: "Growing healthcare sector with increasing demand",
          careerOptions: ["Registered Nurse", "Nursing Supervisor", "Healthcare Administrator"],
          estimatedSalary: "₹3.5-9 LPA",
          growthPotential: "20% growth over 5 years",
          suggestedCourses: ["B.Sc Nursing", "GNM"],
          entranceExams: "Nursing Entrance Tests, NEET"
        }
      ],
      "law": [
        {
          pathwayId: 3,
          pathwayTitle: "Law & Legal Studies",
          score: 95,
          reason: "Perfect match for your selected career aim",
          careerOptions: ["Advocate", "Corporate Lawyer", "Legal Consultant"],
          estimatedSalary: "₹5-15 LPA",
          growthPotential: "18% growth over 5 years",
          suggestedCourses: ["LLB", "BA-LLB", "BBA-LLB"],
          entranceExams: "CLAT, AILET, LSAT"
        },
        {
          pathwayId: 10,
          pathwayTitle: "Corporate Governance",
          score: 87,
          reason: "Related field with legal connections",
          careerOptions: ["Company Secretary", "Compliance Officer", "Legal Manager"],
          estimatedSalary: "₹6-12 LPA",
          growthPotential: "20% growth over 5 years",
          suggestedCourses: ["CS", "LLB with Corporate Law"],
          entranceExams: "CS Foundation, CLAT"
        },
        {
          pathwayId: 11,
          pathwayTitle: "International Relations",
          score: 80,
          reason: "Combines legal knowledge with diplomatic skills",
          careerOptions: ["Diplomat", "Foreign Policy Advisor", "International Law Specialist"],
          estimatedSalary: "₹7-18 LPA",
          growthPotential: "15% growth over 5 years",
          suggestedCourses: ["BA in International Relations", "LLB with International Law"],
          entranceExams: "University-specific entrance exams"
        }
      ],
      "commerce": [
        {
          pathwayId: 4,
          pathwayTitle: "Business & Management",
          score: 95,
          reason: "Perfect match for your selected career aim",
          careerOptions: ["Business Analyst", "Marketing Manager", "HR Manager"],
          estimatedSalary: "₹5-10 LPA",
          growthPotential: "20% growth over 5 years",
          suggestedCourses: ["BBA", "B.Com", "MBA"],
          entranceExams: "CAT, XAT, MAT"
        },
        {
          pathwayId: 12,
          pathwayTitle: "Finance & Accounting",
          score: 88,
          reason: "Strong alignment with commerce background",
          careerOptions: ["Chartered Accountant", "Financial Analyst", "Investment Banker"],
          estimatedSalary: "₹7-15 LPA",
          growthPotential: "22% growth over 5 years",
          suggestedCourses: ["B.Com", "BBA in Finance", "CA"],
          entranceExams: "CA Foundation, CMA Foundation"
        },
        {
          pathwayId: 13,
          pathwayTitle: "Digital Marketing",
          score: 82,
          reason: "Fast-growing field with business applications",
          careerOptions: ["Digital Marketing Manager", "SEO Specialist", "Social Media Strategist"],
          estimatedSalary: "₹4-12 LPA",
          growthPotential: "35% growth over 5 years",
          suggestedCourses: ["BBA in Digital Marketing", "B.Com with Digital Marketing"],
          entranceExams: "University-specific entrance exams"
        }
      ],
      "civilservice": [
        {
          pathwayId: 14,
          pathwayTitle: "Civil Services",
          score: 95,
          reason: "Perfect match for your selected career aim",
          careerOptions: ["IAS Officer", "IPS Officer", "IRS Officer"],
          estimatedSalary: "₹6-15 LPA + benefits",
          growthPotential: "Structured career progression",
          suggestedCourses: ["Any Bachelor's degree", "Public Administration courses"],
          entranceExams: "UPSC Civil Services, State PSC"
        },
        {
          pathwayId: 15,
          pathwayTitle: "Public Policy & Administration",
          score: 88,
          reason: "Related field with government connections",
          careerOptions: ["Policy Analyst", "Public Administrator", "Government Consultant"],
          estimatedSalary: "₹5-12 LPA",
          growthPotential: "15% growth over 5 years",
          suggestedCourses: ["Public Administration", "Political Science", "Economics"],
          entranceExams: "University-specific entrance exams"
        },
        {
          pathwayId: 16,
          pathwayTitle: "Defense & Armed Forces",
          score: 82,
          reason: "Service-oriented career with stability",
          careerOptions: ["Army Officer", "Navy Officer", "Air Force Officer"],
          estimatedSalary: "₹6-15 LPA + benefits",
          growthPotential: "Structured career progression",
          suggestedCourses: ["NDA", "Technical Entry Schemes"],
          entranceExams: "NDA, CDS, AFCAT"
        }
      ],
      "arts": [
        {
          pathwayId: 17,
          pathwayTitle: "Design & Creative Arts",
          score: 95,
          reason: "Perfect match for your selected career aim",
          careerOptions: ["Graphic Designer", "UX/UI Designer", "Fashion Designer"],
          estimatedSalary: "₹4-12 LPA",
          growthPotential: "25% growth over 5 years",
          suggestedCourses: ["B.Des", "BFA", "Animation courses"],
          entranceExams: "UCEED, NIFT, NID"
        },
        {
          pathwayId: 18,
          pathwayTitle: "Media & Communication",
          score: 88,
          reason: "Related creative field with good opportunities",
          careerOptions: ["Journalist", "Content Creator", "Public Relations Specialist"],
          estimatedSalary: "₹3.5-10 LPA",
          growthPotential: "18% growth over 5 years",
          suggestedCourses: ["BMM", "BA in Journalism", "Mass Communication"],
          entranceExams: "IIMC, XIC, ACJ"
        },
        {
          pathwayId: 19,
          pathwayTitle: "Performing Arts",
          score: 82,
          reason: "Creative expression with growing industry demand",
          careerOptions: ["Actor", "Dancer", "Music Producer"],
          estimatedSalary: "Variable (₹3-20+ LPA)",
          growthPotential: "Project-dependent growth",
          suggestedCourses: ["BPA", "Music courses", "Theater programs"],
          entranceExams: "Institution-specific auditions and entrance tests"
        }
      ],
      "esports": [
        {
          pathwayId: 20,
          pathwayTitle: "Gaming & Esports",
          score: 95,
          reason: "Perfect match for your selected career aim",
          careerOptions: ["Professional Gamer", "Game Developer", "Esports Manager"],
          estimatedSalary: "₹3-15 LPA",
          growthPotential: "40% growth over 5 years",
          suggestedCourses: ["Game Design", "Computer Science", "Animation"],
          entranceExams: "Institution-specific entrance tests"
        },
        {
          pathwayId: 21,
          pathwayTitle: "Digital Content Creation",
          score: 88,
          reason: "Complementary to gaming industry",
          careerOptions: ["Gaming Streamer", "Content Creator", "YouTuber"],
          estimatedSalary: "Variable (₹2-20+ LPA)",
          growthPotential: "Platform and audience dependent",
          suggestedCourses: ["Digital Media", "Video Production", "Communication"],
          entranceExams: "Institution-specific entrance tests"
        },
        {
          pathwayId: 22,
          pathwayTitle: "Technology & Animation",
          score: 82,
          reason: "Technical aspects of gaming industry",
          careerOptions: ["3D Animator", "Game Artist", "Technical Artist"],
          estimatedSalary: "₹4-14 LPA",
          growthPotential: "28% growth over 5 years",
          suggestedCourses: ["Animation", "3D Modeling", "Computer Graphics"],
          entranceExams: "NID, MAAC, Arena"
        }
      ]
    };
    
    // Default recommendations if career aim not specified or not found
    const defaultRecommendations = [
      {
        pathwayId: 1,
        pathwayTitle: "Engineering & Manufacturing",
        score: 85,
        reason: "Based on your education level and interests",
        careerOptions: ["Software Engineer", "Mechanical Engineer", "Civil Engineer"],
        estimatedSalary: "₹6-12 LPA",
        growthPotential: "28% growth over 5 years",
        suggestedCourses: ["B.Tech", "B.E."],
        entranceExams: "JEE Main, JEE Advanced, BITSAT"
      },
      {
        pathwayId: 2,
        pathwayTitle: "Medical & Healthcare",
        score: 78,
        reason: "Matches your profile strengths",
        careerOptions: ["Doctor", "Dentist", "Pharmacist"],
        estimatedSalary: "₹8-15 LPA",
        growthPotential: "22% growth over 5 years",
        suggestedCourses: ["MBBS", "BDS", "B.Pharm"],
        entranceExams: "NEET, AIIMS"
      },
      {
        pathwayId: 3,
        pathwayTitle: "Law & Legal Studies",
        score: 72,
        reason: "Aligns with analytical skills",
        careerOptions: ["Advocate", "Corporate Lawyer", "Legal Consultant"],
        estimatedSalary: "₹5-15 LPA",
        growthPotential: "18% growth over 5 years",
        suggestedCourses: ["LLB", "BA-LLB", "BBA-LLB"],
        entranceExams: "CLAT, AILET, LSAT"
      },
      {
        pathwayId: 4,
        pathwayTitle: "Business & Management",
        score: 70,
        reason: "Versatile career options",
        careerOptions: ["Business Analyst", "Marketing Manager", "HR Manager"],
        estimatedSalary: "₹5-10 LPA",
        growthPotential: "20% growth over 5 years",
        suggestedCourses: ["BBA", "B.Com", "MBA"],
        entranceExams: "CAT, XAT, MAT"
      }
    ];
    
    // Return appropriate recommendations based on career aim
    const normalizedCareerAim = careerAim.toLowerCase();
    if (normalizedCareerAim && recommendationsByCareerAim[normalizedCareerAim]) {
      return recommendationsByCareerAim[normalizedCareerAim];
    }
    
    return defaultRecommendations;
  };

  // Submit handler - gets AI recommendations
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Call the API to get recommendations
      const response = await apiRequest(
        "POST",
        "/api/test-ai-recommendation",
        data
      );
      
      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }
      
      const result = await response.json();
      setRecommendations(result.recommendations || []);
      setAssessment(data);
      
      toast({
        title: "Recommendations Ready",
        description: "We've analyzed your profile and found matching career pathways.",
      });
      
      // Store form data for future reference
      localStorage.setItem('userPreferences', JSON.stringify({
        educationLevel: data.educationLevel,
        budget: data.budget,
        careerAim: data.careerAim,
        state: data.state
      }));
      
    } catch (error) {
      console.error("Error:", error);
      
      // If API call fails, use education-based recommendations as a fallback
      const fallbackRecommendations = await getEducationBasedRecommendations(data.educationLevel, data.careerAim);
      setRecommendations(fallbackRecommendations);
      setAssessment(data);
      
      toast({
        title: "Using Fallback Recommendations",
        description: "We're using default recommendations based on your education level.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render the pathway details or recommendations
  if (selectedPathway) {
    return (
      <PathwayExamDetails
        pathwayId={selectedPathway.id}
        pathwayTitle={selectedPathway.title}
        budget={assessment?.budget || 'medium'}
        onBack={() => setSelectedPathway(null)}
      />
    );
  }

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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Willing to Relocate</FormLabel>
                            <FormDescription>
                              Check if you're open to opportunities in different regions
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Finding Matches..." : "Get AI Recommendations"}
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
                      <Brain className="mr-2 h-5 w-5 text-primary-600" />
                      Career Recommendations
                    </CardTitle>
                    <CardDescription>
                      Pathways that match your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendations.map((recommendation, index) => (
                      <Card key={index} className="overflow-hidden glass-card-colored animate-float-delay">
                        <div className="h-2 bg-gradient-to-r from-primary-500 to-blue-500" />
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                              <GraduationCap className="mr-2 h-5 w-5 text-primary-700" />
                              <span className="text-gradient">{recommendation.pathwayTitle || 'Career Pathway'}</span>
                            </div>
                            <Badge variant="outline" className="ml-2 text-xs">
                              Match Score: {recommendation.score}%
                            </Badge>
                          </CardTitle>
                          <CardDescription>{recommendation.reason}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="mb-4">
                              <h4 className="text-sm font-medium flex items-center mb-2">
                                <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                                Career Options
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {recommendation.careerOptions?.map((career: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="glass-card-colored">
                                    {career}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                              <div>
                                <h4 className="text-sm font-medium flex items-center mb-2">
                                  <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                                  Estimated Salary
                                </h4>
                                <p className="text-sm bg-green-50 p-2 rounded-md">
                                  {recommendation.estimatedSalary}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium flex items-center mb-2">
                                  <TrendingUp className="mr-2 h-4 w-4 text-orange-600" />
                                  Growth Potential
                                </h4>
                                <p className="text-sm bg-orange-50 p-2 rounded-md">
                                  {recommendation.growthPotential}
                                </p>
                              </div>
                            </div>

                            {recommendation.suggestedCourses && (
                              <div>
                                <h4 className="text-sm font-medium flex items-center mb-2">
                                  <BookOpen className="mr-2 h-4 w-4 text-purple-600" />
                                  Suggested Courses
                                </h4>
                                <div className="grid grid-cols-1 gap-1">
                                  {Array.isArray(recommendation.suggestedCourses) ? 
                                    recommendation.suggestedCourses.map((course: string, idx: number) => (
                                      <div key={idx} className="text-sm px-2 py-1 bg-purple-50 rounded-md">
                                        {course}
                                      </div>
                                    )) : 
                                    <div className="text-sm px-2 py-1 bg-purple-50 rounded-md">
                                      {recommendation.suggestedCourses}
                                    </div>
                                  }
                                </div>
                              </div>
                            )}

                            {recommendation.entranceExams && (
                              <div>
                                <h4 className="text-sm font-medium flex items-center mb-2">
                                  <FileText className="mr-2 h-4 w-4 text-red-600" />
                                  Required Entrance Exams
                                </h4>
                                <div className="grid grid-cols-1 gap-1">
                                  {typeof recommendation.entranceExams === 'string' ? 
                                    recommendation.entranceExams.split(',').map((exam: string, idx: number) => (
                                      <div key={idx} className="text-sm px-2 py-1 bg-red-50 rounded-md">
                                        {exam.trim()}
                                      </div>
                                    )) : 
                                    <div className="text-sm px-2 py-1 bg-red-50 rounded-md">Various entrance exams</div>
                                  }
                                </div>
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
                          <Button 
                            variant="outline" 
                            className="w-full btn-gradient-warm hover:shadow-none"
                            onClick={() => setSelectedPathway({
                              id: recommendation.pathwayId,
                              title: recommendation.pathwayTitle
                            })}
                          >
                            View Entrance Exams
                            <ChevronRight className="ml-1 h-4 w-4" />
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}