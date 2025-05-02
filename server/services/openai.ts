import OpenAI from "openai";
import { CareerAssessment } from "@shared/schema";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

export interface AiCareerRecommendation {
  pathwayId: number;
  pathwayTitle: string;
  score: number;
  reason: string;
  careerOptions: string[];
  estimatedSalary: string;
  growthPotential: string;
  suggestedCourses: string[];
  strengthsMatchScore: number;
  weaknessAreas: string[];
  timeToEmployment: string;
  regionalDemand: {
    region: string;
    demandLevel: "high" | "medium" | "low";
    notes: string;
  }[];
}

/**
 * Gets AI-powered career recommendations based on user assessment
 */
export async function getAiCareerRecommendations(
  assessment: CareerAssessment, 
  availablePathways: any[]
): Promise<AiCareerRecommendation[]> {
  try {
    // Format the prompt with the assessment data and available educational pathways
    const prompt = buildPrompt(assessment, availablePathways);
    
    // Call OpenAI API for recommendations
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are an expert career counselor specializing in education and career paths in India. Your task is to analyze user assessment data and recommend appropriate educational pathways." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse the response and return the recommendations
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsed = JSON.parse(content);
    return parsed.recommendations;
  } catch (error) {
    console.error("Error getting AI career recommendations:", error);
    throw error;
  }
}

/**
 * Builds the prompt for the OpenAI API
 */
function buildPrompt(assessment: CareerAssessment, availablePathways: any[]): string {
  const pathwayInfo = availablePathways.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    afterEducationLevel: p.afterEducationLevel,
    entranceExams: p.entranceExams,
    topInstitutes: p.topInstitutes,
    averageFees: p.averageFees,
    jobProspects: p.jobProspects,
  }));

  return `
Please provide personalized career recommendations based on the following assessment data:

ASSESSMENT DATA:
- User's education level: ${assessment.educationLevel}
- User's location/state: ${assessment.state}
- User's career aim: ${assessment.careerAim}
- User's interests: ${assessment.interests ? assessment.interests.join(", ") : "Not specified"}
- User's skills: ${assessment.skills ? assessment.skills.join(", ") : "Not specified"}
- User's budget: ${assessment.budget}
- User's preferred distance: ${assessment.preferredDistance || "Not specified"}

AVAILABLE EDUCATIONAL PATHWAYS:
${JSON.stringify(pathwayInfo, null, 2)}

Based on this information, provide a comprehensive career recommendation in the following JSON format:

{
  "recommendations": [
    {
      "pathwayId": number,
      "pathwayTitle": string,
      "score": number (0-100),
      "reason": string,
      "careerOptions": string[],
      "estimatedSalary": string,
      "growthPotential": string,
      "suggestedCourses": string[],
      "strengthsMatchScore": number (0-100),
      "weaknessAreas": string[],
      "timeToEmployment": string,
      "regionalDemand": [
        {
          "region": string,
          "demandLevel": "high" | "medium" | "low",
          "notes": string
        }
      ]
    }
  ]
}

For each recommendation:
- Include 3-5 pathways that best match the user's profile, sorted by best match first
- Provide a match score (0-100) based on alignment with the user's interests, skills, and other factors
- Explain why this pathway is recommended for the user specifically
- List specific career options available with this pathway
- Include estimated salary ranges in Indian Rupees (e.g., "₹5L - ₹10L")
- Provide growth potential assessment (e.g., "High", "Moderate", "Excellent")
- Suggest specific courses to enhance employability
- Highlight strengths and weaknesses of the user's profile for this pathway
- Estimate time to employment after completing education
- Include regional demand information for different parts of India
`;
}