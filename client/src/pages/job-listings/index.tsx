import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { jobListings as allJobListings, regionalJobStats } from "@/data/jobMarketData";
import { states, careerAims } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Building,
  MapPin,
  DollarSign,
  Search,
  Calendar,
  ExternalLink,
  Filter,
  TrendingUp,
  Briefcase,
  Clock,
  PieChart,
  CheckCircle
} from "lucide-react";
import { formatDate, timeAgo } from "@/lib/utils";

export default function JobListings() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [careerField, setCareerField] = useState("");
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [recentlyPosted, setRecentlyPosted] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(allJobListings);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Filter jobs when filters change
  useEffect(() => {
    let filtered = allJobListings;
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }
    
    // Location filter
    if (location) {
      filtered = filtered.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
    }
    
    // Career field filter
    if (careerField) {
      filtered = filtered.filter(job => {
        if (careerField === 'engineering') return job.title.toLowerCase().includes('engineer') || job.title.toLowerCase().includes('developer');
        if (careerField === 'medical') return job.title.toLowerCase().includes('doctor') || job.title.toLowerCase().includes('nurse') || job.title.toLowerCase().includes('health');
        if (careerField === 'law') return job.title.toLowerCase().includes('lawyer') || job.title.toLowerCase().includes('legal');
        if (careerField === 'commerce') return job.title.toLowerCase().includes('finance') || job.title.toLowerCase().includes('account');
        if (careerField === 'civilservice') return job.title.toLowerCase().includes('officer') || job.title.toLowerCase().includes('government');
        return true;
      });
    }
    
    // Remote filter
    if (showRemoteOnly) {
      filtered = filtered.filter(job => job.workMode.toLowerCase() === 'remote');
    }
    
    // Recently posted filter (within last 14 days)
    if (recentlyPosted) {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      filtered = filtered.filter(job => new Date(job.postedDate) >= twoWeeksAgo);
    }
    
    setFilteredJobs(filtered);
  }, [searchQuery, location, careerField, showRemoteOnly, recentlyPosted]);

  return (
    <>
      <Helmet>
        <title>Job Listings | {t("appName")}</title>
        <meta name="description" content="Browse job listings tailored to your skills and location" />
      </Helmet>

      <div className="bg-primary-700 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Job Listings
          </h1>
          <p className="mt-3 text-xl text-primary-200">
            Discover employment opportunities matched to your skills and educational background
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Quick Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search job title, company, or keywords..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="md:w-auto w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button 
                className="md:w-auto w-full"
                onClick={() => {
                  setSearchQuery("");
                  setLocation("");
                  setCareerField("");
                  setShowRemoteOnly(false);
                  setRecentlyPosted(false);
                }}
              >
                Search Jobs
              </Button>
            </div>

            {/* Expanded Filters */}
            {isFilterExpanded && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All locations</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="careerField" className="block text-sm font-medium mb-1">
                    Career Field
                  </label>
                  <Select value={careerField} onValueChange={setCareerField}>
                    <SelectTrigger id="careerField">
                      <SelectValue placeholder="All fields" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All fields</SelectItem>
                      {careerAims.map((aim) => (
                        <SelectItem key={aim} value={aim}>
                          {t(`careerAims.${aim}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remoteOnly" 
                      checked={showRemoteOnly} 
                      onCheckedChange={(checked) => 
                        setShowRemoteOnly(checked as boolean)
                      } 
                    />
                    <label
                      htmlFor="remoteOnly"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remote jobs only
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="recentlyPosted" 
                      checked={recentlyPosted} 
                      onCheckedChange={(checked) => 
                        setRecentlyPosted(checked as boolean)
                      } 
                    />
                    <label
                      htmlFor="recentlyPosted"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Posted in last 14 days
                    </label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Job Listings */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>

            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-primary-600">{job.title}</h3>
                            <div className="flex items-center mt-1">
                              <Building className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm text-muted-foreground">{job.company}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap mt-2 md:mt-0 gap-1">
                            <Badge variant="outline" className="bg-primary-50 text-primary-700">
                              {job.jobType}
                            </Badge>
                            <Badge variant="outline" className={
                              job.workMode === "Remote" 
                                ? "bg-green-50 text-green-700" 
                                : job.workMode === "Hybrid"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-orange-50 text-orange-700"
                            }>
                              {job.workMode}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm">{job.salary}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm">{timeAgo(job.postedDate)}</span>
                          </div>
                        </div>
                        
                        <p className="mt-3 text-sm text-muted-foreground">
                          {job.description}
                        </p>
                      </div>
                      
                      <div className="px-6 py-4 bg-muted/20 border-t flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Posted on {formatDate(job.postedDate)}
                        </span>
                        <Button asChild>
                          <Link to={`/job-listings/${job.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Search className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No jobs found</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    Try adjusting your search criteria or filters to see more results.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setLocation("");
                      setCareerField("");
                      setShowRemoteOnly(false);
                      setRecentlyPosted(false);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar with Job Market Insights */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <PieChart className="mr-2 h-5 w-5" />
                  Regional Job Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(regionalJobStats).map(([region, stats], index) => (
                    <AccordionItem key={region} value={region}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex justify-between items-center w-full pr-4">
                          <span>{region}</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {stats.growthRate}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <div>
                            <p className="text-sm font-medium">Top Sectors:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {stats.topSectors.map((sector, idx) => (
                                <Badge key={idx} variant="outline">
                                  {sector}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Avg. Salary Range:</span>
                            <span className="text-sm font-medium">{stats.averageSalary}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Trending Job Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      Data Science
                    </span>
                    <Badge className="bg-green-100 text-green-800">+35%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      AI & ML
                    </span>
                    <Badge className="bg-green-100 text-green-800">+42%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      Healthcare
                    </span>
                    <Badge className="bg-green-100 text-green-800">+28%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      Digital Marketing
                    </span>
                    <Badge className="bg-green-100 text-green-800">+25%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      Renewable Energy
                    </span>
                    <Badge className="bg-green-100 text-green-800">+22%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5" />
                  Job Search Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">Tailor your resume to each job application</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">Use keywords from the job description</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">Research the company before interviews</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">Follow up after submitting applications</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">Upskill in areas relevant to your target role</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/career-assessment">
                    Take Career Assessment
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
