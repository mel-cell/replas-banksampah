ALTER TABLE "auth_two_factor_totp" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "auth_verifications" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "bottle_collections" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "conversion_requests" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "laporan_penjualan" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "laporan_penjualan_detail" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "laporan_penjualan_detail" ALTER COLUMN "laporan_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "payment_method" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "ref_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "ref_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "id" SET DATA TYPE integer;