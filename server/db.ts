import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

// Set default database URL for development
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_0mduAbsrpt8x@ep-empty-pond-a4yt4r7i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
}

let db;

if (process.env.NODE_ENV === 'test') {
  // Use regular PostgreSQL for testing
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Use a single connection for testing
    idleTimeoutMillis: 0, // Disable idle timeout
  });

  // Handle connection errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  db = drizzlePg(pool, { schema });
} else {
  // Use Neon's serverless driver for production
  neonConfig.webSocketConstructor = WebSocket;
  const sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql);
}

export { db };