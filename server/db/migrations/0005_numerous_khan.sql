CREATE TYPE "public"."machine_status" AS ENUM('idle', 'in_use', 'maintenance');--> statement-breakpoint
CREATE TABLE "session_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"machine_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "wallet_transactions" ALTER COLUMN "ref_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "status" "machine_status" DEFAULT 'idle' NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "current_user_id" uuid;--> statement-breakpoint
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_machine_id_rooms_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_session_logs_machine" ON "session_logs" USING btree ("machine_id");--> statement-breakpoint
CREATE INDEX "idx_session_logs_user" ON "session_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_session_logs_date" ON "session_logs" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_current_user_id_users_id_fk" FOREIGN KEY ("current_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_rooms_status" ON "rooms" USING btree ("status");