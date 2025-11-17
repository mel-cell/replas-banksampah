import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { authMiddleware } from "../lib/auth";
import { eq, and, desc, ne } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });
const admin = new Hono<{ Variables: { session: any } }>();

// Middleware to get session and check admin role
admin.use("*", authMiddleware, async (c, next) => {
  const payload = c.get("jwtPayload");
  if (payload.role !== "admin") {
    return c.json({ error: "Admin access required" }, 403);
  }
  await next();
});

// Get current exchange rate
admin.get("/exchange-rate", async (c) => {
  const [rate] = await db
    .select()
    .from(schema.exchangeRateSettings)
    .where(eq(schema.exchangeRateSettings.isActive, true))
    .limit(1);

  if (!rate) {
    return c.json({
      pointsPerBottle: 1,
      rupiahPerPoint: 75.00,
      message: "Using default rates"
    });
  }

  return c.json({
    id: rate.id,
    pointsPerBottle: rate.pointsPerBottle,
    rupiahPerPoint: parseFloat(rate.rupiahPerPoint),
    updatedBy: rate.updatedBy,
    updatedAt: rate.updatedAt,
  });
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

export { admin };
