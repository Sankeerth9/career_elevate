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
 * Basic recommendation engine as fallback if AI fails
 */
async function getBasicRecommendations(assessment: CareerAssessment): Promise<Recommendation[]> {
  // Get all educational pathways
  const allPathways = await storage.getAllEducationalPathways();
  
  // Create recommendations based on the assessment data
  const recommendations: Recommendation[] = [];
  
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
      if (pathway.title.toLowerCase().includes(assessment.careerAim.toLowerCase())) {
        score += 25;
        reason += " and career aim";
      }
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
