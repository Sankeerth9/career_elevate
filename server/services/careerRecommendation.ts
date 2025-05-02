import { CareerAssessment } from "@shared/schema";
import { storage } from "../storage";
import { getAiCareerRecommendations, AiCareerRecommendation } from "./openai";

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
}

/**
 * Gets career recommendations based on user assessment using AI
 */
export async function getCareerRecommendations(assessment: CareerAssessment): Promise<Recommendation[]> {
  try {
    // Get all educational pathways
    const allPathways = await storage.getAllEducationalPathways();
    
    // Get AI-powered recommendations
    const aiRecommendations = await getAiCareerRecommendations(assessment, allPathways);
    
    // Convert AI recommendations to standard recommendation format
    const recommendations = convertAiRecommendationsToStandard(aiRecommendations);
    
    return recommendations;
  } catch (error) {
    console.error("Error getting AI career recommendations:", error);
    
    // Fallback to basic recommendations if AI fails
    return getBasicRecommendations(assessment);
  }
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
function createGenericRecommendations(assessment: CareerAssessment): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Default fields by education level
  const fields: Record<string, { id: number, title: string, careers: string[], courses: string[], salary: string, growth: string }[]> = {
    "10th": [
      {
        id: 101,
        title: "Technical Trades",
        careers: ["Electrician", "Plumber", "HVAC Technician", "Automotive Mechanic"],
        courses: ["ITI Certificate", "Technical Diploma", "Apprenticeship Programs"],
        salary: "₹1.8L - ₹4L",
        growth: "Steady"
      },
      {
        id: 102,
        title: "Service Industry",
        careers: ["Retail Associate", "Customer Service Representative", "Hospitality Staff"],
        courses: ["Short-term Certificate Programs", "On-the-job Training"],
        salary: "₹1.5L - ₹3L",
        growth: "Moderate"
      }
    ],
    "12th": [
      {
        id: 201,
        title: "Technical Education",
        careers: ["Technician", "Lab Assistant", "Computer Operator", "Junior Engineer"],
        courses: ["Polytechnic Diploma", "Technical Certificate", "Associate Degree"],
        salary: "₹2.5L - ₹6L",
        growth: "Good"
      },
      {
        id: 202,
        title: "Administrative Work",
        careers: ["Office Assistant", "Data Entry Specialist", "Bank Clerk", "Administrative Support"],
        courses: ["BBA", "B.Com", "Certificate in Office Management"],
        salary: "₹2L - ₹5L",
        growth: "Stable"
      }
    ],
    "graduation": [
      {
        id: 301,
        title: "Professional Services",
        careers: ["Business Analyst", "HR Professional", "Marketing Associate", "Financial Advisor"],
        courses: ["MBA", "Specialized Certifications", "Professional Development Courses"],
        salary: "₹4L - ₹12L",
        growth: "High"
      },
      {
        id: 302,
        title: "Technology",
        careers: ["Software Developer", "Network Administrator", "IT Support Specialist", "Web Developer"],
        courses: ["Computer Science", "IT Certifications", "Coding Bootcamps"],
        salary: "₹3.5L - ₹18L",
        growth: "Very High"
      }
    ],
    "post_graduation": [
      {
        id: 401,
        title: "Management & Consulting",
        careers: ["Management Consultant", "Project Manager", "Strategy Advisor", "Business Development Manager"],
        courses: ["Executive MBA", "Leadership Development", "Project Management Professional"],
        salary: "₹8L - ₹25L",
        growth: "Excellent"
      },
      {
        id: 402,
        title: "Research & Development",
        careers: ["Research Scientist", "Product Developer", "Academic Researcher", "R&D Specialist"],
        courses: ["PhD", "Specialized Research Programs", "Advanced Technical Training"],
        salary: "₹6L - ₹20L",
        growth: "High"
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
      if (field.title.toLowerCase().includes(assessment.careerAim.toLowerCase())) {
        score += 15;
        reason += ` and interest in ${assessment.careerAim}`;
      }
    }
    
    // Adjust for interests if available
    if (assessment.interests && assessment.interests.length > 0) {
      score += 8;
      reason += ` with consideration for your personal interests`;
    }
    
    recommendations.push({
      pathwayId: field.id,
      score: score,
      reason: reason,
      careerOptions: field.careers,
      estimatedSalary: field.salary,
      growthPotential: field.growth,
      suggestedCourses: field.courses,
      timeToEmployment: eduLevel === "10th" || eduLevel === "12th" ? "6-18 months" : "1-3 years"
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
        break;
      case "Medical Path":
        careerOptions = ["Doctor", "Surgeon", "Medical Researcher", "Healthcare Administrator"];
        estimatedSalary = "₹8L - ₹40L";
        growthPotential = "Very High";
        suggestedCourses = ["MBBS", "BDS", "BHMS", "BAMS"];
        break;
      case "Law Path":
        careerOptions = ["Corporate Lawyer", "Criminal Lawyer", "Judge", "Legal Consultant"];
        estimatedSalary = "₹5L - ₹30L";
        growthPotential = "Good";
        suggestedCourses = ["LLB", "LLM", "Intellectual Property Law", "Corporate Law"];
        break;
      default:
        careerOptions = ["Professional", "Manager", "Consultant", "Entrepreneur"];
        break;
    }
    
    // Create recommendation
    recommendations.push({
      pathwayId: pathway.id,
      score,
      reason,
      careerOptions,
      estimatedSalary,
      growthPotential,
      suggestedCourses
    });
  }
  
  // Sort recommendations by score (highest first)
  recommendations.sort((a, b) => b.score - a.score);
  
  return recommendations;
}
