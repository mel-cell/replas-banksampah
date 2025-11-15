import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes, authMiddleware } from "./lib/auth.js";
import { web } from "./services/web.js";
import { iot } from "./services/iot.js";
import { docs } from "./docs.js";
import "./services/mqtt.js"; // Initialize MQTT service
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = new Hono();

app.use("/*", cors({
  origin: ["http://localhost:3004", "http://103.144.209.103:3004"],
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Mount auth routes
app.route("/api/auth", authRoutes);

// Mount web APIs
app.route("/api/web", web);

// Mount IoT APIs
app.route("/api/iot", iot);

// Mount API documentation
app.route("/docs", docs);

app.get("/", (c) => {
  return c.text("welcome to the api replas");
});

// Test database connection
app.get("/conection", async (c) => {
  try {
    const result = await pool.query("SELECT NOW()");
    return c.json({
      message: "Database connected",
      timestamp: result.rows[0].now,
    });
  } catch (error: any) {
    return c.json(
      { error: "Database connection failed", details: error.message },
      500
    );
  }
});

console.log("Server running on port 3004");

export default {
  port: 3004,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};

export { app };
