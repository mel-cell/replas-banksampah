import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { httpIoT } from "./services/http";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger());

// Health check for HTTP IoT service
app.get("/health", (c) => c.json({ status: "HTTP IoT service running", timestamp: new Date().toISOString() }));

// HTTP IoT routes
app.route("/", httpIoT);

// Start server
const port = process.env.HTTP_IOT_PORT || 3001;
console.log(`HTTP IoT service starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
