import express, { type Express, Request, Response } from "express";
import session from "express-session";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCareerAssessmentSchema, insertPaymentSchema } from "@shared/schema";
import { calculateFees } from "./services/feeCalculator";
import { getCareerRecommendations } from "./services/careerRecommendation";
import z from "zod";
import MemoryStore from "memorystore";
import { genAI, model } from "./services/gemini";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      name: process.env.SESSION_COOKIE_NAME || 'career-path-session',
      cookie: { 
        maxAge: 86400000, // 24 hours
        secure: process.env.SESSION_COOKIE_SECURE === 'true',
        httpOnly: process.env.SESSION_COOKIE_HTTPONLY !== 'false',
        sameSite: process.env.SESSION_COOKIE_SAMESITE as 'lax' | 'strict' | 'none' || 'lax',
      },
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "career-path-ai-secret",
    })
  );

  // API routes prefix
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Authentication routes
  apiRouter.post("/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      const userResponse = { ...newUser, password: undefined };
      
      // Set user session
      req.session.userId = newUser.id;
      
      res.status(201).json(userResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  apiRouter.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.verifyUserCredentials(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user session
      req.session.userId = user.id;
      
      const userResponse = { ...user, password: undefined };
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  apiRouter.post("/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  apiRouter.get("/auth/me", async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const userResponse = { ...user, password: undefined };
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user profile" });
    }
  });

  // Career assessment routes
  apiRouter.post("/assessments", async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const assessmentData = insertCareerAssessmentSchema.parse({
        ...req.body,
        userId
      });
      
      const assessment = await storage.createCareerAssessment(assessmentData);
      
      // Generate recommendations 
      const recommendations = await getCareerRecommendations(assessment);
      
      // Update assessment with results
      assessment.results = recommendations;
      
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  apiRouter.get("/assessments", async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const assessments = await storage.getCareerAssessmentsByUserId(userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get assessments" });
    }
  });

  apiRouter.get("/assessments/:id", async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const assessmentId = parseInt(req.params.id);
      
      if (isNaN(assessmentId)) {
        return res.status(400).json({ message: "Invalid assessment ID" });
      }
      
      const assessment = await storage.getCareerAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      if (assessment.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to assessment" });
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to get assessment" });
    }
  });

  // Educational pathways routes
  apiRouter.get("/pathways", async (req: Request, res: Response) => {
    try {
      const { educationLevel } = req.query;
      
      if (educationLevel && typeof educationLevel === 'string') {
        const pathways = await storage.getEducationalPathwaysByEducationLevel(educationLevel);
        return res.json(pathways);
      }
      
      const pathways = await storage.getAllEducationalPathways();
      res.json(pathways);
    } catch (error) {
      res.status(500).json({ message: "Failed to get educational pathways" });
    }
  });

  apiRouter.get("/pathways/:id", async (req: Request, res: Response) => {
    try {
      const pathwayId = parseInt(req.params.id);
      
      if (isNaN(pathwayId)) {
        return res.status(400).json({ message: "Invalid pathway ID" });
      }
      
      const pathway = await storage.getEducationalPathway(pathwayId);
      
      if (!pathway) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      res.json(pathway);
    } catch (error) {
      res.status(500).json({ message: "Failed to get pathway" });
    }
  });

  // Fee calculator route
  apiRouter.post("/calculate-fees", async (req: Request, res: Response) => {
    try {
      const { educationLevel, careerPath, collegeType } = req.body;
      
      if (!educationLevel || !careerPath || !collegeType) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const fees = calculateFees(educationLevel, careerPath, collegeType);
      res.json({ fees });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate fees" });
    }
  });

  // Payment routes
  apiRouter.post("/payments", async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const paymentData = insertPaymentSchema.parse({
        ...req.body,
        userId,
        status: "pending"
      });
      
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  apiRouter.put("/payments/:id/status", async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const paymentId = parseInt(req.params.id);
      
      if (isNaN(paymentId)) {
        return res.status(400).json({ message: "Invalid payment ID" });
      }
      
      const { status } = req.body;
      
      if (!status || !["pending", "completed", "failed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const payment = await storage.getPayment(paymentId);
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      if (payment.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to payment" });
      }
      
      const updatedPayment = await storage.updatePaymentStatus(paymentId, status);
      res.json(updatedPayment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment status" });
    }
  });

  // AI-powered test recommendation endpoint
  apiRouter.post("/test-ai-recommendation", async (req: Request, res: Response) => {
    try {
      // Sample assessment for testing
      const sampleAssessment = {
        id: 9999,
        educationLevel: req.body.educationLevel || "12th",
        state: req.body.state || "mh",
        careerAim: req.body.careerAim || "engineering",
        budget: req.body.budget || "medium",
        preferredDistance: req.body.preferredDistance || "any",
        interests: req.body.interests || ["technology", "science", "mathematics"],
        skills: req.body.skills || ["analytical", "problem-solving", "teamwork"],
        userId: null,
        createdAt: new Date(),
        results: null,
        willingToRelocate: Boolean(req.body.willingToRelocate) || true,
        entranceRank: "good"
      };
      
      // Skip OpenAI call and directly use basic recommendations
      // since we know OpenAI has quota exceeded error
      console.log("Using basic recommendations directly");
      const { getBasicRecommendations } = require('./services/careerRecommendation');
      const recommendations = await getBasicRecommendations(sampleAssessment);
      
      res.json({
        assessment: sampleAssessment,
        recommendations,
        source: "basic" // Indicate basic recommendations
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({
        message: "Failed to generate recommendations",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Add test endpoint for Gemini
  apiRouter.get("/test-gemini", async (req, res) => {
    try {
      const result = await model.generateContent("Hello! Can you confirm this API is working?");
      const response = await result.response;
      const text = response.text();

      res.json({
        success: true,
        message: text
      });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to connect to Gemini API"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
