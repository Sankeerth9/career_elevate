import { EducationalPathway, CareerAssessment, Payment } from "@shared/schema";
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

export async function submitCareerAssessment(formData: Omit<CareerAssessment, 'id' | 'userId' | 'createdAt' | 'results'>): Promise<CareerAssessment> {
  const response = await fetch('/api/assessments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit career assessment');
  }
  
  return response.json();
}

export async function getUserAssessments(): Promise<CareerAssessment[]> {
  const response = await fetch('/api/assessments');
  
  if (!response.ok) {
    throw new Error('Failed to fetch user assessments');
  }
  
  return response.json();
}

export async function getAssessmentById(id: number): Promise<CareerAssessment> {
  const response = await fetch(`/api/assessments/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch assessment');
  }
  
  return response.json();
}

export async function createPayment(paymentData: Omit<Payment, 'id' | 'userId' | 'createdAt'>): Promise<Payment> {
  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create payment');
  }
  
  return response.json();
}