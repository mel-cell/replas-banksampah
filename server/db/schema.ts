import {
  pgTable,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  bigserial,
  text,
  date,
  pgEnum,
  index,
  text as pgText,
  uuid,
} from "drizzle-orm/pg-core";

// Enums
export const userRole = pgEnum("user_role", ["admin", "user"]);
export const paymentType = pgEnum("payment_type", [
  "cash",
  "dana",
  "ovo",
  "gopay",
]);
export const requestStatus = pgEnum("request_status", [
  "pending",
  "approved",
  "rejected",
  "paid",
]);
export const transactionType = pgEnum("transaction_type", ["credit", "debit"]);

// Users Table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    role: userRole("role").notNull().default("user"),
    username: varchar("username", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    fullname: varchar("fullname", { length: 150 }),
    email: varchar("email", { length: 150 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
    roleIdx: index("idx_users_role").on(table.role),
  })
);

// Rooms Table
export const rooms = pgTable(
  "rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 100 }),
    location: varchar("location", { length: 255 }),
    supervisorId: uuid("supervisor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    supervisorIdx: index("idx_rooms_supervisor").on(table.supervisorId),
    codeIdx: index("idx_rooms_code").on(table.code),
  })
);

// Payment Method Table
export const paymentMethod = pgTable(
  "payment_method",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    methodName: varchar("method_name", { length: 100 }).notNull(),
    type: paymentType("type").notNull(),
    accountNumber: varchar("account_number", { length: 50 }),
    accountName: varchar("account_name", { length: 100 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    typeIdx: index("idx_payment_method_type").on(table.type),
  })
);

// Wallets Table
export const wallets = pgTable(
  "wallets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    pointsBalance: integer("points_balance").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("idx_wallets_user").on(table.userId),
  })
);

// Bottle Collections Table
export const bottleCollections = pgTable(
  "bottle_collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    totalBottles: integer("total_bottles").notNull(),
    pointsAwarded: integer("points_awarded").notNull(),
    verified: boolean("verified").default(false),
    verifiedBy: uuid("verified_by").references(() => users.id, {
      onDelete: "set null",
    }),
    verifiedAt: timestamp("verified_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("idx_bottle_collections_user").on(table.userId),
    roomIdx: index("idx_bottle_collections_room").on(table.roomId),
    verifiedIdx: index("idx_bottle_collections_verified").on(table.verified),
    dateIdx: index("idx_bottle_collections_date").on(table.createdAt),
  })
);

// Conversion Requests Table
export const conversionRequests = pgTable(
  "conversion_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    methodId: uuid("method_id")
      .notNull()
      .references(() => paymentMethod.id, { onDelete: "restrict" }),
    pointsAmount: integer("points_amount").notNull(),
    moneyAmount: decimal("money_amount", { precision: 12, scale: 2 }).notNull(),
    status: requestStatus("status").default("pending"),
    accountNumber: varchar("account_number", { length: 100 }),
    accountName: varchar("account_name", { length: 150 }),
    notes: text("notes"),
    processedBy: uuid("processed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    processedAt: timestamp("processed_at"),
    requestAt: timestamp("request_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("idx_conversion_requests_user").on(table.userId),
    statusIdx: index("idx_conversion_requests_status").on(table.status),
    dateIdx: index("idx_conversion_requests_date").on(table.requestAt),
  })
);

// Wallet Transactions Table
export const walletTransactions = pgTable(
  "wallet_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    walletId: uuid("wallet_id")
      .notNull()
      .references(() => wallets.id, { onDelete: "cascade" }),
    changeAmount: integer("change_amount").notNull(),
    type: transactionType("type").notNull(),
    refId: integer("ref_id"),
    refTable: varchar("ref_table", { length: 50 }),
    description: text("description"),
    balanceAfter: integer("balance_after").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    walletIdx: index("idx_wallet_transactions_wallet").on(table.walletId),
    typeIdx: index("idx_wallet_transactions_type").on(table.type),
    dateIdx: index("idx_wallet_transactions_date").on(table.createdAt),
    refIdx: index("idx_wallet_transactions_ref").on(
      table.refId,
      table.refTable
    ),
  })
);

// Laporan Penjualan Table
export const laporanPenjualan = pgTable(
  "laporan_penjualan",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    saleDate: date("sale_date").notNull(),
    totalBottles: integer("total_bottles").notNull(),
    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    dateIdx: index("idx_laporan_penjualan_date").on(table.saleDate),
    adminIdx: index("idx_laporan_penjualan_admin").on(table.adminId),
  })
);

// Laporan Penjualan Detail Table
export const laporanPenjualanDetail = pgTable(
  "laporan_penjualan_detail",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    laporanId: uuid("laporan_id")
      .notNull()
      .references(() => laporanPenjualan.id, { onDelete: "cascade" }),
    bottleType: varchar("bottle_type", { length: 50 }).notNull(),
    quantity: integer("quantity").notNull(),
    pricePerBottle: decimal("price_per_bottle", {
      precision: 10,
      scale: 2,
    }).notNull(),
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => ({
    laporanIdx: index("idx_laporan_detail_laporan").on(table.laporanId),
    typeIdx: index("idx_laporan_detail_type").on(table.bottleType),
  })
);
