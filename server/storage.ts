import { users, type User, type InsertUser, careerAssessments, type CareerAssessment, type InsertCareerAssessment, educationalPathways, type EducationalPathway, type InsertEducationalPathway, payments, type Payment, type InsertPayment } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Career assessment operations
  createCareerAssessment(assessment: InsertCareerAssessment): Promise<CareerAssessment>;
  getCareerAssessmentsByUserId(userId: number): Promise<CareerAssessment[]>;
  getCareerAssessment(id: number): Promise<CareerAssessment | undefined>;
  
  // Educational pathways operations
  getAllEducationalPathways(): Promise<EducationalPathway[]>;
  getEducationalPathwaysByEducationLevel(level: string): Promise<EducationalPathway[]>;
  getEducationalPathway(id: number): Promise<EducationalPathway | undefined>;
  createEducationalPathway(pathway: InsertEducationalPathway): Promise<EducationalPathway>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  updatePaymentStatus(id: number, status: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private careerAssessments: Map<number, CareerAssessment>;
  private educationalPathways: Map<number, EducationalPathway>;
  private payments: Map<number, Payment>;
  
  private userCurrentId: number;
  private assessmentCurrentId: number;
  private pathwayCurrentId: number;
  private paymentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.careerAssessments = new Map();
    this.educationalPathways = new Map();
    this.payments = new Map();
    
    this.userCurrentId = 1;
    this.assessmentCurrentId = 1;
    this.pathwayCurrentId = 1;
    this.paymentCurrentId = 1;
    
    // Initialize with some educational pathways
    this.seedEducationalPathways();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Career assessment operations
  async createCareerAssessment(insertAssessment: InsertCareerAssessment): Promise<CareerAssessment> {
    const id = this.assessmentCurrentId++;
    const now = new Date();
    const assessment: CareerAssessment = { 
      ...insertAssessment, 
      id, 
      createdAt: now,
      results: null
    };
    this.careerAssessments.set(id, assessment);
    return assessment;
  }
  
  async getCareerAssessmentsByUserId(userId: number): Promise<CareerAssessment[]> {
    return Array.from(this.careerAssessments.values()).filter(
      (assessment) => assessment.userId === userId
    );
  }
  
  async getCareerAssessment(id: number): Promise<CareerAssessment | undefined> {
    return this.careerAssessments.get(id);
  }
  
  // Educational pathways operations
  async getAllEducationalPathways(): Promise<EducationalPathway[]> {
    return Array.from(this.educationalPathways.values());
  }
  
  async getEducationalPathwaysByEducationLevel(level: string): Promise<EducationalPathway[]> {
    return Array.from(this.educationalPathways.values()).filter(
      (pathway) => pathway.afterEducationLevel === level
    );
  }
  
  async getEducationalPathway(id: number): Promise<EducationalPathway | undefined> {
    return this.educationalPathways.get(id);
  }
  
  async createEducationalPathway(insertPathway: InsertEducationalPathway): Promise<EducationalPathway> {
    const id = this.pathwayCurrentId++;
    const pathway: EducationalPathway = { ...insertPathway, id };
    this.educationalPathways.set(id, pathway);
    return pathway;
  }
  
  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.paymentCurrentId++;
    const now = new Date();
    const payment: Payment = { ...insertPayment, id, createdAt: now };
    this.payments.set(id, payment);
    return payment;
  }
  
  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.userId === userId
    );
  }
  
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }
  
  async updatePaymentStatus(id: number, status: string): Promise<Payment | undefined> {
    const existingPayment = this.payments.get(id);
    if (!existingPayment) return undefined;
    
    const updatedPayment = { ...existingPayment, status };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  
  // Seed data
  private seedEducationalPathways() {
    const engineeringPathway: InsertEducationalPathway = {
      title: "Engineering Path",
      description: "After 12th (Science with PCM)",
      afterEducationLevel: "12th",
      entranceExams: ["JEE Main", "JEE Advanced", "EAMCET"],
      topInstitutes: ["IITs", "NITs", "BITS", "State Universities"],
      averageFees: "₹8L - ₹15L (full course)",
      jobProspects: "High Demand",
      growthRate: "+20%",
      icon: "building"
    };
    
    const medicalPathway: InsertEducationalPathway = {
      title: "Medical Path",
      description: "After 12th (Science with PCB)",
      afterEducationLevel: "12th",
      entranceExams: ["NEET-UG"],
      topInstitutes: ["AIIMS", "CMC Vellore", "Govt Medical Colleges"],
      averageFees: "₹25L - ₹80L (full course)",
      jobProspects: "Very High Demand",
      growthRate: "+28%",
      icon: "heart"
    };
    
    const lawPathway: InsertEducationalPathway = {
      title: "Law Path",
      description: "After 12th (Any Stream)",
      afterEducationLevel: "12th",
      entranceExams: ["CLAT", "LSAT", "AILET"],
      topInstitutes: ["NLUs", "Symbiosis", "NALSAR"],
      averageFees: "₹2.5L - ₹15L (full course)",
      jobProspects: "Good Demand",
      growthRate: "+15%",
      icon: "scale"
    };
    
    this.createEducationalPathway(engineeringPathway);
    this.createEducationalPathway(medicalPathway);
    this.createEducationalPathway(lawPathway);
  }
}

export const storage = new MemStorage();
