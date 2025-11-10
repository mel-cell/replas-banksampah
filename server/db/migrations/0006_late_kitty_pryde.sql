ALTER TABLE "users" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nisn" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "student_class" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "school" varchar(150);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_active" timestamp;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "total_bottles" integer DEFAULT 0;--> statement-breakpoint
CREATE INDEX "idx_users_nisn" ON "users" USING btree ("nisn");--> statement-breakpoint
CREATE INDEX "idx_users_location" ON "users" USING btree ("location");--> statement-breakpoint
CREATE INDEX "idx_users_last_active" ON "users" USING btree ("last_active");