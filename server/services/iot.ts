import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { authMiddleware } from "../lib/auth";
import { eq, and } from "drizzle-orm";
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
    return c.json({
      error: "Ruangan sedang digunakan",
      details: `Ruangan ${machineId} sedang digunakan oleh user lain. Silakan tunggu atau pilih ruangan lain.`,
      currentUserId: machine[0].currentUserId
    }, 409);

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
    .set({
      isActive: false,
      currentUserId: payload.userId,
      status: "in_use"
    })
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
      command: "start_session"
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
    refId: machine.id, 
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

iot.get("/machine/:code/bottle-count", async (c) => {
  const { code } = c.req.param();
  const payload = c.get("jwtPayload");

  // Find the machine
  const machine = await db
    .select()
    .from(schema.rooms)
    .where(eq(schema.rooms.code, code))
    .limit(1);

  if (machine.length === 0) {
    return c.json({ error: "Machine not found" }, 404);
  }

  // Find active bottle collection for this machine (unverified = active session)
  const activeCollection = await db
    .select()
    .from(schema.bottleCollections)
    .where(
      and(
        eq(schema.bottleCollections.roomId, machine[0].id),
        eq(schema.bottleCollections.verified, false)
      )
    )
    .orderBy(schema.bottleCollections.createdAt)
    .limit(1);

  if (activeCollection.length === 0) {
    return c.json({ bottles: 0, points: 0 }, 200);
  }

  const collection = activeCollection[0];
  const points = collection.totalBottles * 10;

  return c.json({
    bottles: collection.totalBottles,
    points,
    sessionId: collection.id,
    timestamp: new Date().toISOString(),
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
