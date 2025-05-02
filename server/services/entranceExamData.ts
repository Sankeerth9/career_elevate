/**
 * Entrance Exam Data
 * Contains information about various entrance exams for different career paths and education levels
 */

export interface EntranceExam {
  id: number;
  name: string;
  fullName: string;
  forEducationLevel: string;
  forCareerPath: string[];
  eligibility: string;
  examMonth: string;
  applicationMonth: string;
  officialWebsite: string;
  examLevel: "national" | "state" | "university" | "international";
  minPercentileRequired: number; // Minimum percentile typically needed for good colleges
  importance: number; // 1-5 scale, 5 being most important
}

export interface College {
  id: number;
  name: string;
  location: string;
  type: "government" | "private" | "deemed";
  forCareerPath: string[];
  courses: string[];
  entranceExams: string[];
  feesRange: string;
  budgetCategory: "low" | "medium" | "high" | "veryhigh";
  ranking: number; // Lower is better
  websiteUrl: string;
}

// Entrance Exams Data
export const entranceExams: EntranceExam[] = [
  // After 10th exams
  {
    id: 1,
    name: "NTSE",
    fullName: "National Talent Search Examination",
    forEducationLevel: "10th",
    forCareerPath: ["any"],
    eligibility: "10th standard students",
    examMonth: "November",
    applicationMonth: "August-September",
    officialWebsite: "https://ncert.nic.in/national-talent-examination.php",
    examLevel: "national",
    minPercentileRequired: 95,
    importance: 4
  },
  {
    id: 2,
    name: "JSTSE",
    fullName: "Junior Science Talent Search Examination",
    forEducationLevel: "10th",
    forCareerPath: ["science", "engineering"],
    eligibility: "10th standard students with interest in science",
    examMonth: "January",
    applicationMonth: "October-November",
    officialWebsite: "https://jstse.org",
    examLevel: "state",
    minPercentileRequired: 90,
    importance: 3
  },
  
  // After 12th - Engineering
  {
    id: 3,
    name: "JEE Main",
    fullName: "Joint Entrance Examination (Main)",
    forEducationLevel: "12th",
    forCareerPath: ["engineering"],
    eligibility: "12th pass with Physics, Chemistry, Mathematics",
    examMonth: "January, April",
    applicationMonth: "September-October",
    officialWebsite: "https://jeemain.nta.nic.in",
    examLevel: "national",
    minPercentileRequired: 85, // For NITs/IIITs
    importance: 5
  },
  {
    id: 4,
    name: "JEE Advanced",
    fullName: "Joint Entrance Examination (Advanced)",
    forEducationLevel: "12th",
    forCareerPath: ["engineering"],
    eligibility: "Must qualify JEE Main",
    examMonth: "May-June",
    applicationMonth: "After JEE Main results",
    officialWebsite: "https://jeeadv.ac.in",
    examLevel: "national",
    minPercentileRequired: 95, // For IITs
    importance: 5
  },
  {
    id: 5,
    name: "BITSAT",
    fullName: "Birla Institute of Technology and Science Admission Test",
    forEducationLevel: "12th",
    forCareerPath: ["engineering"],
    eligibility: "12th pass with minimum 75% in PCM",
    examMonth: "May-June",
    applicationMonth: "January-March",
    officialWebsite: "https://www.bitsadmission.com",
    examLevel: "national",
    minPercentileRequired: 90,
    importance: 4
  },
  
  // After 12th - Medical
  {
    id: 6,
    name: "NEET-UG",
    fullName: "National Eligibility cum Entrance Test (Undergraduate)",
    forEducationLevel: "12th",
    forCareerPath: ["medical"],
    eligibility: "12th pass with Physics, Chemistry, Biology",
    examMonth: "May",
    applicationMonth: "December-January",
    officialWebsite: "https://neet.nta.nic.in",
    examLevel: "national",
    minPercentileRequired: 85,
    importance: 5
  },
  
  // After 12th - Law
  {
    id: 7,
    name: "CLAT",
    fullName: "Common Law Admission Test",
    forEducationLevel: "12th",
    forCareerPath: ["law"],
    eligibility: "12th pass with minimum 45%",
    examMonth: "May",
    applicationMonth: "January-March",
    officialWebsite: "https://consortiumofnlus.ac.in",
    examLevel: "national",
    minPercentileRequired: 90,
    importance: 5
  },
  
  // After 12th - Commerce/Arts
  {
    id: 8,
    name: "CUET",
    fullName: "Common University Entrance Test",
    forEducationLevel: "12th",
    forCareerPath: ["commerce", "arts", "humanities"],
    eligibility: "12th pass",
    examMonth: "May-June",
    applicationMonth: "March-April",
    officialWebsite: "https://cuet.samarth.ac.in",
    examLevel: "national",
    minPercentileRequired: 80,
    importance: 4
  },
  {
    id: 9,
    name: "DU JAT",
    fullName: "Delhi University Joint Admission Test",
    forEducationLevel: "12th",
    forCareerPath: ["commerce", "business"],
    eligibility: "12th pass",
    examMonth: "June",
    applicationMonth: "April-May",
    officialWebsite: "https://admission.uod.ac.in",
    examLevel: "university",
    minPercentileRequired: 85,
    importance: 4
  },
  
  // After Graduation - Management
  {
    id: 10,
    name: "CAT",
    fullName: "Common Admission Test",
    forEducationLevel: "graduation",
    forCareerPath: ["business", "management"],
    eligibility: "Bachelor's degree with 50% marks",
    examMonth: "November",
    applicationMonth: "August-September",
    officialWebsite: "https://iimcat.ac.in",
    examLevel: "national",
    minPercentileRequired: 90,
    importance: 5
  },
  {
    id: 11,
    name: "XAT",
    fullName: "Xavier Aptitude Test",
    forEducationLevel: "graduation",
    forCareerPath: ["business", "management"],
    eligibility: "Bachelor's degree in any discipline",
    examMonth: "January",
    applicationMonth: "August-December",
    officialWebsite: "https://xatonline.in",
    examLevel: "national",
    minPercentileRequired: 85,
    importance: 4
  },
  
  // After Graduation - Civil Services
  {
    id: 12,
    name: "UPSC CSE",
    fullName: "Union Public Service Commission Civil Services Examination",
    forEducationLevel: "graduation",
    forCareerPath: ["civilservice"],
    eligibility: "Bachelor's degree in any discipline",
    examMonth: "May-June (Prelims), September (Mains)",
    applicationMonth: "February-March",
    officialWebsite: "https://upsc.gov.in",
    examLevel: "national",
    minPercentileRequired: 99,
    importance: 5
  },
  
  // After Graduation - Engineering/Tech
  {
    id: 13,
    name: "GATE",
    fullName: "Graduate Aptitude Test in Engineering",
    forEducationLevel: "graduation",
    forCareerPath: ["engineering", "research"],
    eligibility: "B.E/B.Tech or in final year",
    examMonth: "February",
    applicationMonth: "September-October",
    officialWebsite: "https://gate.iitk.ac.in",
    examLevel: "national",
    minPercentileRequired: 85,
    importance: 5
  },
  
  // After Graduation - Research/Academia
  {
    id: 14,
    name: "NET",
    fullName: "National Eligibility Test",
    forEducationLevel: "graduation",
    forCareerPath: ["research", "teaching"],
    eligibility: "Master's degree with 55% marks",
    examMonth: "June, December",
    applicationMonth: "March, September",
    officialWebsite: "https://ugcnet.nta.nic.in",
    examLevel: "national",
    minPercentileRequired: 90,
    importance: 4
  }
];

// College data based on budget categories
export const colleges: College[] = [
  // Low Budget - Engineering
  {
    id: 1,
    name: "Government Engineering College, Thrissur",
    location: "Kerala",
    type: "government",
    forCareerPath: ["engineering"],
    courses: ["B.Tech in various disciplines"],
    entranceExams: ["State Engineering Entrance", "JEE Main"],
    feesRange: "₹30,000 - ₹50,000 per year",
    budgetCategory: "low",
    ranking: 80,
    websiteUrl: "https://gectcr.ac.in"
  },
  {
    id: 2,
    name: "University College of Engineering, Osmania University",
    location: "Hyderabad",
    type: "government",
    forCareerPath: ["engineering"],
    courses: ["B.Tech in Computer Science, Civil, Mechanical"],
    entranceExams: ["TS EAMCET", "JEE Main"],
    feesRange: "₹25,000 - ₹40,000 per year",
    budgetCategory: "low",
    ranking: 85,
    websiteUrl: "https://www.osmania.ac.in"
  },
  
  // Medium Budget - Engineering
  {
    id: 3,
    name: "PES University",
    location: "Bangalore",
    type: "private",
    forCareerPath: ["engineering", "computer science"],
    courses: ["B.Tech in various disciplines"],
    entranceExams: ["PESSAT", "KCET", "JEE Main"],
    feesRange: "₹1.5L - ₹2.5L per year",
    budgetCategory: "medium",
    ranking: 40,
    websiteUrl: "https://www.pes.edu"
  },
  {
    id: 4,
    name: "Manipal Institute of Technology",
    location: "Manipal",
    type: "private",
    forCareerPath: ["engineering"],
    courses: ["B.Tech in various disciplines"],
    entranceExams: ["MET", "JEE Main"],
    feesRange: "₹2.5L - ₹3.5L per year",
    budgetCategory: "medium",
    ranking: 35,
    websiteUrl: "https://manipal.edu/mit"
  },
  
  // High Budget - Engineering
  {
    id: 5,
    name: "BITS Pilani",
    location: "Pilani, Goa, Hyderabad",
    type: "private",
    forCareerPath: ["engineering"],
    courses: ["B.E. in various disciplines"],
    entranceExams: ["BITSAT"],
    feesRange: "₹4L - ₹5L per year",
    budgetCategory: "high",
    ranking: 15,
    websiteUrl: "https://www.bits-pilani.ac.in"
  },
  
  // Low Budget - Medical
  {
    id: 6,
    name: "Government Medical College, Kozhikode",
    location: "Kerala",
    type: "government",
    forCareerPath: ["medical"],
    courses: ["MBBS", "BDS"],
    entranceExams: ["NEET-UG"],
    feesRange: "₹50,000 - ₹1L per year",
    budgetCategory: "low",
    ranking: 60,
    websiteUrl: "https://www.gmckld.edu.in"
  },
  
  // Medium Budget - Medical
  {
    id: 7,
    name: "Kasturba Medical College",
    location: "Manipal",
    type: "private",
    forCareerPath: ["medical"],
    courses: ["MBBS", "MD/MS"],
    entranceExams: ["NEET-UG", "NEET-PG"],
    feesRange: "₹6L - ₹8L per year",
    budgetCategory: "medium",
    ranking: 25,
    websiteUrl: "https://manipal.edu/kmc-manipal"
  },
  
  // Low Budget - Commerce
  {
    id: 8,
    name: "Shri Ram College of Commerce",
    location: "Delhi",
    type: "government",
    forCareerPath: ["commerce", "business"],
    courses: ["B.Com (Hons)", "Economics"],
    entranceExams: ["CUET", "University Entrance"],
    feesRange: "₹20,000 - ₹40,000 per year",
    budgetCategory: "low",
    ranking: 20,
    websiteUrl: "https://www.srcc.edu"
  },
  
  // Medium Budget - Law
  {
    id: 9,
    name: "Symbiosis Law School",
    location: "Pune",
    type: "private",
    forCareerPath: ["law"],
    courses: ["BA LLB", "BBA LLB"],
    entranceExams: ["SLAT", "CLAT"],
    feesRange: "₹3L - ₹4L per year",
    budgetCategory: "medium",
    ranking: 30,
    websiteUrl: "https://www.symlaw.ac.in"
  },
  
  // Low Budget - Management
  {
    id: 10,
    name: "Faculty of Management Studies",
    location: "Delhi",
    type: "government",
    forCareerPath: ["business", "management"],
    courses: ["MBA", "EMBA"],
    entranceExams: ["CAT", "XAT"],
    feesRange: "₹25,000 - ₹50,000 per year",
    budgetCategory: "low",
    ranking: 25,
    websiteUrl: "https://fms.edu"
  },
  
  // High Budget - Management
  {
    id: 11,
    name: "Indian School of Business",
    location: "Hyderabad",
    type: "private",
    forCareerPath: ["business", "management"],
    courses: ["PGP in Management"],
    entranceExams: ["GMAT", "GRE"],
    feesRange: "₹25L - ₹35L total",
    budgetCategory: "high",
    ranking: 5,
    websiteUrl: "https://www.isb.edu"
  },
  
  // Medium Budget - Arts & Humanities
  {
    id: 12,
    name: "Christ University",
    location: "Bangalore",
    type: "private",
    forCareerPath: ["arts", "humanities"],
    courses: ["BA in various disciplines"],
    entranceExams: ["University Entrance Test"],
    feesRange: "₹1.2L - ₹2L per year",
    budgetCategory: "medium",
    ranking: 45,
    websiteUrl: "https://www.christuniversity.in"
  }
];

/**
 * Get entrance exams by education level
 */
export function getEntranceExamsByEducationLevel(level: string): EntranceExam[] {
  return entranceExams.filter(exam => exam.forEducationLevel === level);
}

/**
 * Get entrance exams by career path
 */
export function getEntranceExamsByCareerPath(path: string): EntranceExam[] {
  return entranceExams.filter(exam => exam.forCareerPath.includes(path) || exam.forCareerPath.includes('any'));
}

/**
 * Get colleges by budget category
 */
export function getCollegesByBudget(budget: string): College[] {
  let budgetCategory: "low" | "medium" | "high" | "veryhigh";
  
  switch(budget) {
    case "low":
      budgetCategory = "low";
      break;
    case "medium":
      budgetCategory = "medium";
      break;
    case "high":
      budgetCategory = "high";
      break;
    case "veryhigh":
      budgetCategory = "veryhigh";
      break;
    default:
      budgetCategory = "medium";
  }
  
  return colleges.filter(college => college.budgetCategory === budgetCategory);
}

/**
 * Get colleges by career path
 */
export function getCollegesByCareerPath(path: string): College[] {
  return colleges.filter(college => college.forCareerPath.includes(path));
}

/**
 * Get colleges by entrance exam
 */
export function getCollegesByEntranceExam(examName: string): College[] {
  return colleges.filter(college => college.entranceExams.includes(examName));
}

/**
 * Get colleges filtered by multiple criteria
 */
export function getCollegesByFilters(careerPath: string, budget: string, examName?: string): College[] {
  let result = colleges.filter(college => 
    college.forCareerPath.includes(careerPath)
  );
  
  // Apply budget filter
  if (budget) {
    let budgetCategory: "low" | "medium" | "high" | "veryhigh";
    
    switch(budget) {
      case "low":
        budgetCategory = "low";
        break;
      case "medium":
        budgetCategory = "medium";
        break;
      case "high":
      case "veryhigh":
        budgetCategory = "high";
        break;
      default:
        budgetCategory = "medium";
    }
    
    result = result.filter(college => college.budgetCategory === budgetCategory);
  }
  
  // Apply exam filter if provided
  if (examName) {
    result = result.filter(college => college.entranceExams.includes(examName));
  }
  
  return result;
}