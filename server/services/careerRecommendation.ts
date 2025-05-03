import { CareerAssessment } from "@shared/schema";
import { storage } from "../storage";

export interface Recommendation {
  pathwayId: number;
  score: number;
  reason: string;
  careerOptions: string[];
  estimatedSalary: string;
  growthPotential: string;
  suggestedCourses: string[];
  // Additional fields for AI-enhanced recommendations (optional)
  strengthsMatchScore?: number;
  weaknessAreas?: string[];
  timeToEmployment?: string;
  regionalDemand?: {
    region: string;
    demandLevel: "high" | "medium" | "low";
    notes: string;
  }[];
  // New fields for enhanced education recommendations
  entranceExams?: string;
  recommendedColleges?: string;
  budgetCategory?: string;
}

/**
 * Gets career recommendations based on user assessment using AI
 */
export async function getCareerRecommendations(assessment: CareerAssessment): Promise<Recommendation[]> {
  // Remove any OpenAI-related code or fallback logic
  // ... existing code ...
}

/**
 * Converts AI-specific recommendations to standard format
 */
function convertAiRecommendationsToStandard(aiRecommendations: AiCareerRecommendation[]): Recommendation[] {
  return aiRecommendations.map(rec => ({
    pathwayId: rec.pathwayId,
    score: rec.score,
    reason: rec.reason,
    careerOptions: rec.careerOptions,
    estimatedSalary: rec.estimatedSalary,
    growthPotential: rec.growthPotential,
    suggestedCourses: rec.suggestedCourses,
    strengthsMatchScore: rec.strengthsMatchScore,
    weaknessAreas: rec.weaknessAreas,
    timeToEmployment: rec.timeToEmployment,
    regionalDemand: rec.regionalDemand
  }));
}

/**
 * Creates generic career recommendations based on education level
 * Used as a fallback when no pathways exist in the database
 */
import { 
  getEntranceExamsByEducationLevel, 
  getEntranceExamsByCareerPath,
  getCollegesByFilters,
  EntranceExam,
  College
} from './entranceExamData';

interface EnhancedRecommendation {
  id: number;
  title: string;
  careerOptions: string[];
  suggestedCourses: string[];
  requiredExams: EntranceExam[];
  suggestedColleges: College[];
  salaryRange: string;
  growthPotential: string;
}

function createGenericRecommendations(assessment: CareerAssessment): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Default fields by education level
  const fields: Record<string, { id: number, title: string, careerPath: string, careers: string[], courses: string[], salary: string, growth: string }[]> = {
    "10th": [
      {
        id: 101,
        title: "Technical Trades",
        careerPath: "engineering",
        careers: ["Electrician", "Plumber", "HVAC Technician", "Automotive Mechanic"],
        courses: ["ITI Certificate", "Technical Diploma", "Apprenticeship Programs"],
        salary: "₹1.8L - ₹4L",
        growth: "Steady"
      },
      {
        id: 102,
        title: "Service Industry",
        careerPath: "business",
        careers: ["Retail Associate", "Customer Service Representative", "Hospitality Staff"],
        courses: ["Short-term Certificate Programs", "On-the-job Training"],
        salary: "₹1.5L - ₹3L",
        growth: "Moderate"
      }
    ],
    "12th": [
      {
        id: 201,
        title: "Engineering Pathway",
        careerPath: "engineering",
        careers: ["Engineer", "Technician", "IT Professional", "Product Designer"],
        courses: ["B.Tech", "B.E.", "Polytechnic Diploma"],
        salary: "₹3.5L - ₹12L",
        growth: "High"
      },
      {
        id: 202,
        title: "Medical Pathway",
        careerPath: "medical",
        careers: ["Doctor", "Dentist", "Pharmacist", "Allied Health Professional"],
        courses: ["MBBS", "BDS", "B.Pharm", "Allied Health Courses"],
        salary: "₹5L - ₹40L",
        growth: "Very High"
      },
      {
        id: 203,
        title: "Commerce Pathway",
        careerPath: "commerce",
        careers: ["Accountant", "Business Analyst", "Financial Advisor", "Bank PO"],
        courses: ["B.Com", "BBA", "Chartered Accountancy", "Company Secretary"],
        salary: "₹3L - ₹10L",
        growth: "Steady"
      },
      {
        id: 204,
        title: "Law Pathway",
        careerPath: "law",
        careers: ["Lawyer", "Legal Advisor", "Corporate Legal Counsel", "Judicial Services"],
        courses: ["LLB", "Integrated Law Programs"],
        salary: "₹4L - ₹25L",
        growth: "Good"
      }
    ],
    "graduation": [
      {
        id: 301,
        title: "Management & Business",
        careerPath: "business",
        careers: ["Business Manager", "Consultant", "Marketing Specialist", "Financial Analyst"],
        courses: ["MBA", "PGDM", "Specialized Management Programs"],
        salary: "₹6L - ₹20L",
        growth: "High"
      },
      {
        id: 302,
        title: "Technology & IT",
        careerPath: "engineering",
        careers: ["Software Engineer", "Data Scientist", "AI Specialist", "Cloud Architect"],
        courses: ["M.Tech", "MCA", "Specialized Tech Certifications"],
        salary: "₹5L - ₹25L",
        growth: "Very High"
      },
      {
        id: 303,
        title: "Civil Services",
        careerPath: "civilservice",
        careers: ["IAS Officer", "IPS Officer", "IRS Officer", "State Civil Services"],
        courses: ["Civil Services Coaching", "Public Administration Courses"],
        salary: "₹6L - ₹15L",
        growth: "Stable"
      },
      {
        id: 304,
        title: "Higher Education & Research",
        careerPath: "research",
        careers: ["Researcher", "Professor", "Scientist", "Education Specialist"],
        courses: ["PhD", "M.Phil", "Research Programs"],
        salary: "₹5L - ₹15L",
        growth: "Moderate"
      }
    ],
    "post_graduation": [
      {
        id: 401,
        title: "Executive Management",
        careerPath: "business",
        careers: ["Senior Manager", "Director", "C-Suite Executive", "Management Consultant"],
        courses: ["Executive MBA", "Leadership Development", "Project Management Professional"],
        salary: "₹15L - ₹50L+",
        growth: "Excellent"
      },
      {
        id: 402,
        title: "Specialized Research",
        careerPath: "research",
        careers: ["Principal Researcher", "R&D Head", "Chief Scientist", "Academic Director"],
        courses: ["Post-Doctoral Research", "Advanced Specialization Courses"],
        salary: "₹10L - ₹30L",
        growth: "High"
      },
      {
        id: 403,
        title: "Policy & Governance",
        careerPath: "civilservice",
        careers: ["Policy Analyst", "Think Tank Researcher", "International Relations Specialist"],
        courses: ["Policy Analysis Programs", "Governance Studies", "International Relations"],
        salary: "₹10L - ₹25L",
        growth: "Moderate"
      }
    ]
  };
  
  // Get fields for the selected education level or default to graduation
  const eduLevel = assessment.educationLevel || "graduation";
  const relevantFields = fields[eduLevel] || fields["graduation"];
  
  // Create a recommendation for each field
  for (const field of relevantFields) {
    let score = 70;
    let reason = `Based on your ${eduLevel} education level`;
    
    // Adjust score based on career aim if available
    if (assessment.careerAim) {
      if (field.careerPath.toLowerCase() === assessment.careerAim.toLowerCase() ||
          field.title.toLowerCase().includes(assessment.careerAim.toLowerCase())) {
        score += 20;
        reason += ` and interest in ${assessment.careerAim}`;
      }
    }
    
    // Adjust for interests if available
    if (assessment.interests && assessment.interests.length > 0) {
      score += 8;
      reason += ` with consideration for your personal interests`;
    }
    
    // Get relevant entrance exams
    const entranceExams = getEntranceExamsByEducationLevel(eduLevel);
    const careerExams = getEntranceExamsByCareerPath(field.careerPath);
    
    // Find exams that match both education level and career path
    const relevantExams = entranceExams.filter(exam => 
      careerExams.some(careerExam => careerExam.id === exam.id)
    );
    
    // Get college recommendations based on budget
    const budgetLevel = assessment.budget || "medium";
    const collegeRecommendations = getCollegesByFilters(field.careerPath, budgetLevel);
    
    // Format entrance exam info
    const entranceExamInfo = relevantExams.length > 0 
      ? relevantExams.map(exam => `${exam.name}: ${exam.fullName} (${exam.minPercentileRequired}th percentile required)`).join(", ")
      : "No specific entrance exams required";
    
    // Format college recommendations
    const collegeInfo = collegeRecommendations.length > 0
      ? collegeRecommendations.slice(0, 3).map(college => college.name).join(", ")
      : "Explore colleges based on your location preference";
    
    recommendations.push({
      pathwayId: field.id,
      score: score,
      reason: reason,
      careerOptions: field.careers,
      estimatedSalary: field.salary,
      growthPotential: field.growth,
      suggestedCourses: field.courses,
      timeToEmployment: eduLevel === "10th" || eduLevel === "12th" ? "6-18 months" : "1-3 years",
      // Add entrance exam and college information
      entranceExams: entranceExamInfo,
      recommendedColleges: collegeInfo,
      budgetCategory: budgetLevel
    });
  }
  
  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);
  
  return recommendations;
}

export async function getBasicRecommendations(assessment: CareerAssessment): Promise<Recommendation[]> {
  // Get all educational pathways
  const allPathways = await storage.getAllEducationalPathways();
  
  // Create recommendations based on the assessment data
  const recommendations: Recommendation[] = [];
  
  // Ensure we have pathways to work with
  if (!allPathways || allPathways.length === 0) {
    // If no pathways exist, create generic ones based on common career fields
    const genericRecommendations = createGenericRecommendations(assessment);
    return genericRecommendations;
  }
  
  // Basic matching algorithm
  for (const pathway of allPathways) {
    // Skip pathways that don't match the education level
    if (assessment.educationLevel && 
        pathway.afterEducationLevel !== assessment.educationLevel) {
      continue;
    }
    
    // Calculate a simplistic score based on matching criteria
    let score = 60; // Base score
    let reason = "Matches your educational background";
    
    // Determine career path based on pathway title
    let careerPath = "general";
    if (pathway.title?.toLowerCase().includes("engineering")) careerPath = "engineering";
    else if (pathway.title?.toLowerCase().includes("medical")) careerPath = "medical";
    else if (pathway.title?.toLowerCase().includes("law")) careerPath = "law";
    else if (pathway.title?.toLowerCase().includes("commerce") || pathway.title?.toLowerCase().includes("business")) careerPath = "commerce";
    else if (pathway.title?.toLowerCase().includes("art") || pathway.title?.toLowerCase().includes("design")) careerPath = "arts";
    else if (pathway.title?.toLowerCase().includes("civil service")) careerPath = "civilservice";
    
    // Adjust score based on career aim
    if (assessment.careerAim) {
      if (pathway.title && pathway.title.toLowerCase().includes(assessment.careerAim.toLowerCase())) {
        score += 25;
        reason += " and career aim";
      }
    }
    
    // Adjust score based on interests if present
    if (assessment.interests && assessment.interests.length > 0) {
      score += 10;
      reason += " and personal interests";
    }
    
    // Sample career options based on pathway
    let careerOptions: string[] = [];
    let estimatedSalary = "₹4L - ₹12L";
    let growthPotential = "Moderate";
    let suggestedCourses: string[] = [];
    
    // Customize recommendations based on pathway
    switch (pathway.title) {
      case "Engineering Path":
        careerOptions = ["Software Engineer", "Data Scientist", "IoT Specialist", "Product Manager"];
        estimatedSalary = "₹6L - ₹25L";
        growthPotential = "High";
        suggestedCourses = ["Computer Science", "Electronics", "Mechanical Engineering", "Civil Engineering"];
        careerPath = "engineering";
        break;
      case "Medical Path":
        careerOptions = ["Doctor", "Surgeon", "Medical Researcher", "Healthcare Administrator"];
        estimatedSalary = "₹8L - ₹40L";
        growthPotential = "Very High";
        suggestedCourses = ["MBBS", "BDS", "BHMS", "BAMS"];
        careerPath = "medical";
        break;
      case "Law Path":
        careerOptions = ["Corporate Lawyer", "Criminal Lawyer", "Judge", "Legal Consultant"];
        estimatedSalary = "₹5L - ₹30L";
        growthPotential = "Good";
        suggestedCourses = ["LLB", "LLM", "Intellectual Property Law", "Corporate Law"];
        careerPath = "law";
        break;
      default:
        careerOptions = ["Professional", "Manager", "Consultant", "Entrepreneur"];
        break;
    }
    
    // Get relevant entrance exams based on education level and career path
    const eduLevel = assessment.educationLevel || "graduation";
    const entranceExams = getEntranceExamsByEducationLevel(eduLevel);
    const careerExams = getEntranceExamsByCareerPath(careerPath);
    
    // Find exams that match both education level and career path
    const relevantExams = entranceExams.filter(exam => 
      careerExams.some(careerExam => careerExam.id === exam.id)
    );
    
    // Get college recommendations based on budget and career path
    const budgetLevel = assessment.budget || "medium";
    const collegeRecommendations = getCollegesByFilters(careerPath, budgetLevel);
    
    // Format entrance exam info
    const entranceExamInfo = relevantExams.length > 0 
      ? relevantExams.map(exam => `${exam.name}: ${exam.fullName} (${exam.minPercentileRequired}th percentile required)`).join(", ")
      : "No specific entrance exams required";
    
    // Format college recommendations
    const collegeInfo = collegeRecommendations.length > 0
      ? collegeRecommendations.slice(0, 3).map(college => college.name).join(", ")
      : "Explore colleges based on your location preference";
    
    // Create recommendation
    recommendations.push({
      pathwayId: pathway.id,
      score,
      reason,
      careerOptions,
      estimatedSalary,
      growthPotential,
      suggestedCourses,
      // Add entrance exam and college information
      entranceExams: entranceExamInfo,
      recommendedColleges: collegeInfo,
      budgetCategory: budgetLevel,
      timeToEmployment: eduLevel === "10th" || eduLevel === "12th" ? "6-18 months" : "1-3 years"
    });
  }
  
  // Sort recommendations by score (highest first)
  recommendations.sort((a, b) => b.score - a.score);
  
  return recommendations;
}
