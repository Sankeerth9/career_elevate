// College data for recommendations

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

// Sample college data
export const colleges: College[] = [
  {
    id: 1,
    name: "Indian Institute of Technology (IIT), Bombay",
    location: "Mumbai, Maharashtra",
    type: "government",
    forCareerPath: ["Engineering", "Technology"],
    courses: ["B.Tech", "M.Tech", "Ph.D"],
    entranceExams: ["JEE Advanced", "GATE"],
    feesRange: "₹2-3 lakhs per year",
    budgetCategory: "medium",
    ranking: 1,
    websiteUrl: "https://www.iitb.ac.in/"
  },
  {
    id: 2,
    name: "All India Institute of Medical Sciences (AIIMS)",
    location: "New Delhi",
    type: "government",
    forCareerPath: ["Medical", "Healthcare"],
    courses: ["MBBS", "MD", "MS", "Ph.D"],
    entranceExams: ["NEET-UG", "AIIMS PG"],
    feesRange: "₹ 50,000 - 1 lakh per year",
    budgetCategory: "low",
    ranking: 1,
    websiteUrl: "https://www.aiims.edu/"
  },
  {
    id: 3,
    name: "National Law School of India University (NLSIU)",
    location: "Bangalore, Karnataka",
    type: "government",
    forCareerPath: ["Law", "Legal Studies"],
    courses: ["B.A. LL.B", "LL.M", "Ph.D"],
    entranceExams: ["CLAT", "AILET"],
    feesRange: "₹2-2.5 lakhs per year",
    budgetCategory: "medium",
    ranking: 1,
    websiteUrl: "https://www.nls.ac.in/"
  },
  {
    id: 4,
    name: "Indian Institute of Management (IIM)",
    location: "Ahmedabad, Gujarat",
    type: "government",
    forCareerPath: ["Management", "Business", "Commerce"],
    courses: ["MBA", "PGDM", "Ph.D"],
    entranceExams: ["CAT", "GMAT"],
    feesRange: "₹20-25 lakhs for 2 years",
    budgetCategory: "high",
    ranking: 1,
    websiteUrl: "https://www.iima.ac.in/"
  },
  {
    id: 5,
    name: "VIT University",
    location: "Vellore, Tamil Nadu",
    type: "private",
    forCareerPath: ["Engineering", "Technology"],
    courses: ["B.Tech", "M.Tech", "BCA", "MCA"],
    entranceExams: ["VITEEE"],
    feesRange: "₹4-5 lakhs per year",
    budgetCategory: "high",
    ranking: 12,
    websiteUrl: "https://vit.ac.in/"
  },
  {
    id: 6,
    name: "Government Medical College",
    location: "Multiple locations across India",
    type: "government",
    forCareerPath: ["Medical", "Healthcare"],
    courses: ["MBBS", "MD", "MS"],
    entranceExams: ["NEET-UG", "NEET-PG"],
    feesRange: "₹25,000 - 75,000 per year",
    budgetCategory: "low",
    ranking: 15,
    websiteUrl: "https://www.mciindia.org/"
  },
  {
    id: 7,
    name: "Manipal Institute of Technology",
    location: "Manipal, Karnataka",
    type: "private",
    forCareerPath: ["Engineering", "Technology"],
    courses: ["B.Tech", "M.Tech"],
    entranceExams: ["MET"],
    feesRange: "₹5-6 lakhs per year",
    budgetCategory: "high",
    ranking: 7,
    websiteUrl: "https://manipal.edu/mit.html"
  },
  {
    id: 8,
    name: "National Institute of Technology (NIT)",
    location: "Multiple locations across India",
    type: "government",
    forCareerPath: ["Engineering", "Technology"],
    courses: ["B.Tech", "M.Tech", "Ph.D"],
    entranceExams: ["JEE Main", "GATE"],
    feesRange: "₹1-2 lakhs per year",
    budgetCategory: "low",
    ranking: 4,
    websiteUrl: "https://www.nitk.ac.in/"
  },
  {
    id: 9,
    name: "Symbiosis Law School",
    location: "Pune, Maharashtra",
    type: "private",
    forCareerPath: ["Law", "Legal Studies"],
    courses: ["B.A. LL.B", "LL.M"],
    entranceExams: ["SLAT", "CLAT"],
    feesRange: "₹3-4 lakhs per year",
    budgetCategory: "high",
    ranking: 5,
    websiteUrl: "https://www.symlaw.ac.in/"
  },
  {
    id: 10,
    name: "St. Xavier's College",
    location: "Mumbai, Maharashtra",
    type: "private",
    forCareerPath: ["Arts", "Science", "Commerce"],
    courses: ["B.A.", "B.Sc.", "B.Com", "M.A.", "M.Sc."],
    entranceExams: ["Xavier's Entrance Test"],
    feesRange: "₹30,000 - 60,000 per year",
    budgetCategory: "medium",
    ranking: 3,
    websiteUrl: "https://www.xaviers.edu/"
  },
  {
    id: 11,
    name: "BITS Pilani",
    location: "Pilani, Rajasthan",
    type: "deemed",
    forCareerPath: ["Engineering", "Technology"],
    courses: ["B.E.", "M.E.", "Ph.D"],
    entranceExams: ["BITSAT"],
    feesRange: "₹4-5 lakhs per year",
    budgetCategory: "high",
    ranking: 3,
    websiteUrl: "https://www.bits-pilani.ac.in/"
  },
  {
    id: 12,
    name: "Lady Shri Ram College for Women",
    location: "New Delhi",
    type: "government",
    forCareerPath: ["Arts", "Humanities", "Social Sciences"],
    courses: ["B.A.", "M.A."],
    entranceExams: ["DU Entrance", "CUET"],
    feesRange: "₹20,000 - 40,000 per year",
    budgetCategory: "low",
    ranking: 2,
    websiteUrl: "https://lsr.edu.in/"
  },
  {
    id: 13,
    name: "CMR University",
    location: "Bangalore, Karnataka",
    type: "private",
    forCareerPath: ["Engineering", "Management", "Law"],
    courses: ["B.Tech", "MBA", "LL.B", "BBA"],
    entranceExams: ["CMRUAT", "CAT", "CLAT"],
    feesRange: "₹2-3 lakhs per year",
    budgetCategory: "medium",
    ranking: 25,
    websiteUrl: "https://www.cmr.edu.in/"
  },
  {
    id: 14,
    name: "Christian Medical College",
    location: "Vellore, Tamil Nadu",
    type: "private",
    forCareerPath: ["Medical", "Healthcare"],
    courses: ["MBBS", "MD", "MS", "BSc Nursing"],
    entranceExams: ["NEET-UG", "CMC Vellore Entrance"],
    feesRange: "₹3.5-4 lakhs per year",
    budgetCategory: "high",
    ranking: 3,
    websiteUrl: "https://www.cmch-vellore.edu/"
  },
  {
    id: 15,
    name: "NALSAR University of Law",
    location: "Hyderabad, Telangana",
    type: "government",
    forCareerPath: ["Law", "Legal Studies"],
    courses: ["B.A. LL.B", "LL.M", "Ph.D"],
    entranceExams: ["CLAT"],
    feesRange: "₹2-2.5 lakhs per year",
    budgetCategory: "medium",
    ranking: 3,
    websiteUrl: "https://www.nalsar.ac.in/"
  },
  {
    id: 16,
    name: "SASTRA University",
    location: "Thanjavur, Tamil Nadu",
    type: "deemed",
    forCareerPath: ["Engineering", "Technology", "Law", "Management"],
    courses: ["B.Tech", "M.Tech", "MBA", "LL.B"],
    entranceExams: ["SASTRA Entrance", "JEE Main"],
    feesRange: "₹1.5-2 lakhs per year",
    budgetCategory: "medium",
    ranking: 8,
    websiteUrl: "https://www.sastra.edu/"
  },
  {
    id: 17,
    name: "Delhi Technological University",
    location: "Delhi",
    type: "government",
    forCareerPath: ["Engineering", "Technology"],
    courses: ["B.Tech", "M.Tech", "Ph.D"],
    entranceExams: ["JEE Main", "GATE"],
    feesRange: "₹1-1.5 lakhs per year",
    budgetCategory: "low",
    ranking: 6,
    websiteUrl: "http://dtu.ac.in/"
  },
  {
    id: 18,
    name: "Tata Institute of Social Sciences",
    location: "Mumbai, Maharashtra",
    type: "government",
    forCareerPath: ["Social Sciences", "Social Work", "Management"],
    courses: ["B.A.", "M.A.", "MBA", "Ph.D"],
    entranceExams: ["TISSNET"],
    feesRange: "₹50,000 - 1 lakh per year",
    budgetCategory: "low",
    ranking: 1,
    websiteUrl: "https://www.tiss.edu/"
  },
  {
    id: 19,
    name: "SRM Institute of Science and Technology",
    location: "Chennai, Tamil Nadu",
    type: "private",
    forCareerPath: ["Engineering", "Medicine", "Management"],
    courses: ["B.Tech", "MBBS", "MBA"],
    entranceExams: ["SRMJEEE", "NEET-UG"],
    feesRange: "₹4-5 lakhs per year",
    budgetCategory: "high",
    ranking: 15,
    websiteUrl: "https://www.srmist.edu.in/"
  },
  {
    id: 20,
    name: "Chandigarh University",
    location: "Chandigarh",
    type: "private",
    forCareerPath: ["Engineering", "Management", "Law", "Arts"],
    courses: ["B.Tech", "MBA", "LL.B", "B.A."],
    entranceExams: ["CUCET"],
    feesRange: "₹2-3 lakhs per year",
    budgetCategory: "medium",
    ranking: 29,
    websiteUrl: "https://www.cuchd.in/"
  },
];

// Get colleges by budget category
export function getCollegesByBudget(budget: string): College[] {
  return colleges.filter(college => college.budgetCategory === budget);
}

// Get colleges by career path
export function getCollegesByCareerPath(careerPath: string): College[] {
  return colleges.filter(college => 
    college.forCareerPath.some(path => 
      path.toLowerCase().includes(careerPath.toLowerCase())
    )
  );
}

// Get top-ranked colleges
export function getTopRankedColleges(limit: number = 5): College[] {
  return [...colleges].sort((a, b) => a.ranking - b.ranking).slice(0, limit);
}

// Get colleges by entrance exam
export function getCollegesByEntranceExam(examName: string): College[] {
  return colleges.filter(college => 
    college.entranceExams.some(exam => 
      exam.toLowerCase().includes(examName.toLowerCase())
    )
  );
}

// Get colleges filtered by multiple criteria
export function getCollegesByFilters(careerPath: string, budget: string, examName?: string): College[] {
  let filteredColleges = colleges.filter(college => 
    college.forCareerPath.some(path => 
      path.toLowerCase().includes(careerPath.toLowerCase())
    ) && 
    college.budgetCategory === budget
  );
  
  // Further filter by entrance exam if provided
  if (examName) {
    filteredColleges = filteredColleges.filter(college => 
      college.entranceExams.some(exam => 
        exam.toLowerCase().includes(examName.toLowerCase())
      )
    );
  }
  
  return filteredColleges.sort((a, b) => a.ranking - b.ranking);
}