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

  // Get available payment methods for conversion
  const paymentMethods = await db.select({
    id: schema.paymentMethod.id,
    methodName: schema.paymentMethod.methodName,
    type: schema.paymentMethod.type,
    accountNumber: schema.paymentMethod.accountNumber,
    accountName: schema.paymentMethod.accountName,
  }).from(schema.paymentMethod).where(eq(schema.paymentMethod.isActive, true));

  return c.json({
    profile: user[0],
    wallet: wallet[0],
    history,
    paymentMethods,
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



// Create Conversion Request
web.post("/dashboard/user/conversion", async (c) => {
  const payload = c.get("jwtPayload");
  const { methodId, pointsAmount, accountNumber, accountName, notes } = await c.req.json();

  // Get user
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0) return c.json({ error: "User not found" }, 404);

  const userId = user[0].id;

  // Get wallet
  const wallet = await db.select().from(schema.wallets).where(eq(schema.wallets.userId, userId)).limit(1);
  if (wallet.length === 0) return c.json({ error: "Wallet not found" }, 404);

  // Check if user has enough points
  if ((wallet[0]?.pointsBalance || 0) < pointsAmount) {
    return c.json({ error: "Insufficient points balance" }, 400);
  }

  // Calculate money amount (1 point = Rp 100)
  const moneyAmount = pointsAmount * 100;

  // Create conversion request
  const [conversionRequest] = await db.insert(schema.conversionRequests).values({
    userId: userId,
    methodId: methodId,
    pointsAmount: pointsAmount,
    moneyAmount: moneyAmount.toString(),
    accountNumber,
    accountName,
    notes,
    status: "pending",
  }).returning();

  return c.json({
    message: "Conversion request created successfully",
    request: conversionRequest,
  });
});

// Get User Conversion Requests
web.get("/dashboard/user/conversions", async (c) => {
  const payload = c.get("jwtPayload");

  const conversions = await db.select({
    id: schema.conversionRequests.id,
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
  })
  .from(schema.conversionRequests)
  .innerJoin(schema.paymentMethod, eq(schema.conversionRequests.methodId, schema.paymentMethod.id))
  .where(eq(schema.conversionRequests.userId, payload.userId))
  .orderBy(desc(schema.conversionRequests.requestAt));

  return c.json({ conversions });
});

// Update User Profile
web.put("/dashboard/user/profile", async (c) => {
  const payload = c.get("jwtPayload");
  const { fullname, email, phone } = await c.req.json();

  try {
    const [updatedUser] = await db.update(schema.users)
      .set({
        fullname,
        email,
        phone,
      })
      .where(eq(schema.users.id, payload.userId))
      .returning();

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Update User Password
web.put("/dashboard/user/profile/password", async (c) => {
  const payload = c.get("jwtPayload");
  const { currentPassword, newPassword } = await c.req.json();

  // Get user
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify current password (in a real app, you'd hash and compare)
  if (user[0].password !== currentPassword) {
    return c.json({ error: "Current password is incorrect" }, 400);
  }

  try {
    const [updatedUser] = await db.update(schema.users)
      .set({
        password: newPassword, // In real app, hash the password
      })
      .where(eq(schema.users.id, payload.userId))
      .returning();

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return c.json({ error: "Failed to update password" }, 500);
  }
});

// Get All Conversion Requests (Admin)
web.get("/dashboard/admin/conversions", async (c) => {
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

// Update Conversion Request Status (Admin)
web.put("/dashboard/admin/conversions/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const conversionId = c.req.param('id');
  const { status } = await c.req.json();

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  // Validate status
  if (!['approved', 'rejected', 'paid'].includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }

  try {
    const [updatedRequest] = await db.update(schema.conversionRequests)
      .set({
        status,
        processedBy: payload.userId,
        processedAt: new Date(),
      })
      .where(eq(schema.conversionRequests.id, conversionId))
      .returning();

    if (!updatedRequest) {
      return c.json({ error: "Conversion request not found" }, 404);
    }

    // If approved, deduct points from user wallet
    if (status === 'approved') {
      const conversion = await db.select().from(schema.conversionRequests)
        .where(eq(schema.conversionRequests.id, conversionId)).limit(1);

      if (conversion.length > 0) {
        const wallet = await db.select().from(schema.wallets)
          .where(eq(schema.wallets.userId, conversion[0].userId)).limit(1);

        if (wallet.length > 0 && wallet[0]) {
          const newBalance = (wallet[0].pointsBalance || 0) - conversion[0].pointsAmount;
          await db.update(schema.wallets)
            .set({ pointsBalance: newBalance })
            .where(eq(schema.wallets.id, wallet[0].id));

          // Create wallet transaction
          await db.insert(schema.walletTransactions).values({
            walletId: wallet[0].id,
            changeAmount: -conversion[0].pointsAmount,
            type: "debit",
            refId: conversionId,
            refTable: "conversion_requests",
            description: `Penukaran poin ke uang (${conversion[0].pointsAmount} poin)`,
            balanceAfter: newBalance,
          });
        }
      }
    }

    return c.json({
      message: "Status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return c.json({ error: "Failed to update status" }, 500);
  }
});

// Get All Users (Admin)
web.get("/dashboard/admin/users", async (c) => {
  const payload = c.get("jwtPayload");

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

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

// Update User (Admin)
web.put("/dashboard/admin/users/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const userId = c.req.param('id');
  const { fullname, email, phone, role, isActive } = await c.req.json();

  // Check if user is admin
  const admin = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (admin.length === 0 || admin[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [updatedUser] = await db.update(schema.users)
      .set({
        fullname,
        email,
        phone,
        role,
        isActive,
      })
      .where(eq(schema.users.id, userId))
      .returning();

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("User update error:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// Update User Status (Admin)
web.put("/dashboard/admin/users/:id/status", async (c) => {
  const payload = c.get("jwtPayload");
  const userId = c.req.param('id');
  const { isActive } = await c.req.json();

  // Check if user is admin
  const admin = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (admin.length === 0 || admin[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [updatedUser] = await db.update(schema.users)
      .set({ isActive })
      .where(eq(schema.users.id, userId))
      .returning();

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return c.json({ error: "Failed to update user status" }, 500);
  }
});

// Delete User (Admin)
web.delete("/dashboard/admin/users/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const userId = c.req.param('id');

  // Check if user is admin
  const admin = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (admin.length === 0 || admin[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [deletedUser] = await db.delete(schema.users)
      .where(eq(schema.users.id, userId))
      .returning();

    if (!deletedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("User deletion error:", error);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

// Get Admin Profile
web.get("/dashboard/admin/profile", async (c) => {
  const payload = c.get("jwtPayload");

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  return c.json({ profile: user[0] });
});

// Update Admin Profile
web.put("/dashboard/admin/profile", async (c) => {
  const payload = c.get("jwtPayload");
  const { fullname, email, phone } = await c.req.json();

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [updatedUser] = await db.update(schema.users)
      .set({
        fullname,
        email,
        phone,
      })
      .where(eq(schema.users.id, payload.userId))
      .returning();

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Update Admin Password
web.put("/dashboard/admin/profile/password", async (c) => {
  const payload = c.get("jwtPayload");
  const { currentPassword, newPassword } = await c.req.json();

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  // Verify current password (in a real app, you'd hash and compare)
  if (user[0].password !== currentPassword) {
    return c.json({ error: "Current password is incorrect" }, 400);
  }

  try {
    const [updatedUser] = await db.update(schema.users)
      .set({
        password: newPassword, // In real app, hash the password
      })
      .where(eq(schema.users.id, payload.userId))
      .returning();

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return c.json({ error: "Failed to update password" }, 500);
  }
});

// Get Sales Reports (Admin)
web.get("/dashboard/admin/sales-reports", async (c) => {
  const payload = c.get("jwtPayload");

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const reports = await db.select({
    id: schema.laporanPenjualan.id,
    saleDate: schema.laporanPenjualan.saleDate,
    totalBottles: schema.laporanPenjualan.totalBottles,
    totalAmount: schema.laporanPenjualan.totalAmount,
    adminId: schema.laporanPenjualan.adminId,
    notes: schema.laporanPenjualan.notes,
    createdAt: schema.laporanPenjualan.createdAt,
    adminName: schema.users.fullname,
  })
  .from(schema.laporanPenjualan)
  .innerJoin(schema.users, eq(schema.laporanPenjualan.adminId, schema.users.id))
  .orderBy(desc(schema.laporanPenjualan.saleDate));

  return c.json({ reports });
});

// Create Sales Report (Admin)
web.post("/dashboard/admin/sales-reports", async (c) => {
  const payload = c.get("jwtPayload");
  const { saleDate, totalBottles, totalAmount, notes } = await c.req.json();

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [report] = await db.insert(schema.laporanPenjualan).values({
      saleDate,
      totalBottles,
      totalAmount,
      adminId: payload.userId,
      notes,
    }).returning();

    return c.json({
      message: "Sales report created successfully",
      report,
    });
  } catch (error) {
    console.error("Sales report creation error:", error);
    return c.json({ error: "Failed to create sales report" }, 500);
  }
});

// Update Sales Report (Admin)
web.put("/dashboard/admin/sales-reports/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const reportId = c.req.param('id');
  const { saleDate, totalBottles, totalAmount, notes } = await c.req.json();

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [updatedReport] = await db.update(schema.laporanPenjualan)
      .set({
        saleDate,
        totalBottles,
        totalAmount,
        notes,
      })
      .where(eq(schema.laporanPenjualan.id, reportId))
      .returning();

    if (!updatedReport) {
      return c.json({ error: "Sales report not found" }, 404);
    }

    return c.json({
      message: "Sales report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Sales report update error:", error);
    return c.json({ error: "Failed to update sales report" }, 500);
  }
});

// Delete Sales Report (Admin)
web.delete("/dashboard/admin/sales-reports/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const reportId = c.req.param('id');

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [deletedReport] = await db.delete(schema.laporanPenjualan)
      .where(eq(schema.laporanPenjualan.id, reportId))
      .returning();

    if (!deletedReport) {
      return c.json({ error: "Sales report not found" }, 404);
    }

    return c.json({
      message: "Sales report deleted successfully",
    });
  } catch (error) {
    console.error("Sales report deletion error:", error);
    return c.json({ error: "Failed to delete sales report" }, 500);
  }
});

// Get All Rooms (Admin)
web.get("/dashboard/admin/rooms", async (c) => {
  const payload = c.get("jwtPayload");

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

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

  // Get current users for rooms that are in use
  const roomsWithUsers = await Promise.all(
    rooms.map(async (room) => {
      let currentUser = null;
      if (room.currentUserId) {
        const user = await db.select({
          name: schema.users.fullname,
          activity: sql`'Menggunakan mesin'`,
          startTime: sql`NOW()::time`,
        })
        .from(schema.users)
        .where(eq(schema.users.id, room.currentUserId))
        .limit(1);

        if (user.length > 0) {
          currentUser = user[0];
        }
      }

      return {
        ...room,
        currentUser,
        lastMaintenance: new Date().toISOString().split('T')[0], // Placeholder
      };
    })
  );

  return c.json({ rooms: roomsWithUsers });
});

// Create Room (Admin)
web.post("/dashboard/admin/rooms", async (c) => {
  const payload = c.get("jwtPayload");
  const { code, name, location } = await c.req.json();

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [room] = await db.insert(schema.rooms).values({
      code,
      name,
      location,
      status: "idle",
      isActive: true,
    }).returning();

    return c.json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Room creation error:", error);
    return c.json({ error: "Failed to create room" }, 500);
  }
});

// Update Room (Admin)
web.put("/dashboard/admin/rooms/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const roomId = c.req.param('id');
  const { code, name, location, isActive } = await c.req.json();

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [updatedRoom] = await db.update(schema.rooms)
      .set({
        code,
        name,
        location,
        isActive,
      })
      .where(eq(schema.rooms.id, roomId))
      .returning();

    if (!updatedRoom) {
      return c.json({ error: "Room not found" }, 404);
    }

    return c.json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Room update error:", error);
    return c.json({ error: "Failed to update room" }, 500);
  }
});

// Delete Room (Admin)
web.delete("/dashboard/admin/rooms/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const roomId = c.req.param('id');

  // Check if user is admin
  const user = await db.select().from(schema.users).where(eq(schema.users.id, payload.userId)).limit(1);
  if (user.length === 0 || user[0].role !== 'admin') {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const [deletedRoom] = await db.delete(schema.rooms)
      .where(eq(schema.rooms.id, roomId))
      .returning();

    if (!deletedRoom) {
      return c.json({ error: "Room not found" }, 404);
    }

    return c.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Room deletion error:", error);
    return c.json({ error: "Failed to delete room" }, 500);
  }
});

export { web };
