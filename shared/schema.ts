import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  phone: text("phone"),
  educationLevel: text("education_level"),
  state: text("state"),
  languagePreference: text("language_preference").default("en"),
  createdAt: timestamp("created_at").defaultNow()
});

export const careerAssessments = pgTable("career_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  educationLevel: text("education_level").notNull(),
  state: text("state"),
  careerAim: text("career_aim"),
  budget: text("budget"),
  entranceRank: text("entrance_rank"),
  willingToRelocate: boolean("willing_to_relocate"),
  preferredDistance: text("preferred_distance"),
  interests: text("interests").array(),
  skills: text("skills").array(),
  results: json("results"),
  createdAt: timestamp("created_at").defaultNow()
});

export const educationalPathways = pgTable("educational_pathways", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  afterEducationLevel: text("after_education_level").notNull(),
  entranceExams: text("entrance_exams").array(),
  topInstitutes: text("top_institutes").array(),
  averageFees: text("average_fees"),
  jobProspects: text("job_prospects"),
  growthRate: text("growth_rate"),
  icon: text("icon")
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull(),
  packageType: text("package_type").notNull(),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCareerAssessmentSchema = createInsertSchema(careerAssessments).omit({ id: true, createdAt: true, results: true });
export const insertEducationalPathwaySchema = createInsertSchema(educationalPathways).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCareerAssessment = z.infer<typeof insertCareerAssessmentSchema>;
export type CareerAssessment = typeof careerAssessments.$inferSelect;
export type InsertEducationalPathway = z.infer<typeof insertEducationalPathwaySchema>;
export type EducationalPathway = typeof educationalPathways.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Enums for validation
export const educationLevels = ["10th", "12th", "graduation", "post_graduation", "other"] as const;
export const states = ["ap", "tl", "tn", "ka", "mh", "dl", "other"] as const;
export const careerAims = ["engineering", "medical", "law", "commerce", "civilservice", "esports", "arts", "other"] as const;
export const budgetRanges = ["low", "medium", "high", "veryhigh"] as const;
export const packageTypes = ["basic", "standard", "premium"] as const;
export const paymentStatuses = ["pending", "completed", "failed"] as const;
export const languages = ["en", "hi", "te", "ta", "kn", "ml", "bn", "mr"] as const;
