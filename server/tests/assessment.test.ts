import request from "supertest";
import { app, initializeApp } from "../index";
import { db } from "../db";
import { users, careerAssessments } from "@shared/schema";
import { eq } from "drizzle-orm";

describe("Career Assessment Tests", () => {
  let authCookies: string[];

  beforeAll(async () => {
    // Initialize app
    await initializeApp();
    // Clean up any existing test data
    await db.delete(careerAssessments);
    await db.delete(users);

    // Create a test user and login
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser2",
        password: "testpass",
        email: "test2@example.com",
        fullName: "Test User 2",
      });

    if (registerResponse.status !== 201) {
      console.error("Registration failed:", registerResponse.body);
      throw new Error("Failed to register test user");
    }

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser2",
        password: "testpass",
      });

    if (loginResponse.status !== 200) {
      console.error("Login failed:", loginResponse.body);
      throw new Error("Failed to login test user");
    }

    const cookies = loginResponse.headers["set-cookie"];
    authCookies = Array.isArray(cookies) ? cookies : [cookies];
  }, 30000); // Increase timeout to 30 seconds

  afterAll(async () => {
    // Clean up after tests
    await db.delete(careerAssessments);
    await db.delete(users);
  });

  test("Create career assessment", async () => {
    const response = await request(app)
      .post("/api/assessments")
      .set("Cookie", authCookies)
      .send({
        educationLevel: "12th",
        state: "mh",
        careerAim: "engineering",
        budget: "medium",
        willingToRelocate: true,
        preferredDistance: "any",
        interests: ["technology", "science"],
        skills: ["analytical", "problem-solving"],
      });

    expect(response.status).toBe(201);
    expect(response.body.educationLevel).toBe("12th");
    expect(response.body.results).toBeDefined();
  });

  test("Get user's career assessments", async () => {
    const response = await request(app)
      .get("/api/assessments")
      .set("Cookie", authCookies);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("Get specific career assessment", async () => {
    // First create an assessment
    const createResponse = await request(app)
      .post("/api/assessments")
      .set("Cookie", authCookies)
      .send({
        educationLevel: "12th",
        state: "mh",
        careerAim: "engineering",
        budget: "medium",
        willingToRelocate: true,
        preferredDistance: "any",
        interests: ["technology", "science"],
        skills: ["analytical", "problem-solving"],
      });

    expect(createResponse.status).toBe(201);
    const assessmentId = createResponse.body.id;

    // Then get it
    const response = await request(app)
      .get(`/api/assessments/${assessmentId}`)
      .set("Cookie", authCookies);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(assessmentId);
  });
}); 