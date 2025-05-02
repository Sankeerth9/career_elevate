// This file contains data structures and utility functions related to career data

export interface CareerField {
  id: string;
  name: string;
  growthRate: string;
  averageSalary: string;
  jobOpenings: string;
  description: string;
  skills: string[];
  educationRequired: string[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string; // full-time, part-time, contract, etc.
  remote: boolean;
  description: string;
  requirements: string[];
  applicationUrl: string;
  postedDate: string;
}

// Trending career fields in India
export const trendingCareerFields: CareerField[] = [
  {
    id: "data-science",
    name: "Data Science",
    growthRate: "+35%",
    averageSalary: "₹8L - ₹25L",
    jobOpenings: "12,500+",
    description: "Analyze and interpret complex data to help organizations make better decisions.",
    skills: ["Python", "R", "SQL", "Machine Learning", "Data Visualization"],
    educationRequired: ["B.Tech/B.E.", "M.Tech", "MSc in Statistics", "PhD"]
  },
  {
    id: "ai-ml",
    name: "AI & ML",
    growthRate: "+42%",
    averageSalary: "₹10L - ₹30L",
    jobOpenings: "8,200+",
    description: "Develop algorithms and models that enable computers to learn from data and make predictions.",
    skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP"],
    educationRequired: ["B.Tech/B.E. in CS/IT", "M.Tech in CS/AI", "PhD"]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    growthRate: "+28%",
    averageSalary: "₹5L - ₹40L",
    jobOpenings: "15,800+",
    description: "Provide medical services, healthcare management, and research in various medical fields.",
    skills: ["Medical Knowledge", "Patient Care", "Clinical Research", "Healthcare Management"],
    educationRequired: ["MBBS", "MD", "BDS", "B.Pharma", "BHMS", "BAMS"]
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    growthRate: "+25%",
    averageSalary: "₹4L - ₹18L",
    jobOpenings: "9,500+",
    description: "Promote products, services, and brands through digital channels, including social media, email, and search engines.",
    skills: ["SEO", "Social Media Marketing", "Content Creation", "Google Analytics", "SEM"],
    educationRequired: ["BBA", "MBA", "B.Com", "Digital Marketing Certification"]
  }
];

// Sample job listings
export const recentJobListings: JobListing[] = [
  {
    id: "job1",
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "Hyderabad",
    salary: "₹18L - ₹25L",
    type: "Full-time",
    remote: true,
    description: "We are seeking an experienced software engineer to join our development team.",
    requirements: ["5+ years of experience", "Java/Spring Boot", "React.js", "Microservices"],
    applicationUrl: "#",
    postedDate: "2023-07-15"
  },
  {
    id: "job2",
    title: "Data Scientist",
    company: "AnalyticsPro AI",
    location: "Bangalore",
    salary: "₹15L - ₹22L",
    type: "Full-time",
    remote: false,
    description: "Join our data science team to build predictive models for our clients.",
    requirements: ["3+ years of experience", "Python", "ML", "Statistics", "SQL"],
    applicationUrl: "#",
    postedDate: "2023-07-20"
  }
];

// Utility function to filter jobs by criteria
export function filterJobs(
  jobs: JobListing[],
  criteria: {
    location?: string;
    minSalary?: number;
    remote?: boolean;
    type?: string;
  }
): JobListing[] {
  return jobs.filter(job => {
    if (criteria.location && !job.location.includes(criteria.location)) return false;
    
    if (criteria.minSalary) {
      // Extract minimum salary from range (e.g. "₹15L - ₹22L" -> 15)
      const minJobSalary = parseInt(job.salary.split('₹')[1].split('L')[0]);
      if (minJobSalary < criteria.minSalary) return false;
    }
    
    if (criteria.remote !== undefined && job.remote !== criteria.remote) return false;
    
    if (criteria.type && job.type !== criteria.type) return false;
    
    return true;
  });
}
