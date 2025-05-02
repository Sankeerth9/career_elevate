import { EducationalPathway } from "@shared/schema";
import { queryClient } from "./queryClient";

export async function getEducationalPathways(educationLevel?: string): Promise<EducationalPathway[]> {
  const url = educationLevel ? `/api/pathways?level=${educationLevel}` : '/api/pathways';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch educational pathways');
  }
  
  return response.json();
}

export async function getEducationalPathway(id: number): Promise<EducationalPathway> {
  const response = await fetch(`/api/pathways/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch educational pathway');
  }
  
  return response.json();
}

export function invalidatePathwaysCache() {
  return queryClient.invalidateQueries({ queryKey: ['/api/pathways'] });
}