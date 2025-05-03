// JobSearchAPI.ts - API service for job search functionality

// No API key or BASE_URL needed in frontend now

export interface JobFilters {
  keywords: string;
  location?: string;
  salary?: string;
  page?: number;
  limit?: number;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  updated: string;
  link: string;
  type?: string;
  source?: string;
}

export interface JobSearchResponse {
  totalCount: number;
  jobs: JobListing[];
}

/**
 * Search for jobs using the backend proxy API
 * @param filters - Search filters
 * @returns Promise with job listings
 */
export async function searchJobs(filters: JobFilters): Promise<JobSearchResponse> {
  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filters)
    });

    if (!response.ok) {
      throw new Error(`Error fetching jobs: ${response.status}`);
    }

    const data = await response.json();
    return {
      totalCount: data.totalCount || 0,
      jobs: data.jobs || []
    };
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return { totalCount: 0, jobs: [] };
  }
}

/**
 * Get suggested job keywords based on education level and career aim
 * @param educationLevel - User's education level
 * @param careerAim - User's career aim
 * @returns Array of suggested search keywords
 */
export function getSuggestedJobKeywords(educationLevel: string, careerAim: string): string[] {
  const keywordsByCareerAim: Record<string, string[]> = {
    engineering: ["software engineer", "mechanical engineer", "civil engineer", "engineering intern"],
    medical: ["healthcare", "medical assistant", "nurse", "pharmacy assistant"],
    law: ["legal assistant", "paralegal", "law clerk", "legal intern"],
    commerce: ["business analyst", "marketing", "finance", "accounting"],
    civilservice: ["government", "public administration", "civil service"],
    esports: ["game developer", "esports", "gaming", "content creator"],
    arts: ["graphic designer", "content writer", "digital artist", "creative"]
  };

  const educationLevelModifiers: Record<string, string[]> = {
    "10th": ["entry level", "junior", "assistant", "trainee"],
    "12th": ["entry level", "junior", "assistant", "trainee"],
    "graduation": ["graduate", "junior", "associate"],
    "post_graduation": ["senior", "specialist", "manager"],
    "other": []
  };

  const defaultKeywords = ["entry level", "internship", "trainee", "assistant"];
  
  // Get career-specific keywords
  const careerKeywords = keywordsByCareerAim[careerAim] || defaultKeywords;
  
  // Get education level modifiers
  const levelModifiers = educationLevelModifiers[educationLevel] || [];
  
  // Combine some keywords with modifiers
  const combinedKeywords = [
    ...careerKeywords,
    ...(levelModifiers.length > 0 ? [`${levelModifiers[0]} ${careerKeywords[0]}`] : [])
  ];
  
  return combinedKeywords;
}