import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { authMiddleware } from "../lib/auth";
import { eq } from "drizzle-orm";
import mqttService from "./mqtt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });
const iot = new Hono<{ Variables: { session: any } }>();

// Middleware to get session
iot.use("*", authMiddleware, async (c, next) => {
  // JWT payload is available in c.get("jwtPayload")
  await next();
});

// Activate machine session
iot.post("/activate", async (c) => {
  const payload = c.get("jwtPayload");
  const { machineId } = await c.req.json();

  // Get user
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, payload.userId))
    .limit(1);
  if (user.length === 0) return c.json({ error: "User not found" }, 404);

  // Check if user already has an active session
  const activeSession = await db
    .select()
    .from(schema.bottleCollections)
    .where(eq(schema.bottleCollections.userId, payload.userId))
    .orderBy(schema.bottleCollections.createdAt)
    .limit(1);

  // For simplicity, assume no concurrent sessions. In production, you'd track active sessions differently.

  // Check machine
  const machine = await db
    .select()
    .from(schema.rooms)
    .where(eq(schema.rooms.code, machineId))
    .limit(1);
  if (machine.length === 0) return c.json({ error: "Machine not found" }, 404);
  if (machine[0].isActive === false)
    return c.json({ error: "Machine is currently in use or inactive" }, 400);

  // Check MQTT connection
  if (!mqttService.isConnected()) {
    return c.json(
      {
        error: "IoT service unavailable",
        details: "MQTT broker not connected. Please check IoT connectivity.",
      },
      503
    );
  }

  // Set machine to in_use (inactive for others)
  await db
    .update(schema.rooms)
    .set({ isActive: false })
    .where(eq(schema.rooms.id, machine[0].id));

  // Create initial bottle collection record
  const bottleCollection = await db
    .insert(schema.bottleCollections)
    .values({
      userId: payload.userId,
      roomId: machine[0].id,
      totalBottles: 0,
      pointsAwarded: 0,
      verified: false,
      notes: `Session started at ${new Date().toISOString()}`,
    })
    .returning();

  // Send MQTT command to ESP32
  const success = await mqttService.publish(
    `machines/${machineId}/start`,
    JSON.stringify({
      userId: payload.userId,
      sessionId: bottleCollection[0].id,
      timestamp: new Date().toISOString(),
    })
  );

  if (!success) {
    // Rollback machine status and delete collection
    await db
      .update(schema.rooms)
      .set({ isActive: true })
      .where(eq(schema.rooms.id, machine[0].id));
    await db
      .delete(schema.bottleCollections)
      .where(eq(schema.bottleCollections.id, bottleCollection[0].id));
    return c.json(
      {
        error: "Failed to communicate with machine",
        details: "Could not send activation command to IoT device",
      },
      500
    );
  }

  return c.json({
    success: true,
    machine: machine[0],
    sessionId: bottleCollection[0].id,
    activatedAt: new Date().toISOString(),
    mqttConnected: true,
  });
});

// End session manually
iot.post("/session-end", async (c) => {
  const payload = c.get("jwtPayload");
  const { machineId, totalBottles } = await c.req.json();

  // Get user
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, payload.userId))
    .limit(1);
  if (!user) return c.json({ error: "User not found" }, 404);

  // Get machine
  const [machine] = await db
    .select()
    .from(schema.rooms)
    .where(eq(schema.rooms.code, machineId))
    .limit(1);
  if (!machine) return c.json({ error: "Machine not found" }, 404);

  // Calculate points (10 points per bottle)
  const points = totalBottles * 10;

  // Get current wallet
  const [wallet] = await db
    .select()
    .from(schema.wallets)
    .where(eq(schema.wallets.userId, user.id))
    .limit(1);

  const newBalance = (wallet?.pointsBalance || 0) + points;

  // Update wallet balance
  await db
    .update(schema.wallets)
    .set({ pointsBalance: newBalance, updatedAt: new Date() })
    .where(eq(schema.wallets.userId, user.id));

  // Record wallet transaction
  const walletId =
    wallet?.id ||
    (await db
      .insert(schema.wallets)
      .values({ userId: user.id, pointsBalance: 0 })
      .returning({ id: schema.wallets.id })
      .then((r) => r[0].id));
  await db.insert(schema.walletTransactions).values({
    walletId: walletId,
    changeAmount: points,
    type: "credit",
    refId: 0, // For now, use 0 as refId since machine.id is UUID
    refTable: "rooms",
    description: `Bottle collection at room ${machine.code}`,
    balanceAfter: newBalance,
  });

  // Record bottle collection
  await db.insert(schema.bottleCollections).values({
    userId: user.id,
    roomId: machine.id,
    totalBottles,
    pointsAwarded: points,
    verified: true,
    verifiedBy: user.id,
    verifiedAt: new Date(),
    notes: `Session ended at ${new Date().toISOString()}`,
  });

  // Reactivate machine
  await db
    .update(schema.rooms)
    .set({ isActive: true })
    .where(eq(schema.rooms.id, machine.id));

  // Send MQTT command to end session
  await mqttService.publish(
    `machines/${machineId}/end`,
    JSON.stringify({
      userId: payload.userId,
      totalBottles,
      points,
      timestamp: new Date().toISOString(),
    })
  );

  return c.json({
    success: true,
    points,
    newBalance,
    machine: machine,
    endedAt: new Date().toISOString(),
  });
});

// Get MQTT connection status
iot.get("/status", async (c) => {
  return c.json({
    mqttConnected: mqttService.isConnected(),
    timestamp: new Date().toISOString(),
  });
});

export { iot };
