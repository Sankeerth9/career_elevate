import { db } from "../db";
import { users, careerAssessments } from "@shared/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../utils/password";

describe("Database Tests", () => {
  beforeAll(async () => {
    // Ensure we have a clean test database
    await db.delete(careerAssessments);
    await db.delete(users);
  });

  afterAll(async () => {
    // Clean up after tests
    await db.delete(careerAssessments);
    await db.delete(users);
  });

  test("Database connection works", async () => {
    const result = await db.select().from(users);
    expect(result).toBeDefined();
  });

  test("Can create and retrieve a user", async () => {
    const testUser = {
      username: "testuser",
      password: await hashPassword("testpass"),
      email: "test@example.com",
      fullName: "Test User",
    };

    const [insertedUser] = await db.insert(users).values(testUser).returning();
    expect(insertedUser).toBeDefined();
    expect(insertedUser.username).toBe(testUser.username);

    const [retrievedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, insertedUser.id));
    
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.username).toBe(testUser.username);
  });
}); 