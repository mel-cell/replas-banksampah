CREATE TYPE "public"."payment_type" AS ENUM('cash', 'dana', 'ovo', 'gopay');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('pending', 'approved', 'rejected', 'paid');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "auth_accounts" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"userId" varchar(191) NOT NULL,
	"providerId" varchar(191) NOT NULL,
	"accountId" varchar(191) NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" varchar(191),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"userId" varchar(191) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" varchar(191) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_two_factor_totp" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(191) NOT NULL,
	"secret" varchar(191) NOT NULL,
	"algorithm" varchar(191) NOT NULL,
	"digits" integer NOT NULL,
	"period" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191),
	"email" varchar(191) NOT NULL,
	"emailVerified" timestamp,
	"image" varchar(191),
	"password" varchar(191),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" varchar(191) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"type" varchar(191) NOT NULL,
	"userId" varchar(191)
);
--> statement-breakpoint
CREATE TABLE "bottle_collections" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"room_id" integer NOT NULL,
	"total_bottles" integer NOT NULL,
	"points_awarded" integer NOT NULL,
	"verified" boolean DEFAULT false,
	"verified_by" integer,
	"verified_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversion_requests" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"method_id" integer NOT NULL,
	"points_amount" integer NOT NULL,
	"money_amount" numeric(12, 2) NOT NULL,
	"status" "request_status" DEFAULT 'pending',
	"account_number" varchar(100),
	"account_name" varchar(150),
	"notes" text,
	"processed_by" integer,
	"processed_at" timestamp,
	"request_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "laporan_penjualan" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"sale_date" date NOT NULL,
	"total_bottles" integer NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"admin_id" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "laporan_penjualan_detail" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"laporan_id" bigserial NOT NULL,
	"bottle_type" varchar(50) NOT NULL,
	"quantity" integer NOT NULL,
	"price_per_bottle" numeric(10, 2) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_method" (
	"id" serial PRIMARY KEY NOT NULL,
	"method_name" varchar(100) NOT NULL,
	"type" "payment_type" NOT NULL,
	"account_number" varchar(50),
	"account_name" varchar(100),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100),
	"location" varchar(255),
	"supervisor_id" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "rooms_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"fullname" varchar(150),
	"email" varchar(150),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"wallet_id" integer NOT NULL,
	"change_amount" integer NOT NULL,
	"type" "transaction_type" NOT NULL,
	"ref_id" bigserial,
	"ref_table" varchar(50),
	"description" text,
	"balance_after" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"points_balance" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "wallets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_userId_auth_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_userId_auth_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_two_factor_totp" ADD CONSTRAINT "auth_two_factor_totp_userId_auth_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_verifications" ADD CONSTRAINT "auth_verifications_userId_auth_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bottle_collections" ADD CONSTRAINT "bottle_collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bottle_collections" ADD CONSTRAINT "bottle_collections_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bottle_collections" ADD CONSTRAINT "bottle_collections_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversion_requests" ADD CONSTRAINT "conversion_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversion_requests" ADD CONSTRAINT "conversion_requests_method_id_payment_method_id_fk" FOREIGN KEY ("method_id") REFERENCES "public"."payment_method"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversion_requests" ADD CONSTRAINT "conversion_requests_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "laporan_penjualan" ADD CONSTRAINT "laporan_penjualan_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "laporan_penjualan_detail" ADD CONSTRAINT "laporan_penjualan_detail_laporan_id_laporan_penjualan_id_fk" FOREIGN KEY ("laporan_id") REFERENCES "public"."laporan_penjualan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_supervisor_id_users_id_fk" FOREIGN KEY ("supervisor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_accounts_provider_providerAccountId_key" ON "auth_accounts" USING btree ("providerId","accountId");--> statement-breakpoint
CREATE INDEX "auth_verifications_type_identifier_key" ON "auth_verifications" USING btree ("type","identifier");--> statement-breakpoint
CREATE INDEX "idx_bottle_collections_user" ON "bottle_collections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_bottle_collections_room" ON "bottle_collections" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "idx_bottle_collections_verified" ON "bottle_collections" USING btree ("verified");--> statement-breakpoint
CREATE INDEX "idx_bottle_collections_date" ON "bottle_collections" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_conversion_requests_user" ON "conversion_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_conversion_requests_status" ON "conversion_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_conversion_requests_date" ON "conversion_requests" USING btree ("request_at");--> statement-breakpoint
CREATE INDEX "idx_laporan_penjualan_date" ON "laporan_penjualan" USING btree ("sale_date");--> statement-breakpoint
CREATE INDEX "idx_laporan_penjualan_admin" ON "laporan_penjualan" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "idx_laporan_detail_laporan" ON "laporan_penjualan_detail" USING btree ("laporan_id");--> statement-breakpoint
CREATE INDEX "idx_laporan_detail_type" ON "laporan_penjualan_detail" USING btree ("bottle_type");--> statement-breakpoint
CREATE INDEX "idx_payment_method_type" ON "payment_method" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_rooms_supervisor" ON "rooms" USING btree ("supervisor_id");--> statement-breakpoint
CREATE INDEX "idx_rooms_code" ON "rooms" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_wallet_transactions_wallet" ON "wallet_transactions" USING btree ("wallet_id");--> statement-breakpoint
CREATE INDEX "idx_wallet_transactions_type" ON "wallet_transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_wallet_transactions_date" ON "wallet_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_wallet_transactions_ref" ON "wallet_transactions" USING btree ("ref_id","ref_table");--> statement-breakpoint
CREATE INDEX "idx_wallets_user" ON "wallets" USING btree ("user_id");