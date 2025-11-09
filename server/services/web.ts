import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { authMiddleware } from "../lib/auth";
import { eq, desc, sql } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

const web = new Hono<{ Variables: { session: any } }>();

// Middleware to get session
web.use("*", authMiddleware, async (c, next) => {
  // JWT payload is available in c.get("jwtPayload")
  await next();
});


// User Dashboard
web.get("/dashboard/user", async (c) => {
  const payload = c.get("jwtPayload");

  // Get custom user
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0) return c.json({ error: "User not found" }, 404);

  const userId = user[0].id;

  // Wallet
  const wallet = await db.select().from(schema.wallets).where(eq(schema.wallets.userId, userId)).limit(1);

  // History: recent bottle collections and transactions
  const collections = await db.select({
    id: schema.bottleCollections.id,
    type: sql`'collection'`,
    date: schema.bottleCollections.createdAt,
    details: sql`CONCAT(${schema.bottleCollections.totalBottles}, ' bottles - ', ${schema.bottleCollections.pointsAwarded}, ' points')`,
    points: schema.bottleCollections.pointsAwarded,
  }).from(schema.bottleCollections).where(eq(schema.bottleCollections.userId, userId)).orderBy(desc(schema.bottleCollections.createdAt)).limit(10);

  const transactions = await db.select({
    id: schema.walletTransactions.id,
    type: sql`'transaction'`,
    date: schema.walletTransactions.createdAt,
    details: schema.walletTransactions.description,
    points: schema.walletTransactions.changeAmount,
  }).from(schema.walletTransactions).where(eq(schema.walletTransactions.walletId, wallet[0]?.id || "")).orderBy(desc(schema.walletTransactions.createdAt)).limit(10);

  const history = [...collections, ...transactions].sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()).slice(0, 10);

  return c.json({
    profile: user[0],
    wallet: wallet[0],
    history,
  });
});

// Admin Dashboard
web.get("/dashboard/admin", async (c) => {
  const payload = c.get("jwtPayload");
  // Check if admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user[0]?.role !== "admin") return c.json({ error: "Forbidden" }, 403);

  // Stats
  const totalUsers = await db.$count(schema.users);
  const totalConversions = await db.$count(schema.conversionRequests);
  const revenueToday = await db.select({ sum: sql`SUM(${schema.laporanPenjualan.totalAmount})` })
    .from(schema.laporanPenjualan)
    .where(sql`DATE(${schema.laporanPenjualan.saleDate}) = CURRENT_DATE`);

  // Recent activities
  const activities = await db.select({
    id: schema.bottleCollections.id,
    user: schema.users.fullname,
    action: sql`'Menukarkan botol'`,
    details: sql`CONCAT(${schema.bottleCollections.totalBottles}, ' botol - Poin: +', ${schema.bottleCollections.pointsAwarded})`,
    timestamp: schema.bottleCollections.createdAt,
  }).from(schema.bottleCollections)
  .innerJoin(schema.users, eq(schema.bottleCollections.userId, schema.users.id))
  .orderBy(desc(schema.bottleCollections.createdAt)).limit(5);

  return c.json({
    stats: {
      totalUsers,
      totalConversions,
      revenueToday: revenueToday[0]?.sum || 0,
    },
    activities,
  });
});



export { web };
