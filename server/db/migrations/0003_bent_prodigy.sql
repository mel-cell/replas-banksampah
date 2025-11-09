ALTER TABLE "bottle_collections" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "bottle_collections" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "bottle_collections" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "bottle_collections" ALTER COLUMN "room_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "bottle_collections" ALTER COLUMN "verified_by" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "conversion_requests" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "conversion_requests" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "conversion_requests" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "conversion_requests" ALTER COLUMN "method_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "conversion_requests" ALTER COLUMN "processed_by" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "laporan_penjualan" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "laporan_penjualan" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "laporan_penjualan" ALTER COLUMN "admin_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "laporan_penjualan_detail" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "laporan_penjualan_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "laporan_penjualan_detail" ALTER COLUMN "laporan_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "payment_method" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "payment_method" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "supervisor_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "wallet_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(20);