import { Hono } from "hono";
import { jwt, sign } from "hono/jwt";
import * as bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.js";

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool, { schema });

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "9ad85c783885826ca127ab48113c9c132632a069678b07702cb25b382cd533d8";

// Auth middleware
export const authMiddleware = jwt({
  secret: JWT_SECRET,
});

// Auth routes
export const authRoutes = new Hono();

// Register
authRoutes.post("/register", async (c) => {
  try {
    const { name, email, phone, password } = await c.req.json();

    // Validate input
    if (!name || !email || !password) {
      return c.json({ error: "Name, email, and password are required" }, 400);
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({ error: "Email already exists" }, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        username: email,
        password: hashedPassword,
        fullname: name,
        email,
        phone,
        school: "SMKN 6 Malang",
        role: "user",
        isActive: true,
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        role: schema.users.role,
      });

    // Create wallet
    await db.insert(schema.wallets).values({
      userId: newUser.id,
      pointsBalance: 0,
    });

    // Generate JWT
    const token = await sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET
    );

    return c.json({
      message: "User registered successfully",
      token,
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error("Register error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Login
authRoutes.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Validate input
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Find user
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!user || !user.isActive) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Generate JWT
    const token = await sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET
    );

    return c.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Logout (client-side token removal)
authRoutes.post("/logout", (c) => {
  return c.json({ message: "Logged out successfully" });
});

// Get current user
authRoutes.get("/me", authMiddleware, async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const [user] = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        fullname: schema.users.fullname,
        phone: schema.users.phone,
        role: schema.users.role,
        isActive: schema.users.isActive,
      })
      .from(schema.users)
      .where(eq(schema.users.id, payload.userId))
      .limit(1);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
