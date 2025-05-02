// This file contains educational pathway data

export interface EducationalPathway {
  id: number;
  title: string;
  description: string;
  afterEducationLevel: string;
  entranceExams: string[];
  topInstitutes: string[];
  averageFees: string;
  jobProspects: string;
  growthRate: string;
  icon: string;
}

// Sample educational pathways
export const educationalPathways: EducationalPathway[] = [
  {
    id: 1,
    title: "Engineering Path",
    description: "After 12th (Science with PCM)",
    afterEducationLevel: "12th",
    entranceExams: ["JEE Main", "JEE Advanced", "EAMCET"],
    topInstitutes: ["IITs", "NITs", "BITS", "State Universities"],
    averageFees: "₹8L - ₹15L (full course)",
    jobProspects: "High Demand",
    growthRate: "+20%",
    icon: "building"
  },
  {
    id: 2,
    title: "Medical Path",
    description: "After 12th (Science with PCB)",
    afterEducationLevel: "12th",
    entranceExams: ["NEET-UG"],
    topInstitutes: ["AIIMS", "CMC Vellore", "Govt Medical Colleges"],
    averageFees: "₹25L - ₹80L (full course)",
    jobProspects: "Very High Demand",
    growthRate: "+28%",
    icon: "heart"
  },
  {
    id: 3,
    title: "Law Path",
    description: "After 12th (Any Stream)",
    afterEducationLevel: "12th",
    entranceExams: ["CLAT", "LSAT", "AILET"],
    topInstitutes: ["NLUs", "Symbiosis", "NALSAR"],
    averageFees: "₹2.5L - ₹15L (full course)",
    jobProspects: "Good Demand",
    growthRate: "+15%",
    icon: "scale"
  },
  {
    id: 4,
    title: "Commerce Path",
    description: "After 12th (Commerce)",
    afterEducationLevel: "12th",
    entranceExams: ["CA Foundation", "CSEET", "CUET"],
    topInstitutes: ["SRCC", "Christ University", "Symbiosis"],
    averageFees: "₹1.5L - ₹8L (full course)",
    jobProspects: "Good Demand",
    growthRate: "+12%",
    icon: "banknote"
  },
  {
    id: 5,
    title: "Computer Science",
    description: "Specialization after B.Tech",
    afterEducationLevel: "graduation",
    entranceExams: ["GATE", "GRE"],
    topInstitutes: ["IISc", "IITs", "NITs", "Foreign Universities"],
    averageFees: "₹3L - ₹30L (full course)",
    jobProspects: "Very High Demand",
    growthRate: "+30%",
    icon: "code"
  },
  {
    id: 6,
    title: "MBA",
    description: "After Graduation (Any Stream)",
    afterEducationLevel: "graduation",
    entranceExams: ["CAT", "XAT", "GMAT", "MAT"],
    topInstitutes: ["IIMs", "XLRI", "ISB", "FMS", "SPJIMR"],
    averageFees: "₹5L - ₹25L (full course)",
    jobProspects: "High Demand",
    growthRate: "+18%",
    icon: "briefcase"
  },
  {
    id: 7,
    title: "Civil Services",
    description: "After Graduation (Any Stream)",
    afterEducationLevel: "graduation",
    entranceExams: ["UPSC CSE", "State PSC"],
    topInstitutes: ["Coaching: Vajiram & Ravi", "Shankar IAS", "Vision IAS"],
    averageFees: "₹1.5L - ₹5L (coaching)",
    jobProspects: "Competitive but Stable",
    growthRate: "+5%",
    icon: "landmark"
  },
  {
    id: 8,
    title: "Polytechnic Diploma",
    description: "After 10th",
    afterEducationLevel: "10th",
    entranceExams: ["State Polytechnic Entrance Tests"],
    topInstitutes: ["Government Polytechnics", "Private Polytechnics"],
    averageFees: "₹40K - ₹2L (full course)",
    jobProspects: "Good Demand",
    growthRate: "+15%",
    icon: "wrench"
  },
  {
    id: 9,
    title: "ITI Courses",
    description: "After 10th",
    afterEducationLevel: "10th",
    entranceExams: ["ITI Entrance Tests"],
    topInstitutes: ["Government ITIs", "Private ITIs"],
    averageFees: "₹20K - ₹1L (full course)",
    jobProspects: "High Demand for Skilled Trades",
    growthRate: "+22%",
    icon: "hammer"
  }
];

// Get pathways by education level
export function getPathwaysByEducationLevel(level: string): EducationalPathway[] {
  return educationalPathways.filter(
    (pathway) => pathway.afterEducationLevel === level
  );
}

// Get pathway by ID
export function getPathwayById(id: number): EducationalPathway | undefined {
  return educationalPathways.find((pathway) => pathway.id === id);
}
