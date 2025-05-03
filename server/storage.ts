import { users, type User, type InsertUser, careerAssessments, type CareerAssessment, type InsertCareerAssessment, educationalPathways, type EducationalPathway, type InsertEducationalPathway, payments, type Payment, type InsertPayment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./utils/password";

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

// In-memory storage implementation (for reference only, using DatabaseStorage now)
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

// Database implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await hashPassword(insertUser.password);

    // Map camelCase to snake_case for DB
    const userWithHashedPassword = {
      username: insertUser.username,
      password: hashedPassword,
      email: insertUser.email,
      full_name: insertUser.fullName ?? null,
      phone: insertUser.phone ?? null,
      education_level: insertUser.educationLevel ?? null,
      state: insertUser.state ?? null,
      language_preference: insertUser.languagePreference ?? "en",
      // created_at will be set by DB default
    };

    const [user] = await db.insert(users)
      .values(userWithHashedPassword)
      .returning();

    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async createCareerAssessment(insertAssessment: InsertCareerAssessment): Promise<CareerAssessment> {
    // Ensure all nullable fields have proper defaults
    const assessmentWithDefaults = {
      ...insertAssessment,
      state: insertAssessment.state ?? null,
      userId: insertAssessment.userId ?? null,
      careerAim: insertAssessment.careerAim ?? null,
      budget: insertAssessment.budget ?? null,
      entranceRank: insertAssessment.entranceRank ?? null, 
      willingToRelocate: insertAssessment.willingToRelocate ?? null,
      preferredDistance: insertAssessment.preferredDistance ?? null,
      interests: insertAssessment.interests ?? null,
      skills: insertAssessment.skills ?? null,
      results: {} // Default empty object for results
    };
    
    const [assessment] = await db
      .insert(careerAssessments)
      .values(assessmentWithDefaults)
      .returning();
    return assessment;
  }
  
  async getCareerAssessmentsByUserId(userId: number): Promise<CareerAssessment[]> {
    return await db
      .select()
      .from(careerAssessments)
      .where(eq(careerAssessments.userId, userId));
  }
  
  async getCareerAssessment(id: number): Promise<CareerAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(careerAssessments)
      .where(eq(careerAssessments.id, id));
    return assessment || undefined;
  }
  
  async getAllEducationalPathways(): Promise<EducationalPathway[]> {
    return await db
      .select()
      .from(educationalPathways);
  }
  
  async getEducationalPathwaysByEducationLevel(level: string): Promise<EducationalPathway[]> {
    if (level === "all") {
      return this.getAllEducationalPathways();
    }
    return await db
      .select()
      .from(educationalPathways)
      .where(eq(educationalPathways.afterEducationLevel, level));
  }
  
  async getEducationalPathway(id: number): Promise<EducationalPathway | undefined> {
    const [pathway] = await db
      .select()
      .from(educationalPathways)
      .where(eq(educationalPathways.id, id));
    return pathway || undefined;
  }
  
  async createEducationalPathway(insertPathway: InsertEducationalPathway): Promise<EducationalPathway> {
    // Ensure all nullable fields have proper defaults
    const pathwayWithDefaults = {
      ...insertPathway,
      entranceExams: insertPathway.entranceExams ?? null,
      topInstitutes: insertPathway.topInstitutes ?? null,
      averageFees: insertPathway.averageFees ?? null,
      jobProspects: insertPathway.jobProspects ?? null,
      growthRate: insertPathway.growthRate ?? null,
      icon: insertPathway.icon ?? null
    };
    
    const [pathway] = await db
      .insert(educationalPathways)
      .values(pathwayWithDefaults)
      .returning();
    return pathway;
  }
  
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    // Ensure all nullable fields have proper defaults
    const paymentWithDefaults = {
      ...insertPayment,
      userId: insertPayment.userId ?? null,
      transactionId: insertPayment.transactionId ?? null
    };
    
    const [payment] = await db
      .insert(payments)
      .values(paymentWithDefaults)
      .returning();
    return payment;
  }
  
  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId));
  }
  
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    return payment || undefined;
  }
  
  async updatePaymentStatus(id: number, status: string): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ status })
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment || undefined;
  }

  async verifyUserCredentials(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;
    
    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : undefined;
  }

  // Seed educational pathways if they don't exist yet
  async seedEducationalPathwaysIfNeeded() {
    const existingPathways = await this.getAllEducationalPathways();
    
    if (existingPathways.length === 0) {
      const engineeringPathway: InsertEducationalPathway = {
        title: "Engineering & Manufacturing",
        description: "Mechanical Engineer, Electrical Engineer, Civil Engineer, Industrial Designer, CNC Machinist",
        afterEducationLevel: "12th",
        entranceExams: ["JEE Main", "JEE Advanced", "EAMCET", "BITSAT"],
        topInstitutes: ["IITs", "NITs", "BITS", "State Universities"],
        averageFees: "₹8L - ₹15L (full course)",
        jobProspects: "High Demand",
        growthRate: "+20%",
        icon: "building"
      };
      
      const medicalPathway: InsertEducationalPathway = {
        title: "Healthcare & Social Services",
        description: "Nurse, Physician Assistant, Pharmacist, Medical Technician, Social Worker, Mental Health Counselor",
        afterEducationLevel: "12th",
        entranceExams: ["NEET-UG", "AIIMS", "JIPMER"],
        topInstitutes: ["AIIMS", "CMC Vellore", "Govt Medical Colleges", "NIMHANS"],
        averageFees: "₹25L - ₹80L (full course)",
        jobProspects: "Very High Demand",
        growthRate: "+28%",
        icon: "heart"
      };
      
      const lawPathway: InsertEducationalPathway = {
        title: "Law, Public Safety & Government",
        description: "Lawyer, Police Officer, Firefighter, Paralegal, Legal Assistant, Public Administrator",
        afterEducationLevel: "12th",
        entranceExams: ["CLAT", "LSAT", "AILET"],
        topInstitutes: ["NLUs", "Symbiosis", "NALSAR"],
        averageFees: "₹2.5L - ₹15L (full course)",
        jobProspects: "Good Demand",
        growthRate: "+15%",
        icon: "scale"
      };
      
      const itPathway: InsertEducationalPathway = {
        title: "Information Technology & Computer Science",
        description: "Software Developer, IT Support Specialist, Cybersecurity Analyst, Data Scientist, Web Developer",
        afterEducationLevel: "12th",
        entranceExams: ["JEE Main", "BITSAT", "COMEDK"],
        topInstitutes: ["IITs", "NITs", "IIIT", "BITS"],
        averageFees: "₹6L - ₹16L (full course)",
        jobProspects: "Very High Demand",
        growthRate: "+25%",
        icon: "laptop"
      };
      
      const businessPathway: InsertEducationalPathway = {
        title: "Business, Finance & Administration",
        description: "Accountant, Financial Analyst, Human Resources Specialist, Marketing Coordinator, Administrative Assistant",
        afterEducationLevel: "12th",
        entranceExams: ["CAT", "XAT", "MAT", "CMAT"],
        topInstitutes: ["IIMs", "XLRI", "FMS Delhi", "SPJIMR"],
        averageFees: "₹5L - ₹25L (full course)",
        jobProspects: "High Demand",
        growthRate: "+18%",
        icon: "briefcase"
      };
      
      const educationPathway: InsertEducationalPathway = {
        title: "Education & Training",
        description: "Teacher, Instructional Designer, Corporate Trainer, Educational Consultant, Special Education Specialist",
        afterEducationLevel: "graduation",
        entranceExams: ["B.Ed Entrance", "CTET", "NET"],
        topInstitutes: ["NCERT", "Regional Colleges of Education", "Delhi University"],
        averageFees: "₹1L - ₹5L (full course)",
        jobProspects: "Steady Demand",
        growthRate: "+12%",
        icon: "book"
      };
      
      const artsPathway: InsertEducationalPathway = {
        title: "Arts, Design & Media",
        description: "Graphic Designer, Animator, Content Creator, Photographer, Art Director",
        afterEducationLevel: "12th",
        entranceExams: ["NIFT", "NID", "UCEED", "CEED"],
        topInstitutes: ["NID", "NIFT", "FTII", "FMS Delhi"],
        averageFees: "₹3L - ₹15L (full course)",
        jobProspects: "Growing Demand",
        growthRate: "+22%",
        icon: "palette"
      };
      
      const tradesPathway: InsertEducationalPathway = {
        title: "Skilled Trades & Construction",
        description: "Electrician, Plumber, Carpenter, HVAC Technician, Welder",
        afterEducationLevel: "10th",
        entranceExams: ["ITI Admission", "Trade Tests"],
        topInstitutes: ["ITIs", "Polytechnics", "NTTF"],
        averageFees: "₹50K - ₹3L (full course)",
        jobProspects: "High Demand",
        growthRate: "+16%",
        icon: "tool"
      };
      
      const agriculturePathway: InsertEducationalPathway = {
        title: "Agriculture, Food & Natural Resources",
        description: "Agricultural Technician, Food Scientist, Environmental Specialist, Horticulturist, Conservation Officer",
        afterEducationLevel: "12th",
        entranceExams: ["ICAR AIEEA", "IARI", "JET"],
        topInstitutes: ["IARI", "GBPUAT", "PAU", "TNAU"],
        averageFees: "₹1.5L - ₹8L (full course)",
        jobProspects: "Growing Demand",
        growthRate: "+14%",
        icon: "leaf"
      };
      
      const transportPathway: InsertEducationalPathway = {
        title: "Transportation & Logistics",
        description: "Truck Driver, Supply Chain Analyst, Logistics Coordinator, Aircraft Mechanic, Warehouse Manager",
        afterEducationLevel: "12th",
        entranceExams: ["Logistics Certification Exams", "Aviation Tests"],
        topInstitutes: ["IMU", "IIFT", "FHRAI", "Aviation Academies"],
        averageFees: "₹1L - ₹10L (full course)",
        jobProspects: "Steady Demand",
        growthRate: "+13%",
        icon: "truck"
      };
      
      await this.createEducationalPathway(engineeringPathway);
      await this.createEducationalPathway(medicalPathway);
      await this.createEducationalPathway(lawPathway);
      await this.createEducationalPathway(itPathway);
      await this.createEducationalPathway(businessPathway);
      await this.createEducationalPathway(educationPathway);
      await this.createEducationalPathway(artsPathway);
      await this.createEducationalPathway(tradesPathway);
      await this.createEducationalPathway(agriculturePathway);
      await this.createEducationalPathway(transportPathway);
    }
  }
}

// Export a database storage instance
export const storage = new DatabaseStorage();