import { Hono } from "hono";
import * as schema from "../db/schema";
import { authMiddleware } from "../lib/auth";
import { eq, and, desc, ne, sql } from "drizzle-orm";
import mqttService from "./mqtt";
import { db } from "../lib/db";
import { redisClient, connectRedis } from "../lib/redis";
const admin = new Hono<{ Variables: { session: any } }>();

// Middleware to get session and check admin role
admin.use("*", authMiddleware, async (c, next) => {
  const payload = c.get("jwtPayload");
  if (payload.role !== "admin") {
    return c.json({ error: "Admin access required" }, 403);
  }
  await next();
});

// Get MQTT connection status
admin.get("/mqtt-status", async (c) => {
  const isConnected = mqttService.isConnected();
  return c.json({
    mqttConnected: isConnected,
    status: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Get current exchange rate (cached 24h)
admin.get("/exchange-rate", async (c) => {
  await connectRedis();
  const cacheKey = "exchange_rate";

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  const [rate] = await db
    .select()
    .from(schema.exchangeRateSettings)
    .where(eq(schema.exchangeRateSettings.isActive, true))
    .limit(1);

  const response = !rate ? {
    pointsPerBottle: 1,
    rupiahPerPoint: 75.00,
    message: "Using default rates"
  } : {
    id: rate.id,
    pointsPerBottle: rate.pointsPerBottle,
    rupiahPerPoint: parseFloat(rate.rupiahPerPoint),
    updatedBy: rate.updatedBy,
    updatedAt: rate.updatedAt,
  };

  await redisClient.setEx(cacheKey, 86400, JSON.stringify(response)); // 24h TTL
  return c.json(response);
});

// Update exchange rate
admin.put("/exchange-rate", async (c) => {
  const payload = c.get("jwtPayload");
  const { pointsPerBottle, rupiahPerPoint } = await c.req.json();

  if (!pointsPerBottle || pointsPerBottle <= 0) {
    return c.json({ error: "Invalid points per bottle" }, 400);
  }

  if (!rupiahPerPoint || rupiahPerPoint <= 0) {
    return c.json({ error: "Invalid rupiah per point" }, 400);
  }

  // Deactivate current active rate
  await db
    .update(schema.exchangeRateSettings)
    .set({ isActive: false })
    .where(eq(schema.exchangeRateSettings.isActive, true));

  // Create new active rate
  const [newRate] = await db
    .insert(schema.exchangeRateSettings)
    .values({
      pointsPerBottle,
      rupiahPerPoint: rupiahPerPoint.toString(),
      isActive: true,
      updatedBy: payload.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // Invalidate cache on update
  await connectRedis();
  await redisClient.del("exchange_rate");

  return c.json({
    success: true,
    rate: {
      id: newRate.id,
      pointsPerBottle: newRate.pointsPerBottle,
      rupiahPerPoint: parseFloat(newRate.rupiahPerPoint),
      updatedAt: newRate.updatedAt,
    },
  });
});

// Get all conversion requests
admin.get("/conversion-requests", async (c) => {
  const requests = await db
    .select({
      id: schema.conversionRequests.id,
      pointsAmount: schema.conversionRequests.pointsAmount,
      moneyAmount: schema.conversionRequests.moneyAmount,
      status: schema.conversionRequests.status,
      accountNumber: schema.conversionRequests.accountNumber,
      accountName: schema.conversionRequests.accountName,
      notes: schema.conversionRequests.notes,
      processedBy: schema.conversionRequests.processedBy,
      processedAt: schema.conversionRequests.processedAt,
      requestAt: schema.conversionRequests.requestAt,
      user: {
        id: schema.users.id,
        username: schema.users.username,
        fullname: schema.users.fullname,
        email: schema.users.email,
      },
      method: {
        id: schema.paymentMethod.id,
        methodName: schema.paymentMethod.methodName,
        type: schema.paymentMethod.type,
      },
    })
    .from(schema.conversionRequests)
    .leftJoin(schema.users, eq(schema.conversionRequests.userId, schema.users.id))
    .leftJoin(
      schema.paymentMethod,
      eq(schema.conversionRequests.methodId, schema.paymentMethod.id)
    )
    .orderBy(desc(schema.conversionRequests.requestAt));

  return c.json({
    requests: requests.map(req => ({
      ...req,
      moneyAmount: parseFloat(req.moneyAmount),
    })),
  });
});

// Approve or reject conversion request
admin.patch("/conversion-requests/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const { id } = c.req.param();
  const { action, notes } = await c.req.json(); // action: 'approve' or 'reject'

  if (!["approve", "reject"].includes(action)) {
    return c.json({ error: "Invalid action" }, 400);
  }

  // Get the request
  const [request] = await db
    .select()
    .from(schema.conversionRequests)
    .where(eq(schema.conversionRequests.id, id))
    .limit(1);

  if (!request) {
    return c.json({ error: "Request not found" }, 404);
  }

  if (request.status !== "pending") {
    return c.json({ error: "Request already processed" }, 400);
  }

  const newStatus = action === "approve" ? "approved" : "rejected";

  if (action === "approve") {
    // Check if user has sufficient balance
    const [wallet] = await db
      .select()
      .from(schema.wallets)
      .where(eq(schema.wallets.userId, request.userId))
      .limit(1);

    if (!wallet || (wallet.pointsBalance || 0) < request.pointsAmount) {
      return c.json({ error: "User has insufficient points balance" }, 400);
    }

    // Deduct points from wallet
    const newBalance = (wallet.pointsBalance || 0) - request.pointsAmount;
    await db
      .update(schema.wallets)
      .set({ pointsBalance: newBalance, updatedAt: new Date() })
      .where(eq(schema.wallets.userId, request.userId));

    // Record transaction
    await db.insert(schema.walletTransactions).values({
      walletId: wallet.id,
      changeAmount: -request.pointsAmount,
      type: "debit",
      refId: request.id,
      refTable: "conversion_requests",
      description: `Point conversion to ${request.moneyAmount} Rupiah`,
      balanceAfter: newBalance,
    });
  }

  // Update request status
  const [updatedRequest] = await db
    .update(schema.conversionRequests)
    .set({
      status: newStatus,
      processedBy: payload.userId,
      processedAt: new Date(),
      notes: notes || request.notes,
    })
    .where(eq(schema.conversionRequests.id, id))
    .returning();

  return c.json({
    success: true,
    request: {
      id: updatedRequest.id,
      status: updatedRequest.status,
      processedAt: updatedRequest.processedAt,
    },
  });
});

// Get exchange rate history
admin.get("/exchange-rate-history", async (c) => {
  const history = await db
    .select({
      id: schema.exchangeRateSettings.id,
      pointsPerBottle: schema.exchangeRateSettings.pointsPerBottle,
      rupiahPerPoint: schema.exchangeRateSettings.rupiahPerPoint,
      isActive: schema.exchangeRateSettings.isActive,
      updatedBy: schema.exchangeRateSettings.updatedBy,
      createdAt: schema.exchangeRateSettings.createdAt,
      updatedAt: schema.exchangeRateSettings.updatedAt,
      admin: {
        username: schema.users.username,
        fullname: schema.users.fullname,
      },
    })
    .from(schema.exchangeRateSettings)
    .leftJoin(schema.users, eq(schema.exchangeRateSettings.updatedBy, schema.users.id))
    .orderBy(desc(schema.exchangeRateSettings.createdAt));

  return c.json({
    history: history.map(item => ({
      ...item,
      rupiahPerPoint: parseFloat(item.rupiahPerPoint),
    })),
  });
});

// Get all users
admin.get("/users", async (c) => {
  const users = await db.select({
    id: schema.users.id,
    username: schema.users.username,
    fullname: schema.users.fullname,
    email: schema.users.email,
    phone: schema.users.phone,
    role: schema.users.role,
    isActive: schema.users.isActive,
    location: schema.users.location,
    nisn: schema.users.nisn,
    studentClass: schema.users.studentClass,
    school: schema.users.school,
    lastActive: schema.users.lastActive,
    createdAt: schema.users.createdAt,
    pointsBalance: schema.wallets.pointsBalance,
    totalBottles: schema.wallets.totalBottles,
  })
  .from(schema.users)
  .leftJoin(schema.wallets, eq(schema.users.id, schema.wallets.userId))
  .orderBy(desc(schema.users.createdAt));

  return c.json({ users });
});

// Get user by ID
admin.get("/users/:id", async (c) => {
  const { id } = c.req.param();
  const [user] = await db.select({
    id: schema.users.id,
    username: schema.users.username,
    fullname: schema.users.fullname,
    email: schema.users.email,
    phone: schema.users.phone,
    role: schema.users.role,
    isActive: schema.users.isActive,
    location: schema.users.location,
    nisn: schema.users.nisn,
    studentClass: schema.users.studentClass,
    school: schema.users.school,
    lastActive: schema.users.lastActive,
    createdAt: schema.users.createdAt,
    pointsBalance: schema.wallets.pointsBalance,
    totalBottles: schema.wallets.totalBottles,
  })
  .from(schema.users)
  .leftJoin(schema.wallets, eq(schema.users.id, schema.wallets.userId))
  .where(eq(schema.users.id, id))
  .limit(1);

  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json({ user });
});

// Update user
admin.put("/users/:id", async (c) => {
  const { id } = c.req.param();
  const { fullname, email, phone, role, isActive } = await c.req.json();

  const [updatedUser] = await db.update(schema.users)
    .set({ fullname, email, phone, role, isActive })
    .where(eq(schema.users.id, id))
    .returning();

  if (!updatedUser) return c.json({ error: "User not found" }, 404);
  return c.json({ user: updatedUser });
});

// Delete user
admin.delete("/users/:id", async (c) => {
  const { id } = c.req.param();
  const [deletedUser] = await db.delete(schema.users)
    .where(eq(schema.users.id, id))
    .returning();

  if (!deletedUser) return c.json({ error: "User not found" }, 404);
  return c.json({ message: "User deleted" });
});

// Get all rooms
admin.get("/rooms", async (c) => {
  const rooms = await db.select({
    id: schema.rooms.id,
    code: schema.rooms.code,
    name: schema.rooms.name,
    location: schema.rooms.location,
    status: schema.rooms.status,
    isActive: schema.rooms.isActive,
    currentUserId: schema.rooms.currentUserId,
    createdAt: schema.rooms.createdAt,
  })
  .from(schema.rooms)
  .orderBy(schema.rooms.createdAt);

  return c.json({ rooms });
});

// Create room
admin.post("/rooms", async (c) => {
  const { code, name, location } = await c.req.json();
  const [room] = await db.insert(schema.rooms)
    .values({ code, name, location, status: "idle", isActive: true })
    .returning();

  return c.json({ room });
});

// Update room
admin.put("/rooms/:id", async (c) => {
  const { id } = c.req.param();
  const { code, name, location, isActive } = await c.req.json();

  const [updatedRoom] = await db.update(schema.rooms)
    .set({ code, name, location, isActive })
    .where(eq(schema.rooms.id, id))
    .returning();

  if (!updatedRoom) return c.json({ error: "Room not found" }, 404);
  return c.json({ room: updatedRoom });
});

// Delete room
admin.delete("/rooms/:id", async (c) => {
  const { id } = c.req.param();
  const [deletedRoom] = await db.delete(schema.rooms)
    .where(eq(schema.rooms.id, id))
    .returning();

  if (!deletedRoom) return c.json({ error: "Room not found" }, 404);
  return c.json({ message: "Room deleted" });
});

// Get all conversions
admin.get("/conversions", async (c) => {
  const payload = c.get("jwtPayload");

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const conversions = await db.select({
    id: schema.conversionRequests.id,
    userId: schema.conversionRequests.userId,
    pointsAmount: schema.conversionRequests.pointsAmount,
    moneyAmount: schema.conversionRequests.moneyAmount,
    status: schema.conversionRequests.status,
    accountNumber: schema.conversionRequests.accountNumber,
    accountName: schema.conversionRequests.accountName,
    notes: schema.conversionRequests.notes,
    requestAt: schema.conversionRequests.requestAt,
    processedAt: schema.conversionRequests.processedAt,
    methodName: schema.paymentMethod.methodName,
    methodType: schema.paymentMethod.type,
    userName: schema.users.username,
    userEmail: schema.users.email,
  })
  .from(schema.conversionRequests)
  .innerJoin(schema.paymentMethod, eq(schema.conversionRequests.methodId, schema.paymentMethod.id))
  .innerJoin(schema.users, eq(schema.conversionRequests.userId, schema.users.id))
  .orderBy(desc(schema.conversionRequests.requestAt));

  return c.json({ conversions });
});

// Get conversion by ID
admin.get("/conversions/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const conversionId = c.req.param('id');

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const [conversion] = await db.select({
    id: schema.conversionRequests.id,
    userId: schema.conversionRequests.userId,
    pointsAmount: schema.conversionRequests.pointsAmount,
    moneyAmount: schema.conversionRequests.moneyAmount,
    status: schema.conversionRequests.status,
    accountNumber: schema.conversionRequests.accountNumber,
    accountName: schema.conversionRequests.accountName,
    notes: schema.conversionRequests.notes,
    requestAt: schema.conversionRequests.requestAt,
    processedAt: schema.conversionRequests.processedAt,
    methodName: schema.paymentMethod.methodName,
    methodType: schema.paymentMethod.type,
    userName: schema.users.username,
    userEmail: schema.users.email,
  })
  .from(schema.conversionRequests)
  .innerJoin(schema.paymentMethod, eq(schema.conversionRequests.methodId, schema.paymentMethod.id))
  .innerJoin(schema.users, eq(schema.conversionRequests.userId, schema.users.id))
  .where(eq(schema.conversionRequests.id, conversionId))
  .limit(1);

  if (!conversion) return c.json({ error: "Conversion not found" }, 404);
  return c.json({ conversion });
});

// Get all bottle collections
admin.get("/bottle-collections", async (c) => {
  const collections = await db.select({
    id: schema.bottleCollections.id,
    userId: schema.bottleCollections.userId,
    roomId: schema.bottleCollections.roomId,
    totalBottles: schema.bottleCollections.totalBottles,
    pointsAwarded: schema.bottleCollections.pointsAwarded,
    verified: schema.bottleCollections.verified,
    verifiedBy: schema.bottleCollections.verifiedBy,
    verifiedAt: schema.bottleCollections.verifiedAt,
    notes: schema.bottleCollections.notes,
    createdAt: schema.bottleCollections.createdAt,
    user: {
      username: schema.users.username,
      fullname: schema.users.fullname,
    },
    room: {
      code: schema.rooms.code,
      name: schema.rooms.name,
    },
  })
  .from(schema.bottleCollections)
  .leftJoin(schema.users, eq(schema.bottleCollections.userId, schema.users.id))
  .leftJoin(schema.rooms, eq(schema.bottleCollections.roomId, schema.rooms.id))
  .orderBy(desc(schema.bottleCollections.createdAt));

  return c.json({ collections });
});

// Get bottle collection by ID
admin.get("/bottle-collections/:id", async (c) => {
  const { id } = c.req.param();
  const [collection] = await db.select({
    id: schema.bottleCollections.id,
    userId: schema.bottleCollections.userId,
    roomId: schema.bottleCollections.roomId,
    totalBottles: schema.bottleCollections.totalBottles,
    pointsAwarded: schema.bottleCollections.pointsAwarded,
    verified: schema.bottleCollections.verified,
    verifiedBy: schema.bottleCollections.verifiedBy,
    verifiedAt: schema.bottleCollections.verifiedAt,
    notes: schema.bottleCollections.notes,
    createdAt: schema.bottleCollections.createdAt,
    user: {
      username: schema.users.username,
      fullname: schema.users.fullname,
    },
    room: {
      code: schema.rooms.code,
      name: schema.rooms.name,
    },
  })
  .from(schema.bottleCollections)
  .leftJoin(schema.users, eq(schema.bottleCollections.userId, schema.users.id))
  .leftJoin(schema.rooms, eq(schema.bottleCollections.roomId, schema.rooms.id))
  .where(eq(schema.bottleCollections.id, id))
  .limit(1);

  if (!collection) return c.json({ error: "Bottle collection not found" }, 404);
  return c.json({ collection });
});

// Get waste types (assuming payment method types)
admin.get("/waste-types", async (c) => {
  const types = await db.select({ type: schema.paymentMethod.type })
    .from(schema.paymentMethod)
    .groupBy(schema.paymentMethod.type);

  return c.json({ types: types.map(t => t.type) });
});

// Create waste type (not applicable, as types are enum)
admin.post("/waste-types", async (c) => {
  return c.json({ error: "Waste types are predefined enums" }, 400);
});

// Update/Delete waste types (not applicable)
admin.put("/waste-types/:id", async (c) => {
  return c.json({ error: "Waste types cannot be updated" }, 400);
});

admin.delete("/waste-types/:id", async (c) => {
  return c.json({ error: "Waste types cannot be deleted" }, 400);
});

// Get conversion rates (cached 24h, same as exchange-rate)
admin.get("/conversion-rates", async (c) => {
  await connectRedis();
  const cacheKey = "exchange_rate";

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  const [rate] = await db
    .select()
    .from(schema.exchangeRateSettings)
    .where(eq(schema.exchangeRateSettings.isActive, true))
    .limit(1);

  const response = !rate ? {
    pointsPerBottle: 1,
    rupiahPerPoint: 75.00,
    message: "Using default rates"
  } : {
    id: rate.id,
    pointsPerBottle: rate.pointsPerBottle,
    rupiahPerPoint: parseFloat(rate.rupiahPerPoint),
    updatedBy: rate.updatedBy,
    updatedAt: rate.updatedAt,
  };

  await redisClient.setEx(cacheKey, 86400, JSON.stringify(response)); // 24h TTL
  return c.json(response);
});

// Create conversion rate
admin.post("/conversion-rates", async (c) => {
  const payload = c.get("jwtPayload");
  const { pointsPerBottle, rupiahPerPoint } = await c.req.json();

  await db.update(schema.exchangeRateSettings).set({ isActive: false }).where(eq(schema.exchangeRateSettings.isActive, true));

  const [rate] = await db.insert(schema.exchangeRateSettings)
    .values({ pointsPerBottle, rupiahPerPoint: rupiahPerPoint.toString(), isActive: true, updatedBy: payload.userId })
    .returning();

  await connectRedis();
  await redisClient.del("exchange_rate");

  return c.json({ rate });
});

// Update conversion rate
admin.put("/conversion-rates/:id", async (c) => {
  const { id } = c.req.param();
  const payload = c.get("jwtPayload");
  const { pointsPerBottle, rupiahPerPoint } = await c.req.json();

  const [updatedRate] = await db.update(schema.exchangeRateSettings)
    .set({ pointsPerBottle, rupiahPerPoint: rupiahPerPoint.toString(), updatedBy: payload.userId })
    .where(eq(schema.exchangeRateSettings.id, id))
    .returning();

  if (!updatedRate) return c.json({ error: "Rate not found" }, 404);

  await connectRedis();
  await redisClient.del("exchange_rate");

  return c.json({ rate: updatedRate });
});

// Delete conversion rate
admin.delete("/conversion-rates/:id", async (c) => {
  const { id } = c.req.param();
  const [deletedRate] = await db.delete(schema.exchangeRateSettings)
    .where(eq(schema.exchangeRateSettings.id, id))
    .returning();

  if (!deletedRate) return c.json({ error: "Rate not found" }, 404);

  await connectRedis();
  await redisClient.del("exchange_rate");

  return c.json({ message: "Rate deleted" });
});

// Get exchange rate settings
admin.get("/exchange-rate-settings", async (c) => {
  const settings = await db.select()
    .from(schema.exchangeRateSettings)
    .orderBy(desc(schema.exchangeRateSettings.createdAt));

  return c.json({ settings });
});

// Create exchange rate setting
admin.post("/exchange-rate-settings", async (c) => {
  const payload = c.get("jwtPayload");
  const { pointsPerBottle, rupiahPerPoint } = await c.req.json();

  const [setting] = await db.insert(schema.exchangeRateSettings)
    .values({ pointsPerBottle, rupiahPerPoint: rupiahPerPoint.toString(), updatedBy: payload.userId })
    .returning();

  return c.json({ setting });
});

// Update exchange rate setting
admin.put("/exchange-rate-settings/:id", async (c) => {
  const { id } = c.req.param();
  const payload = c.get("jwtPayload");
  const { pointsPerBottle, rupiahPerPoint, isActive } = await c.req.json();

  const [updatedSetting] = await db.update(schema.exchangeRateSettings)
    .set({ pointsPerBottle, rupiahPerPoint: rupiahPerPoint.toString(), isActive, updatedBy: payload.userId })
    .where(eq(schema.exchangeRateSettings.id, id))
    .returning();

  if (!updatedSetting) return c.json({ error: "Setting not found" }, 404);

  await connectRedis();
  await redisClient.del("exchange_rate");

  return c.json({ setting: updatedSetting });
});

// Delete exchange rate setting
admin.delete("/exchange-rate-settings/:id", async (c) => {
  const { id } = c.req.param();
  const [deletedSetting] = await db.delete(schema.exchangeRateSettings)
    .where(eq(schema.exchangeRateSettings.id, id))
    .returning();

  if (!deletedSetting) return c.json({ error: "Setting not found" }, 404);
  return c.json({ message: "Setting deleted" });
});

// Get wallet transactions
admin.get("/wallet-transactions", async (c) => {
  const transactions = await db.select({
    id: schema.walletTransactions.id,
    walletId: schema.walletTransactions.walletId,
    changeAmount: schema.walletTransactions.changeAmount,
    type: schema.walletTransactions.type,
    refId: schema.walletTransactions.refId,
    refTable: schema.walletTransactions.refTable,
    description: schema.walletTransactions.description,
    balanceAfter: schema.walletTransactions.balanceAfter,
    createdAt: schema.walletTransactions.createdAt,
    user: {
      username: schema.users.username,
      fullname: schema.users.fullname,
    },
  })
  .from(schema.walletTransactions)
  .leftJoin(schema.wallets, eq(schema.walletTransactions.walletId, schema.wallets.id))
  .leftJoin(schema.users, eq(schema.wallets.userId, schema.users.id))
  .orderBy(desc(schema.walletTransactions.createdAt));

  return c.json({ transactions });
});

// Get dashboard stats
admin.get("/dashboard/stats", async (c) => {
  await connectRedis();
  const cacheKey = "admin_dashboard_stats";
  let stats = await redisClient.get(cacheKey);
  if (stats) return c.json(JSON.parse(stats));

  const totalUsers = await db.$count(schema.users);
  const totalConversions = await db.$count(schema.conversionRequests);
  const totalBottleCollections = await db.$count(schema.bottleCollections);
  const totalRooms = await db.$count(schema.rooms);

  const statsObj = { totalUsers, totalConversions, totalBottleCollections, totalRooms };
  await redisClient.setEx(cacheKey, 600, JSON.stringify(statsObj)); // 10min

  return c.json(statsObj);
});

// Get monthly admin report
admin.get("/reports/monthly", async (c) => {
  const { year, month } = c.req.query();
  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  const collections = await db.select()
    .from(schema.bottleCollections)
    .where(sql`${schema.bottleCollections.createdAt} >= ${startDate} AND ${schema.bottleCollections.createdAt} <= ${endDate}`);

  const conversions = await db.select()
    .from(schema.conversionRequests)
    .where(sql`${schema.conversionRequests.requestAt} >= ${startDate} AND ${schema.conversionRequests.requestAt} <= ${endDate}`);

  return c.json({ collections, conversions });
});

export { admin };
