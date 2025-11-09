ALTER TABLE "auth_accounts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "auth_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "auth_two_factor_totp" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "auth_users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "auth_verifications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "auth_accounts" CASCADE;--> statement-breakpoint
DROP TABLE "auth_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "auth_two_factor_totp" CASCADE;--> statement-breakpoint
DROP TABLE "auth_users" CASCADE;--> statement-breakpoint
DROP TABLE "auth_verifications" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");