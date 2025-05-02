import { db } from "./db";
import { storage } from "./storage";
import { users, careerAssessments, educationalPathways, payments } from "@shared/schema";

export async function setupDatabase() {
  try {
    console.log("Setting up the database...");
    
    // Create tables if they don't exist (PostgreSQL syntax)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "full_name" TEXT,
        "phone" TEXT,
        "education_level" TEXT,
        "state" TEXT,
        "language_preference" TEXT DEFAULT 'en',
        "created_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS "career_assessments" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users"("id"),
        "education_level" TEXT NOT NULL,
        "state" TEXT,
        "career_aim" TEXT,
        "budget" TEXT,
        "entrance_rank" TEXT,
        "willing_to_relocate" BOOLEAN,
        "preferred_distance" TEXT,
        "interests" TEXT[],
        "skills" TEXT[],
        "results" JSON,
        "created_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS "educational_pathways" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "after_education_level" TEXT NOT NULL,
        "entrance_exams" TEXT[],
        "top_institutes" TEXT[],
        "average_fees" TEXT,
        "job_prospects" TEXT,
        "growth_rate" TEXT,
        "icon" TEXT
      );
      
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users"("id"),
        "amount" DOUBLE PRECISION NOT NULL,
        "status" TEXT NOT NULL,
        "package_type" TEXT NOT NULL,
        "transaction_id" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Seed educational pathways
    await storage.seedEducationalPathwaysIfNeeded();
    
    console.log("Database setup complete!");
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
}