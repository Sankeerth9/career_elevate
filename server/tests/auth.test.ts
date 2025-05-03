import request from "supertest";
import { app, initializeApp } from "../index";
import { db } from "../db";
import { users, careerAssessments } from "@shared/schema";
import { eq } from "drizzle-orm";

describe("Authentication Tests", () => {
  beforeAll(async () => {
    // Initialize app
    await initializeApp();
    // Clean up any existing test data
    await db.delete(careerAssessments);
    await db.delete(users);
  });

  afterAll(async () => {
    // Clean up after tests
    await db.delete(careerAssessments);
    await db.delete(users);
  });

  test("Register new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        password: "testpass",
        email: "test@example.com",
        fullName: "Test User",
      });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe("testuser");
    expect(response.body.password).toBeUndefined();
  });

  test("Login with correct credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "testpass",
      });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("testuser");
    expect(response.body.password).toBeUndefined();
  });

  test("Login with incorrect credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "wrongpass",
      });

    expect(response.status).toBe(401);
  });

  test("Get current user when authenticated", async () => {
    // First login to get session
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "testpass",
      });

    const cookies = loginResponse.headers["set-cookie"];

    // Then get current user
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookies);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("testuser");
  });

  test("Logout", async () => {
    const response = await request(app)
      .post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");
  });
}); 