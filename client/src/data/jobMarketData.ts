// Job market data and statistics

export interface TrendingCareer {
  id: number;
  rank: number;
  field: string;
  growthRate: string;
  averageSalary: string;
  jobOpenings: string;
}

export interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  workMode: string;
  description: string;
  postedDate: string;
}

// Trending careers in India
export const trendingCareers: TrendingCareer[] = [
  {
    id: 1,
    rank: 1,
    field: "Data Science",
    growthRate: "+35%",
    averageSalary: "₹8L - ₹25L",
    jobOpenings: "12,500+"
  },
  {
    id: 2,
    rank: 2,
    field: "AI & ML",
    growthRate: "+42%",
    averageSalary: "₹10L - ₹30L",
    jobOpenings: "8,200+"
  },
  {
    id: 3,
    rank: 3,
    field: "Healthcare",
    growthRate: "+28%",
    averageSalary: "₹5L - ₹40L",
    jobOpenings: "15,800+"
  },
  {
    id: 4,
    rank: 4,
    field: "Digital Marketing",
    growthRate: "+25%",
    averageSalary: "₹4L - ₹18L",
    jobOpenings: "9,500+"
  }
];

// Sample job listings
export const jobListings: JobListing[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "Hyderabad",
    salary: "₹18L - ₹25L",
    jobType: "Full-time",
    workMode: "Remote",
    description: "Looking for an experienced software engineer with expertise in backend development using Java/Spring.",
    postedDate: "2023-07-05"
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "AnalyticsPro AI",
    location: "Bangalore",
    salary: "₹15L - ₹22L",
    jobType: "Full-time",
    workMode: "Hybrid",
    description: "Join our data science team to build predictive models and derive insights from complex datasets.",
    postedDate: "2023-07-10"
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "WebTech Innovations",
    location: "Mumbai",
    salary: "₹12L - ₹18L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "Looking for a frontend developer with expertise in React, Redux, and responsive design.",
    postedDate: "2023-07-12"
  },
  {
    id: 4,
    title: "Product Manager",
    company: "InnovateTech",
    location: "Delhi",
    salary: "₹20L - ₹30L",
    jobType: "Full-time",
    workMode: "Hybrid",
    description: "Lead product development initiatives and drive product strategy for our enterprise solutions.",
    postedDate: "2023-07-08"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudScale Technologies",
    location: "Chennai",
    salary: "₹16L - ₹24L",
    jobType: "Full-time",
    workMode: "Remote",
    description: "Implement and manage CI/CD pipelines, cloud infrastructure, and containerization.",
    postedDate: "2023-07-15"
  }
];

// Regional job market statistics
export const regionalJobStats = {
  "Delhi NCR": {
    topSectors: ["IT/ITES", "E-commerce", "Consulting", "Financial Services"],
    averageSalary: "₹8L - ₹12L",
    growthRate: "+18%"
  },
  "Mumbai": {
    topSectors: ["Banking", "Entertainment", "Financial Services", "Manufacturing"],
    averageSalary: "₹9L - ₹14L",
    growthRate: "+15%"
  },
  "Bangalore": {
    topSectors: ["IT", "Startups", "Fintech", "Aerospace"],
    averageSalary: "₹10L - ₹16L",
    growthRate: "+22%"
  },
  "Hyderabad": {
    topSectors: ["IT", "Pharma", "Biotechnology", "Education"],
    averageSalary: "₹7L - ₹13L",
    growthRate: "+20%"
  },
  "Chennai": {
    topSectors: ["Automotive", "IT", "Manufacturing", "Healthcare"],
    averageSalary: "₹6L - ₹11L",
    growthRate: "+17%"
  }
};
