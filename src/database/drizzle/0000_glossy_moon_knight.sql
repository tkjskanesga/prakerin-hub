CREATE TYPE "public"."status" AS ENUM('negeri', 'swasta', 'universitas', 'other');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('smk', 'sma', 'ma', 'smalb', 'kuliah', 'other');--> statement-breakpoint
CREATE TYPE "public"."users_role" AS ENUM('participant', 'mentor', 'mentor-high', 'admin', 'default-admin');--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid,
	"label" text NOT NULL,
	"academic_year" varchar(20),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"regis_number" text NOT NULL,
	"icon" text DEFAULT '',
	"name" text NOT NULL,
	"address" text NOT NULL,
	"postal_code" text NOT NULL,
	"leader_name" text NOT NULL,
	"web" text DEFAULT '',
	"phone" text DEFAULT '',
	"email" text DEFAULT '',
	"subdistrict" text DEFAULT '',
	"type" "type",
	"status" "status",
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "institutions_regis_number_unique" UNIQUE("regis_number")
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid,
	"student_national" text,
	"student_number" text,
	"gender" varchar(1),
	"birth_place" text,
	"birth_date" date,
	"religion" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "participants_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "participants_student_national_unique" UNIQUE("student_national")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid,
	"fullname" text NOT NULL,
	"picture_url" text DEFAULT null,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"address" text,
	"email" text NOT NULL,
	"phone" text,
	"role" "users_role" DEFAULT 'participant',
	"created_at" timestamp with time zone DEFAULT now(),
	"update_total" integer DEFAULT 0,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_institutions_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;