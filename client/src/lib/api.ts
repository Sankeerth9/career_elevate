import { apiRequest } from "./queryClient";
import { CareerAssessment, EducationalPathway, User } from "@shared/schema";

// Auth API
export const registerUser = async (userData: any): Promise<User> => {
  const res = await apiRequest("POST", "/api/auth/register", userData);
  return res.json();
};

export const loginUser = async (
  username: string,
  password: string
): Promise<User> => {
  const res = await apiRequest("POST", "/api/auth/login", { username, password });
  return res.json();
};

export const logoutUser = async (): Promise<void> => {
  await apiRequest("POST", "/api/auth/logout", {});
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await apiRequest("GET", "/api/auth/me", undefined);
  return res.json();
};

// Career assessment API
export const submitCareerAssessment = async (
  assessmentData: any
): Promise<CareerAssessment> => {
  const res = await apiRequest("POST", "/api/assessments", assessmentData);
  return res.json();
};

export const getUserAssessments = async (): Promise<CareerAssessment[]> => {
  const res = await apiRequest("GET", "/api/assessments", undefined);
  return res.json();
};

export const getAssessment = async (id: number): Promise<CareerAssessment> => {
  const res = await apiRequest("GET", `/api/assessments/${id}`, undefined);
  return res.json();
};

// Educational pathways API
export const getEducationalPathways = async (educationLevel?: string): Promise<EducationalPathway[]> => {
  const url = educationLevel
    ? `/api/pathways?educationLevel=${educationLevel}`
    : "/api/pathways";
  const res = await apiRequest("GET", url, undefined);
  return res.json();
};

export const getEducationalPathway = async (id: number): Promise<EducationalPathway> => {
  const res = await apiRequest("GET", `/api/pathways/${id}`, undefined);
  return res.json();
};

// Fee calculator API
export const calculateFees = async (
  educationLevel: string,
  careerPath: string,
  collegeType: string
): Promise<{ fees: any }> => {
  const res = await apiRequest("POST", "/api/calculate-fees", {
    educationLevel,
    careerPath,
    collegeType,
  });
  return res.json();
};

// Payment API
export const createPayment = async (paymentData: any): Promise<any> => {
  const res = await apiRequest("POST", "/api/payments", paymentData);
  return res.json();
};

export const updatePaymentStatus = async (
  id: number,
  status: string
): Promise<any> => {
  const res = await apiRequest("PUT", `/api/payments/${id}/status`, { status });
  return res.json();
};
