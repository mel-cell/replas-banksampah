ALTER TABLE "bottle_collections" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "conversion_requests" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "laporan_penjualan" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "laporan_penjualan_detail" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "laporan_penjualan_detail" ALTER COLUMN "laporan_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "ref_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "ref_id" SET NOT NULL;