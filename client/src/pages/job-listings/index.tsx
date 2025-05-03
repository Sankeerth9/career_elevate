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

// Skills and experience options
const skillOptions = [
  "JavaScript", "React", "Node.js", "SQL", "Python", "Tableau", "SEO", "Content Marketing", "Analytics", "Biology", "Research", "Lab Work"
];
const experienceOptions = [
  { label: "Fresher", value: "0" },
  { label: "1-3 years", value: "1-3" },
  { label: "3-5 years", value: "3-5" },
  { label: "5+ years", value: "5+" }
];

// Mock job data with experience
const mockJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Innovators Pvt Ltd",
    location: "Bangalore, India",
    skills: ["JavaScript", "React", "Node.js"],
    salary: "₹12,00,000",
    experience: "1-3"
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Data Insights Inc.",
    location: "Hyderabad, India",
    skills: ["SQL", "Python", "Tableau"],
    salary: "₹8,50,000",
    experience: "0"
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "BrandMakers",
    location: "Mumbai, India",
    skills: ["SEO", "Content Marketing", "Analytics"],
    salary: "₹10,00,000",
    experience: "3-5"
  },
  {
    id: 4,
    title: "Research Scientist",
    company: "BioGen Labs",
    location: "Pune, India",
    skills: ["Biology", "Research", "Lab Work"],
    salary: "₹9,00,000",
    experience: "5+"
  },
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
  const [jobs, setJobs] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>("");

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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(mockJobs);
    }, 500);
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

  // Filter jobs based on selected skills and experience
  const filteredJobs = jobs.filter((job: any) => {
    // Skills filter: all selected skills must be in job.skills
    const skillsMatch = selectedSkills.length === 0 || selectedSkills.every(skill => job.skills.includes(skill));
    // Experience filter
    const experienceMatch = !selectedExperience || job.experience === selectedExperience;
    return skillsMatch && experienceMatch;
  });

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
        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <div>
              <label className="block font-medium mb-1">Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    className={`px-3 py-1 rounded-full border text-sm ${selectedSkills.includes(skill) ? "bg-primary text-white border-primary" : "bg-white text-primary-700 border-primary-200"}`}
                    onClick={() => setSelectedSkills(selectedSkills.includes(skill) ? selectedSkills.filter(s => s !== skill) : [...selectedSkills, skill])}
                    type="button"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Experience</label>
              <select
                className="border rounded px-3 py-1 text-sm"
                value={selectedExperience}
                onChange={e => setSelectedExperience(e.target.value)}
              >
                <option value="">All</option>
                {experienceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="shadow-lg border border-primary-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary-800 mb-2">{job.title}</CardTitle>
                <div className="text-md text-neutral-700 font-medium">{job.company}</div>
                <div className="text-sm text-neutral-500">{job.location}</div>
                <div className="text-xs text-neutral-400 mt-1">Experience: {experienceOptions.find(opt => opt.value === job.experience)?.label || job.experience}</div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <span className="font-semibold text-neutral-700">Required Skills:</span>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {job.skills.map((skill: string, idx: number) => (
                      <li key={idx} className="inline-block mr-2 px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs border border-primary-100">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <span className="font-semibold text-neutral-700">Average Salary:</span>
                  <span className="ml-2 text-lg text-green-700 font-bold bg-green-50 px-2 py-1 rounded">
                    {job.salary}
                  </span>
                </div>
                <Button className="mt-6 w-full" variant="default">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
          {filteredJobs.length === 0 && (
            <div className="col-span-full text-center text-neutral-500 py-12">
              No jobs found matching your filters.
            </div>
          )}
        </div>
      </div>
    </>
  );
}