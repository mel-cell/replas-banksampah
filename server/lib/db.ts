import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Limit concurrent connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  allowExitOnIdle: false,
});

export const db = drizzle(pool, { schema });
