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
  },
  {
    id: 5,
    rank: 5,
    field: "Renewable Energy",
    growthRate: "+32%",
    averageSalary: "₹6L - ₹22L",
    jobOpenings: "7,800+"
  },
  {
    id: 6,
    rank: 6,
    field: "Cybersecurity",
    growthRate: "+38%",
    averageSalary: "₹8L - ₹28L",
    jobOpenings: "11,200+"
  },
  {
    id: 7,
    rank: 7,
    field: "E-commerce",
    growthRate: "+30%",
    averageSalary: "₹5L - ₹20L",
    jobOpenings: "13,700+"
  },
  {
    id: 8,
    rank: 8,
    field: "EdTech",
    growthRate: "+27%",
    averageSalary: "₹5L - ₹18L",
    jobOpenings: "8,300+"
  },
  {
    id: 9,
    rank: 9,
    field: "FinTech",
    growthRate: "+33%",
    averageSalary: "₹7L - ₹25L",
    jobOpenings: "9,100+"
  },
  {
    id: 10,
    rank: 10,
    field: "Sustainable Agriculture",
    growthRate: "+22%",
    averageSalary: "₹4L - ₹15L",
    jobOpenings: "6,500+"
  },
  {
    id: 11,
    rank: 11,
    field: "Civil Engineering",
    growthRate: "+18%",
    averageSalary: "₹4.5L - ₹20L",
    jobOpenings: "10,800+"
  },
  {
    id: 12,
    rank: 12,
    field: "Biotechnology",
    growthRate: "+26%",
    averageSalary: "₹6L - ₹18L",
    jobOpenings: "5,400+"
  }
];

// Sample job listings
export const jobListings: JobListing[] = [
  // IT & Technology
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
  },
  
  // Healthcare
  {
    id: 6,
    title: "Medical Officer",
    company: "Apollo Hospitals",
    location: "Delhi",
    salary: "₹12L - ₹18L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "Looking for a qualified MBBS doctor with 2+ years of experience for our general medicine department.",
    postedDate: "2023-07-14"
  },
  {
    id: 7,
    title: "Nursing Supervisor",
    company: "Fortis Healthcare",
    location: "Mumbai",
    salary: "₹6L - ₹9L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "Supervise nursing staff in the critical care unit. B.Sc Nursing with 5+ years experience required.",
    postedDate: "2023-07-02"
  },
  
  // Engineering
  {
    id: 8,
    title: "Civil Engineer",
    company: "Larsen & Toubro",
    location: "Chennai",
    salary: "₹8L - ₹14L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "Site supervision for large infrastructure projects. B.Tech/BE Civil with 3+ years experience.",
    postedDate: "2023-07-08"
  },
  {
    id: 9,
    title: "Mechanical Design Engineer",
    company: "Tata Motors",
    location: "Pune",
    salary: "₹7L - ₹12L",
    jobType: "Full-time",
    workMode: "Hybrid",
    description: "Design automotive components using CAD tools. ME/M.Tech with automotive experience preferred.",
    postedDate: "2023-07-12"
  },
  
  // Education
  {
    id: 10,
    title: "Assistant Professor - Computer Science",
    company: "VIT University",
    location: "Vellore",
    salary: "₹6L - ₹10L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "PhD in Computer Science with publications. Experience teaching AI/ML courses preferred.",
    postedDate: "2023-07-01"
  },
  {
    id: 11,
    title: "School Principal",
    company: "Delhi Public School",
    location: "Gurgaon",
    salary: "₹15L - ₹25L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "Lead a K-12 school with 2000+ students. M.Ed with 10+ years administrative experience required.",
    postedDate: "2023-07-05"
  },
  
  // Finance & Banking
  {
    id: 12,
    title: "Investment Banking Analyst",
    company: "ICICI Securities",
    location: "Mumbai",
    salary: "₹12L - ₹18L",
    jobType: "Full-time",
    workMode: "Hybrid",
    description: "MBA Finance with strong financial modeling skills. CFA certification preferred.",
    postedDate: "2023-07-09"
  },
  {
    id: 13,
    title: "Risk Management Specialist",
    company: "HDFC Bank",
    location: "Bangalore",
    salary: "₹14L - ₹22L",
    jobType: "Full-time",
    workMode: "Hybrid",
    description: "Develop risk assessment frameworks for retail banking. 5+ years in banking risk management required.",
    postedDate: "2023-07-14"
  },
  
  // Agriculture & Sustainability
  {
    id: 14,
    title: "Agricultural Scientist",
    company: "Indian Council of Agricultural Research",
    location: "Punjab",
    salary: "₹7L - ₹12L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "Research on crop yield improvement. PhD in Agricultural Sciences with research experience.",
    postedDate: "2023-07-10"
  },
  {
    id: 15,
    title: "Renewable Energy Consultant",
    company: "Suzlon Energy",
    location: "Gujarat",
    salary: "₹10L - ₹15L",
    jobType: "Full-time",
    workMode: "Hybrid",
    description: "Consulting for large-scale wind and solar projects. B.Tech with renewable energy experience.",
    postedDate: "2023-07-07"
  },
  
  // Creative Fields
  {
    id: 16,
    title: "UI/UX Designer",
    company: "Design Studio Creative",
    location: "Bangalore",
    salary: "₹8L - ₹15L",
    jobType: "Full-time",
    workMode: "Remote",
    description: "Create engaging user interfaces for web and mobile applications. Portfolio and 3+ years experience required.",
    postedDate: "2023-07-12"
  },
  {
    id: 17,
    title: "Content Writer",
    company: "OTT Media",
    location: "Mumbai",
    salary: "₹5L - ₹9L",
    jobType: "Full-time",
    workMode: "Hybrid",
    description: "Create engaging content for digital platforms. Strong portfolio and experience in digital content creation required.",
    postedDate: "2023-07-11"
  },
  
  // Trades & Services
  {
    id: 18,
    title: "Electrician Supervisor",
    company: "Shapoorji Pallonji Group",
    location: "Delhi",
    salary: "₹4L - ₹7L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "Supervise electrical work at construction sites. ITI with 5+ years experience required.",
    postedDate: "2023-07-06"
  },
  {
    id: 19,
    title: "Hospitality Manager",
    company: "Taj Hotels",
    location: "Goa",
    salary: "₹6L - ₹10L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "Manage daily operations of a 5-star hotel. Hotel Management degree with 7+ years experience.",
    postedDate: "2023-07-08"
  },
  
  // Entry Level
  {
    id: 20,
    title: "Junior Software Developer",
    company: "Infosys",
    location: "Hyderabad",
    salary: "₹3.5L - ₹5L",
    jobType: "Full-time",
    workMode: "Onsite",
    description: "Entry-level position for fresh graduates. B.Tech/BCA in Computer Science. Strong programming fundamentals required.",
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
