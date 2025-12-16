ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_chirpy_red" boolean DEFAULT false;