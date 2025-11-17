import mqtt from "mqtt";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";
import websocketService from "./websocket";

// Track last activity per machine for connection status
const machineLastActivity = new Map<string, number>();

// Function to check and broadcast connection status
const checkConnectionStatus = () => {
  const now = Date.now();
  machineLastActivity.forEach((lastActivity, machineCode) => {
    const timeSinceActivity = now - lastActivity;
    const isConnected = timeSinceActivity < 30000; // 30 seconds timeout

    if (!isConnected) {
      websocketService.broadcastRoomUpdate({
        roomCode: machineCode,
        status: "idle", // Assume idle if disconnected
        connected: false,
        issue: "MQTT Disconnected - No activity for 30+ seconds",
        lastActivity: new Date(lastActivity).toISOString()
      });
    }
  });
};

// Check connection status every 10 seconds
setInterval(checkConnectionStatus, 10000);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

const mqttClient = mqtt.connect("mqtt://103.144.209.103", { // Public IP MQTT broker
  port: 1883, // Standard MQTT port
  username: "replas_device",
  password: "replas_secure_2024",
  reconnectPeriod: 5000, // Reconnect every 5 seconds
  connectTimeout: 10000, // Connection timeout 10 seconds
  keepalive: 60, // Keep alive ping every 60 seconds
});

let isConnected = false;

export const mqttService = {
  client: mqttClient,
  isConnected: () => isConnected,

  connect: () => {
    mqttClient.on("connect", () => {
      console.log("MQTT connected successfully");
      isConnected = true;
    // Subscribe to bottle detection, timeout, and status topics
      mqttClient.subscribe("machines/+/bottle_detected");
      mqttClient.subscribe("machines/+/timeout");
      mqttClient.subscribe("machines/+/status");
      console.log(
        "Subscribed to MQTT topics: machines/+/bottle_detected, machines/+/timeout, machines/+/status"
      );
    });

    mqttClient.on("error", (error) => {
      console.error("MQTT connection error:", error);
      isConnected = false;
    });

    mqttClient.on("close", () => {
      console.log("MQTT connection closed");
      isConnected = false;
    });

    mqttClient.on("reconnect", () => {
      console.log("MQTT reconnecting...");
    });

mqttClient.on("message", async (topic, message) => {
  try {
    const messageStr = message.toString();
    const topicParts = topic.split("/");
    const machineCode = topicParts[1];
    const action = topicParts[2];

    console.log(`MQTT message received: ${topic} - ${messageStr}`);

    if (action === "bottle_detected") {
      const payload = JSON.parse(messageStr);
      // Handle bottle detection - record to database
      console.log(`Bottle detected at ${machineCode}:`, payload);

      // Find the machine
      const [machine] = await db
        .select()
        .from(schema.rooms)
        .where(eq(schema.rooms.code, machineCode))
        .limit(1);

      if (!machine) {
        console.log(`Machine ${machineCode} not found`);
        return;
      }

      // Find active bottle collection for this machine (unverified = active session)
      const [activeCollection] = await db
        .select()
        .from(schema.bottleCollections)
        .where(
          and(
            eq(schema.bottleCollections.roomId, machine.id),
            eq(schema.bottleCollections.verified, false)
          )
        )
        .orderBy(schema.bottleCollections.createdAt)
        .limit(1);

      if (!activeCollection) {
        console.log(
          `No active collection found for machine ${machineCode}`
        );
        return;
      }

      // Increment bottle count (1 bottle per detection, 10 points per bottle)
      const newTotalBottles = activeCollection.totalBottles + 1;
      const newPointsAwarded = newTotalBottles * 10;

      // Update bottle collection
      await db
        .update(schema.bottleCollections)
        .set({
          totalBottles: newTotalBottles,
          pointsAwarded: newPointsAwarded,
          notes: `Updated at ${new Date().toISOString()}`,
        })
        .where(eq(schema.bottleCollections.id, activeCollection.id));

      console.log(
        `Updated collection: ${newTotalBottles} bottles, ${newPointsAwarded} points`
      );

      // Update last activity timestamp
      machineLastActivity.set(machineCode, Date.now());

      // Send real-time update to WebSocket clients
      websocketService.sendBottleUpdate(machineCode, newTotalBottles, newPointsAwarded);

      // Broadcast to admin dashboard
      websocketService.broadcastRoomUpdate({
        roomCode: machineCode,
        status: "in_use",
        bottleCount: newTotalBottles,
        points: newPointsAwarded,
        connected: true,
        lastActivity: new Date().toISOString()
      });

    } else if (action === "timeout") {
      // Handle session timeout - end session automatically
      console.log(`Session timeout at ${machineCode}:`, messageStr);

      // Find the active session for this machine
      const [machine] = await db
        .select()
        .from(schema.rooms)
        .where(eq(schema.rooms.code, machineCode))
        .limit(1);

      if (!machine) return;

      // Find active bottle collection
      const [activeCollection] = await db
        .select()
        .from(schema.bottleCollections)
        .where(
          and(
            eq(schema.bottleCollections.roomId, machine.id),
            eq(schema.bottleCollections.verified, false)
          )
        )
        .orderBy(schema.bottleCollections.createdAt)
        .limit(1);

      if (!activeCollection) return;

      // End session with current bottle count
      const totalBottles = activeCollection.totalBottles;
      const points = totalBottles * 10;

      // Get user for wallet update
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, activeCollection.userId))
        .limit(1);

      if (user) {
        // Update wallet
        const [wallet] = await db
          .select()
          .from(schema.wallets)
          .where(eq(schema.wallets.userId, activeCollection.userId))
          .limit(1);

        if (wallet) {
          const newBalance = (wallet.pointsBalance || 0) + points;
          await db
            .update(schema.wallets)
            .set({ pointsBalance: newBalance, updatedAt: new Date() })
            .where(eq(schema.wallets.userId, activeCollection.userId));

          // Record transaction
          await db.insert(schema.walletTransactions).values({
            walletId: wallet.id,
            changeAmount: points,
            type: "credit",
            refId: machine.id, 
            refTable: "rooms",
            description: `Auto-ended session at room ${machine.code}`,
            balanceAfter: newBalance,
          });
        }
      }

      // Update bottle collection as completed
      await db
        .update(schema.bottleCollections)
        .set({
          verified: true,
          verifiedBy: activeCollection.userId,
          verifiedAt: new Date(),
          notes: `Auto-ended due to timeout at ${new Date().toISOString()}`,
        })
        .where(eq(schema.bottleCollections.id, activeCollection.id));

      // Reactivate machine
      await db
        .update(schema.rooms)
        .set({
          isActive: true,
          currentUserId: null,
          status: "idle"
        })
        .where(eq(schema.rooms.id, machine.id));

      console.log(
        `Session auto-ended for ${machineCode}, awarded ${points} points`
      );

      // Update last activity timestamp
      machineLastActivity.set(machineCode, Date.now());

      // Broadcast to admin dashboard
      websocketService.broadcastRoomUpdate({
        roomCode: machineCode,
        status: "idle",
        connected: true,
        issue: "Session ended due to timeout",
        lastActivity: new Date().toISOString()
      });

    } else if (action === "status") {
      // Handle IoT device online/offline status using LWT (Last Will and Testament)
      const isOnline = messageStr === "online";
      console.log(`Machine ${machineCode} status: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

      // Update machine online status in database
      const [machine] = await db
        .select()
        .from(schema.rooms)
        .where(eq(schema.rooms.code, machineCode))
        .limit(1);

      if (!machine) {
        console.log(`Machine ${machineCode} not found in database`);
        return;
      }

      // Update online status and last seen timestamp
      await db
        .update(schema.rooms)
        .set({
          isOnline: isOnline,
          lastSeen: new Date(),
        })
        .where(eq(schema.rooms.id, machine.id));

      // Update last activity timestamp
      machineLastActivity.set(machineCode, Date.now());

      let issue: string | undefined = undefined;
      let status = machine.status;

      if (isOnline) {
        // Device came online - check for stuck sessions
        console.log(`Machine ${machineCode} came online - checking for stuck sessions`);

        // Check if machine was stuck in "in_use" state
        if (machine.status === "in_use" && machine.currentUserId) {
          console.log(`Stuck session detected for machine ${machineCode} - recovering...`);

          // Find active bottle collection
          const [activeCollection] = await db
            .select()
            .from(schema.bottleCollections)
            .where(
              and(
                eq(schema.bottleCollections.roomId, machine.id),
                eq(schema.bottleCollections.verified, false)
              )
            )
            .orderBy(schema.bottleCollections.createdAt)
            .limit(1);

          if (activeCollection) {
            // End the stuck session
            const totalBottles = activeCollection.totalBottles;
            const points = totalBottles * 10;

            // Get user for wallet update
            const [user] = await db
              .select()
              .from(schema.users)
              .where(eq(schema.users.id, activeCollection.userId))
              .limit(1);

            if (user) {
              // Update wallet
              const [wallet] = await db
                .select()
                .from(schema.wallets)
                .where(eq(schema.wallets.userId, activeCollection.userId))
                .limit(1);

              if (wallet) {
                const newBalance = (wallet.pointsBalance || 0) + points;
                await db
                  .update(schema.wallets)
                  .set({ pointsBalance: newBalance, updatedAt: new Date() })
                  .where(eq(schema.wallets.userId, activeCollection.userId));

                // Record transaction
                await db.insert(schema.walletTransactions).values({
                  walletId: wallet.id,
                  changeAmount: points,
                  type: "credit",
                  refId: machine.id,
                  refTable: "rooms",
                  description: `Recovered stuck session at room ${machine.code}`,
                  balanceAfter: newBalance,
                });
              }
            }

            // Update bottle collection as completed
            await db
              .update(schema.bottleCollections)
              .set({
                verified: true,
                verifiedBy: activeCollection.userId,
                verifiedAt: new Date(),
                notes: `Recovered stuck session due to ESP restart at ${new Date().toISOString()}`,
              })
              .where(eq(schema.bottleCollections.id, activeCollection.id));

            issue = "Stuck session recovered";
            status = "idle";
          }

          // Reactivate machine
          await db
            .update(schema.rooms)
            .set({
              isActive: true,
              currentUserId: null,
              status: "idle"
            })
            .where(eq(schema.rooms.id, machine.id));

          console.log(`Stuck session recovered for machine ${machineCode}`);
        } else {
          console.log(`Machine ${machineCode} is in normal state - no recovery needed`);
        }
      } else {
        // Device went offline
        console.log(`Machine ${machineCode} went offline`);
        issue = "IoT device disconnected";
      }

      // Broadcast to admin dashboard
      websocketService.broadcastRoomUpdate({
        roomCode: machineCode,
        status: status,
        connected: isOnline,
        issue: issue,
        lastActivity: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("MQTT message processing error:", error);
  }
});
  },

  publish: async (topic: string, message: string): Promise<boolean> => {
    if (!isConnected) {
      console.error("MQTT not connected, cannot publish");
      return false;
    }

    try {
      mqttClient.publish(topic, message);
      return true;
    } catch (error) {
      console.error("MQTT publish error:", error);
      return false;
    }
  },

  disconnect: () => {
    if (isConnected) {
      mqttClient.end();
      isConnected = false;
    }
  },
};

// Initialize connection
mqttService.connect();

export default mqttService;
