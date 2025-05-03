import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchJobs, getSuggestedJobKeywords, type JobListing, type JobFilters } from "./JobSearchAPI";
import { useToast } from "@/hooks/use-toast";
import { states } from "@shared/schema";

// UI components
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  Briefcase,
  MapPin,
  DollarSign,
  Search,
  Building,
  Calendar,
  ExternalLink,
  Filter,
  ChevronRight,
  ChevronLeft,
  Clock,
  GraduationCap,
  BookOpen,
} from "lucide-react";

// Form schema for job search
const searchFormSchema = z.object({
  keywords: z.string().min(1, "Please enter at least one keyword"),
  location: z.string().optional(),
  salary: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

// Suggested searches based on career paths
const suggestedSearches = [
  { name: "Engineering", keywords: "software engineer, mechanical engineer" },
  { name: "Healthcare", keywords: "nurse, healthcare, medical assistant" },
  { name: "Business", keywords: "business analyst, marketing, finance" },
  { name: "Entry Level", keywords: "entry level, trainee, internship" },
  { name: "Remote", keywords: "remote work, work from home" },
];

export default function JobListingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [activeJobDetail, setActiveJobDetail] = useState<JobListing | null>(null);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);

  // Initialize form
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      keywords: "",
      location: "",
      salary: "",
    },
  });

  // Load user preferences from localStorage to suggest relevant jobs
  useEffect(() => {
    const userPrefs = localStorage.getItem('userPreferences');
    if (userPrefs) {
      try {
        const { educationLevel, careerAim } = JSON.parse(userPrefs);
        if (educationLevel && careerAim) {
          const keywords = getSuggestedJobKeywords(educationLevel, careerAim);
          setSuggestedKeywords(keywords);
          
          // Auto-populate the form with the first keyword
          if (keywords.length > 0 && !form.getValues('keywords')) {
            form.setValue('keywords', keywords[0]);
          }
          
          // Auto-search using first keyword
          if (keywords.length > 0) {
            searchJobsHandler({
              keywords: keywords[0],
              location: "",
              salary: ""
            });
          }
        }
      } catch (error) {
        console.error("Error parsing user preferences:", error);
      }
    }
  }, []);

  const searchJobsHandler = async (data: SearchFormValues) => {
    setIsLoading(true);
    setActiveJobDetail(null);
    
    try {
      const filters: JobFilters = {
        keywords: data.keywords,
        location: data.location,
        salary: data.salary,
        page: currentPage,
        limit: jobsPerPage
      };
      
      const result = await searchJobs(filters);
      
      setJobListings(result.jobs);
      setTotalJobs(result.totalCount);
      
      if (result.jobs.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try different keywords or location",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Jobs Found",
          description: `Found ${result.totalCount} jobs matching your criteria`,
        });
      }
    } catch (error) {
      console.error("Job search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to fetch job listings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const currentFilters = form.getValues();
    searchJobsHandler(currentFilters);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleSuggestedSearch = (keywords: string) => {
    form.setValue('keywords', keywords);
    searchJobsHandler({ keywords, location: "", salary: "" });
  };

  const onSubmit = (data: SearchFormValues) => {
    setCurrentPage(1);
    searchJobsHandler(data);
  };

  return (
    <>
      <Helmet>
        <title>Job Listings | {t("appName")}</title>
        <meta
          name="description"
          content="Find jobs that match your skills, education, and career goals"
        />
      </Helmet>

      <div className="bg-primary-700 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="h-8 w-8 text-primary-200" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Job Listings
            </h1>
          </div>
          <p className="mt-3 text-xl text-primary-200 max-w-3xl">
            Find job opportunities that match your skills, education level, and career interests.
            Apply directly or save positions for later.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Search form and filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Search Jobs
                </CardTitle>
                <CardDescription>
                  Filter jobs based on your preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords</FormLabel>
                          <FormControl>
                            <Input placeholder="Job title, skills, or company" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter job title, skills, or companies
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem key="any-location" value="any">Any Location</SelectItem>
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
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Range</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select salary range (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem key="any-salary" value="any">Any Salary</SelectItem>
                              <SelectItem key="salary-1" value="0-300000">₹0 - ₹3 LPA</SelectItem>
                              <SelectItem key="salary-2" value="300000-600000">₹3 - ₹6 LPA</SelectItem>
                              <SelectItem key="salary-3" value="600000-1000000">₹6 - ₹10 LPA</SelectItem>
                              <SelectItem key="salary-4" value="1000000-1500000">₹10 - ₹15 LPA</SelectItem>
                              <SelectItem key="salary-5" value="1500000-max">₹15+ LPA</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Searching..." : "Search Jobs"}
                    </Button>
                  </form>
                </Form>

                {/* Suggested searches based on your career assessments */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                    Suggested Career Searches
                  </h3>
                  
                  {suggestedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {suggestedKeywords.map((keyword, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary/10"
                          onClick={() => handleSuggestedSearch(keyword)}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Complete a career assessment to get personalized job suggestions.
                    </div>
                  )}
                </div>

                {/* Popular searches */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSearches.map((search, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="cursor-pointer"
                        onClick={() => handleSuggestedSearch(search.keywords)}
                      >
                        {search.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Job listings and details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    {totalJobs > 0 ? `${totalJobs} Jobs Found` : "Job Listings"}
                  </CardTitle>
                  
                  {isLoading && (
                    <Badge variant="outline">
                      <Clock className="mr-1 h-4 w-4 animate-spin" />
                      Searching...
                    </Badge>
                  )}
                </div>
                
                <CardDescription>
                  {jobListings.length > 0 
                    ? "Click on a job to view details" 
                    : "Search for jobs to see listings"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  // Loading skeleton
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="p-6">
                          <Skeleton className="h-6 w-2/3 mb-4" />
                          <Skeleton className="h-4 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-1/4 mb-4" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : jobListings.length > 0 ? (
                  <div>
                    <Tabs defaultValue="list" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="list">Job Listings</TabsTrigger>
                        <TabsTrigger value="details" disabled={!activeJobDetail}>
                          Job Details
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="list" className="mt-0">
                        <div className="space-y-4">
                          {jobListings.map((job) => (
                            <Card 
                              key={job.id} 
                              className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                                activeJobDetail?.id === job.id ? 'border-primary/50 shadow-md' : ''
                              }`}
                              onClick={() => setActiveJobDetail(job)}
                            >
                              <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 text-primary-700">
                                  {job.title}
                                </h3>
                                
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                                  {job.company && (
                                    <span className="flex items-center">
                                      <Building className="h-4 w-4 mr-1" />
                                      {job.company}
                                    </span>
                                  )}
                                  
                                  {job.location && (
                                    <span className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      {job.location}
                                    </span>
                                  )}
                                  
                                  {job.salary && (
                                    <span className="flex items-center">
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      {job.salary}
                                    </span>
                                  )}
                                  
                                  {job.updated && (
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {formatDate(job.updated)}
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-sm line-clamp-3 mb-3">
                                  {job.description}
                                </p>
                                
                                <div className="flex justify-between items-center">
                                  <div className="flex flex-wrap gap-2">
                                    {job.type && (
                                      <Badge variant="outline">
                                        {job.type}
                                      </Badge>
                                    )}
                                    {job.source && (
                                      <Badge variant="secondary" className="text-xs">
                                        {job.source}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(job.link, '_blank');
                                    }}
                                  >
                                    View <ExternalLink className="ml-1 h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                        
                        {/* Pagination */}
                        {totalJobs > jobsPerPage && (
                          <div className="flex justify-center mt-6">
                            <nav className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              {[...Array(Math.min(5, Math.ceil(totalJobs / jobsPerPage)))].map((_, i) => {
                                const page = i + 1;
                                return (
                                  <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </Button>
                                );
                              })}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= Math.ceil(totalJobs / jobsPerPage)}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </nav>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="details" className="mt-0">
                        {activeJobDetail && (
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-2xl font-bold text-primary-800 mb-2">
                                {activeJobDetail.title}
                              </h2>
                              
                              <div className="flex flex-wrap items-center gap-4 mb-4">
                                {activeJobDetail.company && (
                                  <div className="flex items-center">
                                    <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <span className="font-medium">{activeJobDetail.company}</span>
                                  </div>
                                )}
                                
                                {activeJobDetail.location && (
                                  <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <span>{activeJobDetail.location}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {activeJobDetail.salary && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <div className="flex items-center mb-1">
                                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                                      <span className="font-medium">Salary Range</span>
                                    </div>
                                    <p>{activeJobDetail.salary}</p>
                                  </div>
                                )}
                                
                                {activeJobDetail.updated && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <div className="flex items-center mb-1">
                                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                      <span className="font-medium">Posted Date</span>
                                    </div>
                                    <p>{formatDate(activeJobDetail.updated)}</p>
                                  </div>
                                )}
                                
                                {activeJobDetail.type && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <div className="flex items-center mb-1">
                                      <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
                                      <span className="font-medium">Job Type</span>
                                    </div>
                                    <p>{activeJobDetail.type}</p>
                                  </div>
                                )}
                                
                                {activeJobDetail.source && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <div className="flex items-center mb-1">
                                      <BookOpen className="h-5 w-5 mr-2 text-orange-600" />
                                      <span className="font-medium">Source</span>
                                    </div>
                                    <p>{activeJobDetail.source}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: activeJobDetail.description }} />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between items-center">
                              <Button
                                variant="outline"
                                onClick={() => setActiveJobDetail(null)}
                              >
                                Back to Listings
                              </Button>
                              
                              <Button 
                                onClick={() => window.open(activeJobDetail.link, '_blank')}
                              >
                                Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Jobs Found</h3>
                    <p className="text-muted-foreground mb-6">
                      Search for jobs using the form or try one of our suggested searches.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestedSearches.slice(0, 3).map((search, index) => (
                        <Button 
                          key={index} 
                          variant="outline"
                          onClick={() => handleSuggestedSearch(search.keywords)}
                        >
                          Search {search.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}