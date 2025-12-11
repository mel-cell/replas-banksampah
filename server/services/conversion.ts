import { Hono } from "hono";
import * as schema from "../db/schema";
import { authMiddleware } from "../lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../lib/db";
import { redisClient, connectRedis } from "../lib/redis";
const conversion = new Hono<{ Variables: { session: any } }>();

// Middleware to get session
conversion.use("*", authMiddleware, async (c, next) => {
  await next();
});

// Create conversion request
conversion.post("/request", async (c) => {
  const payload = c.get("jwtPayload");
  const { pointsAmount, methodId, accountNumber, accountName, notes } = await c.req.json();

  if (!pointsAmount || pointsAmount <= 0) {
    return c.json({ error: "Invalid points amount" }, 400);
  }

  // Get user
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, payload.userId))
    .limit(1);
  if (!user) return c.json({ error: "User not found" }, 404);

  // Get user wallet
  const [wallet] = await db
    .select()
    .from(schema.wallets)
    .where(eq(schema.wallets.userId, user.id.toString()))
    .limit(1);

  if (!wallet || (wallet.pointsBalance || 0) < pointsAmount) {
    return c.json({ error: "Insufficient points balance" }, 400);
  }

  // Get payment method
  const [paymentMethod] = await db
    .select()
    .from(schema.paymentMethod)
    .where(and(
      eq(schema.paymentMethod.id, methodId),
      eq(schema.paymentMethod.isActive, true)
    ))
    .limit(1);

  if (!paymentMethod) {
    return c.json({ error: "Invalid payment method" }, 400);
  }

  // Get current exchange rate
  const [exchangeRate] = await db
    .select()
    .from(schema.exchangeRateSettings)
    .where(eq(schema.exchangeRateSettings.isActive, true))
    .limit(1);

  const rupiahPerPoint = parseFloat(exchangeRate?.rupiahPerPoint || "75.00");
  const moneyAmount = pointsAmount * rupiahPerPoint;

  // Create conversion request
  const [request] = await db
    .insert(schema.conversionRequests)
    .values({
      userId: user.id,
      methodId: paymentMethod.id,
      pointsAmount,
      moneyAmount: moneyAmount.toString(),
      accountNumber,
      accountName,
      notes,
      status: "pending",
      requestAt: new Date(),
    })
    .returning();

  return c.json({
    success: true,
    request: {
      id: request.id,
      pointsAmount: request.pointsAmount,
      moneyAmount: parseFloat(request.moneyAmount),
      rupiahPerPoint,
      status: request.status,
      createdAt: request.requestAt,
    },
  });
});

// Get user's conversion requests
conversion.get("/request", async (c) => {
  const payload = c.get("jwtPayload");

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
      method: {
        id: schema.paymentMethod.id,
        methodName: schema.paymentMethod.methodName,
        type: schema.paymentMethod.type,
      },
    })
    .from(schema.conversionRequests)
    .leftJoin(
      schema.paymentMethod,
      eq(schema.conversionRequests.methodId, schema.paymentMethod.id)
    )
    .where(eq(schema.conversionRequests.userId, payload.userId))
    .orderBy(desc(schema.conversionRequests.requestAt));

  return c.json({
    requests: requests.map(req => ({
      ...req,
      moneyAmount: parseFloat(req.moneyAmount),
    })),
  });
});

// Get available payment methods (cached 24h)
conversion.get("/payment-methods", async (c) => {
  await connectRedis();
  const cacheKey = "payment_methods";

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return c.json({ methods: JSON.parse(cached) });
  }

  const methods = await db
    .select({
      id: schema.paymentMethod.id,
      methodName: schema.paymentMethod.methodName,
      type: schema.paymentMethod.type,
      accountNumber: schema.paymentMethod.accountNumber,
      accountName: schema.paymentMethod.accountName,
    })
    .from(schema.paymentMethod)
    .where(eq(schema.paymentMethod.isActive, true));

  await redisClient.setEx(cacheKey, 86400, JSON.stringify(methods)); // 24h TTL
  return c.json({ methods });
});

export { conversion };
