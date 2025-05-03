import dotenv from 'dotenv';
import { jest } from '@jest/globals';
import './mocks/openai';
import { storage } from '../storage';

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_0mduAbsrpt8x@ep-empty-pond-a4yt4r7i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
process.env.SESSION_SECRET = 'test-secret';
process.env.SESSION_COOKIE_NAME = 'career-path-session-test';
process.env.SESSION_COOKIE_SECURE = 'false';
process.env.SESSION_COOKIE_HTTPONLY = 'true';
process.env.SESSION_COOKIE_SAMESITE = 'lax';
process.env.OPENAI_API_KEY = 'test-key';

// Seed educational pathways
beforeAll(async () => {
  await storage.seedEducationalPathwaysIfNeeded();
});

// Mock console.error to keep test output clean
const mockConsoleError = jest.fn();
console.error = mockConsoleError; 