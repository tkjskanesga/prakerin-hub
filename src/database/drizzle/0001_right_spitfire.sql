ALTER TABLE "institutions" ALTER COLUMN "icon" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "institutions" ALTER COLUMN "web" SET DEFAULT '-';--> statement-breakpoint
ALTER TABLE "institutions" ALTER COLUMN "phone" SET DEFAULT '-';--> statement-breakpoint
ALTER TABLE "institutions" ALTER COLUMN "email" SET DEFAULT '-';--> statement-breakpoint
ALTER TABLE "institutions" ALTER COLUMN "subdistrict" SET DEFAULT '-';--> statement-breakpoint
ALTER TABLE "mentors" ALTER COLUMN "title" SET DEFAULT '-';--> statement-breakpoint
ALTER TABLE "mentors" ALTER COLUMN "specialization" SET DEFAULT '-';--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");