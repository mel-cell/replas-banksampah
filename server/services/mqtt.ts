import mqtt from "mqtt";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

const mqttClient = mqtt.connect("mqtt://test.mosquitto.org", { //ubah nanti jadi broker yang bener
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
      // Subscribe to bottle detection and timeout topics
      mqttClient.subscribe("machines/+/bottle_detected");
      mqttClient.subscribe("machines/+/timeout");
      console.log(
        "Subscribed to MQTT topics: machines/+/bottle_detected, machines/+/timeout"
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
        const payload = JSON.parse(message.toString());
        const topicParts = topic.split("/");
        const machineCode = topicParts[1];
        const action = topicParts[2];

        console.log(`MQTT message received: ${topic}`, payload);

        if (action === "bottle_detected") {
          // Handle bottle detection - record to database
          console.log(`Bottle detected at ${machineCode}:`, payload);

          // Find the active machine and session
          const [machine] = await db
            .select()
            .from(schema.rooms)
            .where(eq(schema.rooms.code, machineCode))
            .limit(1);

          if (!machine || machine.isActive) {
            console.log(`Machine ${machineCode} not in active session`);
            return;
          }

          // Find active bottle collection for this machine
          const [activeCollection] = await db
            .select()
            .from(schema.bottleCollections)
            .where(eq(schema.bottleCollections.roomId, machine.id))
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

          // TODO: Emit event or forward to WebSocket for real-time UI update
        } else if (action === "timeout") {
          // Handle session timeout - end session automatically
          console.log(`Session timeout at ${machineCode}:`, payload);

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
            .where(eq(schema.bottleCollections.roomId, machine.id))
            .orderBy(schema.bottleCollections.createdAt)
            .limit(1);

          if (!activeCollection) return;

          // End session with current bottle count
          const totalBottles = activeCollection.totalBottles;
          const points = totalBottles * 10;

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
              refId: 0, // Use 0 for now since machine.id is UUID
              refTable: "rooms",
              description: `Auto-ended session at room ${machine.code}`,
              balanceAfter: newBalance,
            });
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
            .set({ isActive: true })
            .where(eq(schema.rooms.id, machine.id));

          console.log(
            `Session auto-ended for ${machineCode}, awarded ${points} points`
          );
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
