import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/authContext";
import { submitCareerAssessment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  educationLevels, 
  states, 
  careerAims, 
  budgetRanges 
} from "@shared/schema";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Career assessment form schema
const assessmentSchema = z.object({
  educationLevel: z.string().min(1, { message: "Education level is required" }),
  state: z.string().min(1, { message: "State is required" }),
  careerAim: z.string().optional(),
  budget: z.string().optional(),
  entranceRank: z.string().optional(),
  willingToRelocate: z.boolean().default(false),
  interests: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  additionalInfo: z.string().optional(),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

// Available interests options
const interestOptions = [
  { id: "science", label: "Science & Research" },
  { id: "technology", label: "Technology & Computing" },
  { id: "business", label: "Business & Finance" },
  { id: "arts", label: "Arts & Design" },
  { id: "healthcare", label: "Healthcare & Medicine" },
  { id: "education", label: "Education & Teaching" },
  { id: "law", label: "Law & Policy" },
  { id: "sports", label: "Sports & Fitness" },
  { id: "media", label: "Media & Communication" },
  { id: "environment", label: "Environment & Sustainability" },
];

// Available skills options
const skillOptions = [
  { id: "analytical", label: "Analytical Thinking" },
  { id: "communication", label: "Communication" },
  { id: "teamwork", label: "Teamwork" },
  { id: "leadership", label: "Leadership" },
  { id: "programming", label: "Programming" },
  { id: "languages", label: "Foreign Languages" },
  { id: "creativity", label: "Creativity" },
  { id: "problem-solving", label: "Problem Solving" },
  { id: "mathematics", label: "Mathematics" },
  { id: "writing", label: "Writing" },
];

export default function CareerAssessment() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("step1");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      educationLevel: "",
      state: "",
      careerAim: "",
      budget: "",
      entranceRank: "",
      willingToRelocate: false,
      interests: [],
      skills: [],
      additionalInfo: "",
    },
  });

  const educationLevel = form.watch("educationLevel");

  const nextTab = () => {
    if (activeTab === "step1") setActiveTab("step2");
    else if (activeTab === "step2") setActiveTab("step3");
    else if (activeTab === "step3") setActiveTab("step4");
  };

  const prevTab = () => {
    if (activeTab === "step4") setActiveTab("step3");
    else if (activeTab === "step3") setActiveTab("step2");
    else if (activeTab === "step2") setActiveTab("step1");
  };

  async function onSubmit(data: AssessmentFormValues) {
    try {
      setIsLoading(true);
      
      if (!isAuthenticated) {
        // If not authenticated, save to session storage and redirect to login
        sessionStorage.setItem("pendingAssessment", JSON.stringify(data));
        toast({
          title: "Sign in required",
          description: "Please sign in or register to save your assessment",
        });
        setLocation("/login");
        return;
      }
      
      const assessment = await submitCareerAssessment({
        ...data,
        userId: user?.id,
      });
      
      toast({
        title: "Assessment completed",
        description: "Your career recommendations are ready!",
      });
      
      // Navigate to results page
      setLocation(`/career-assessment/results/${assessment.id}`);
    } catch (error) {
      console.error("Assessment submission failed:", error);
      toast({
        title: "Submission failed",
        description: "There was an error saving your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const validateStep = () => {
    switch (activeTab) {
      case "step1":
        form.trigger(["educationLevel", "state"]);
        return !form.formState.errors.educationLevel && !form.formState.errors.state;
      case "step2":
        return true; // All fields in step 2 are optional
      case "step3":
        return true; // All fields in step 3 are optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      nextTab();
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("assessment.title")} | {t("appName")}</title>
      </Helmet>

      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>{t("assessment.title")}</CardTitle>
            <CardDescription>{t("assessment.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="step1" disabled>
                  {t("assessment.step1")}
                </TabsTrigger>
                <TabsTrigger value="step2" disabled>
                  {t("assessment.step2")}
                </TabsTrigger>
                <TabsTrigger value="step3" disabled>
                  {t("assessment.step3")}
                </TabsTrigger>
                <TabsTrigger value="step4" disabled>
                  {t("assessment.step4")}
                </TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <TabsContent value="step1" className="mt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="educationLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level*</FormLabel>
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
                                <SelectItem key={level} value={level}>
                                  {t(`educationLevels.${level}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* UG/PG action buttons */}
                    {(educationLevel === "UG" || educationLevel === "PG") && (
                      <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Button
                          type="button"
                          className="w-full sm:w-auto"
                          onClick={() => setLocation("/job-listings")}
                        >
                          Get a Job
                        </Button>
                        {educationLevel === "UG" ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => setLocation("/career-pathway")}
                          >
                            Pursue Masters
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => setLocation("/career-pathway")}
                          >
                            Do Research
                          </Button>
                        )}
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State*</FormLabel>
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
                                <SelectItem key={state} value={state}>
                                  {t(`states.${state}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="button" onClick={handleNext} className="w-full">
                      {t("assessment.next")}
                    </Button>
                  </TabsContent>

                  <TabsContent value="step2" className="mt-6 space-y-4">
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
                              <SelectItem value="">Select your career aim</SelectItem>
                              {careerAims.map((aim) => (
                                <SelectItem key={aim} value={aim}>
                                  {t(`careerAims.${aim}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            If you're not sure, you can leave this blank
                          </FormDescription>
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
                              <SelectItem value="">Select your budget range</SelectItem>
                              {budgetRanges.map((range) => (
                                <SelectItem key={range} value={range}>
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
                      name="entranceRank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entrance Exam Rank (if available)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. JEE: 15000, NEET: 25000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your rank in any entrance exams you've taken
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevTab}>
                        {t("assessment.back")}
                      </Button>
                      <Button type="button" onClick={handleNext}>
                        {t("assessment.next")}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="step3" className="mt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="interests"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Interests</FormLabel>
                            <FormDescription>
                              Select areas that interest you the most
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {interestOptions.map((interest) => (
                              <FormField
                                key={interest.id}
                                control={form.control}
                                name="interests"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={interest.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(interest.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), interest.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== interest.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
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
                              Select skills you have or would like to develop
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {skillOptions.map((skill) => (
                              <FormField
                                key={skill.id}
                                control={form.control}
                                name="skills"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={skill.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(skill.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), skill.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== skill.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
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

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevTab}>
                        {t("assessment.back")}
                      </Button>
                      <Button type="button" onClick={handleNext}>
                        {t("assessment.next")}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="step4" className="mt-6 space-y-4">
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
                              Check this if you're willing to relocate for education or job opportunities
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share any additional information that might help us provide better recommendations"
                              {...field}
                              rows={5}
                            />
                          </FormControl>
                          <FormDescription>
                            This could include specific career questions, challenges, or goals
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevTab}>
                        {t("assessment.back")}
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          t("assessment.submit")
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              {activeTab === "step1" ? "1" : activeTab === "step2" ? "2" : activeTab === "step3" ? "3" : "4"} of 4 steps
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
