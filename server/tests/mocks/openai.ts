import { jest } from '@jest/globals';

// Mock OpenAI response
const mockRecommendations = {
  recommendations: [
    {
      pathwayId: 1,
      pathwayTitle: "Engineering Path",
      score: 85,
      reason: "Strong match based on interests and skills",
      careerOptions: ["Software Engineer", "Data Scientist", "AI Engineer"],
      estimatedSalary: "₹5L - ₹20L",
      growthPotential: "High",
      suggestedCourses: ["B.Tech in Computer Science", "Data Science Certifications"],
      strengthsMatchScore: 90,
      weaknessAreas: ["Soft skills"],
      timeToEmployment: "4 years",
      regionalDemand: [
        {
          region: "Bangalore",
          demandLevel: "high",
          notes: "Tech hub with many opportunities"
        }
      ]
    }
  ]
};

// Mock OpenAI client
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify(mockRecommendations)
                }
              }
            ]
          })
        }
      }
    }))
  };
}); 