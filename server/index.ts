import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from 'hono/bun';
import { reactRouter } from 'remix-hono/handler';
// @ts-ignore
import * as build from '../client/build/server';
import { authRoutes, authMiddleware } from "./lib/auth";
import { web } from "./services/web";
import { iot } from "./services/iot";
import { admin } from "./services/admin";
import { conversion } from "./services/conversion";
import { docs } from "./docs";
import "./services/mqtt"; // Initialize MQTT service
import { Pool } from 'pg';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { websocketService } from './services/websocket';
import mqttService from './services/mqtt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = new Hono();

app.use("/*", cors({
  origin: "*",
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.use('*', logger());

app.get("/api/health", (c) => {
  return c.text("OK", 200);
});

app.get("/api/welcome", (c) => {
  return c.json({ message: "Welcome to the API Service!" });
});

websocketService.createWebSocketServer(app);

// Mount auth routes
app.route("/api/auth", authRoutes);

// Mount web APIs
app.route("/api/web", web);

// Mount IoT APIs
app.route("/api/iot", iot);

// Mount admin APIs
app.route("/api/admin", admin);

// Mount conversion APIs
app.route("/api/conversion", conversion);

// Mount API documentation
app.route("/api/docs", docs);

// Test database connection
app.get("/api/conection", async (c) => {
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

// MQTT connection status (public endpoint)
app.get("/api/mqtt-status", async (c) => {
  const isConnected = mqttService.isConnected();
  return c.json({
    mqttConnected: isConnected,
    status: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Serve static assets from Remix build (JS, CSS, images, etc.)
const clientBuildPath = resolve(__dirname, '../client/build/client');
console.log('Client build path:', clientBuildPath);
app.use('*', serveStatic({
  root: clientBuildPath,
}));

// Catch-all for Remix SSR: handle all other requests
app.all('*', reactRouter({
  build,
  mode: 'production' as const,
  getLoadContext: () => ({})
}));


console.log("Server running on port 3004");

export default {
  port: 3004,
  hostname: '0.0.0.0',
  fetch: app.fetch,
  websocket: {
    message(ws: any, message: any) {},
    open(ws: any) {},
    close(ws: any, code: any, reason: any) {},
    drain(ws: any) {},
  },
};

export { app };