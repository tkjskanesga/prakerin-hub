CREATE TYPE "public"."status" AS ENUM('negeri', 'swasta', 'universitas', 'other');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('smk', 'sma', 'ma', 'smalb', 'kuliah', 'other');--> statement-breakpoint
CREATE TYPE "public"."activity_type" AS ENUM('action', 'chat', 'file');--> statement-breakpoint
CREATE TYPE "public"."group_status" AS ENUM('draft', 'deleting', 'submission', 'rejected', 'letter_acceptance', 'letter_submission', 'rejection_pkl', 'acceptance_pkl', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."participant_type" AS ENUM('participant', 'partner');--> statement-breakpoint
CREATE TYPE "public"."users_role" AS ENUM('participant', 'mentor', 'mentor-high', 'admin', 'default-admin');--> statement-breakpoint
CREATE TABLE "auths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"ip" text NOT NULL,
	"location" text NOT NULL,
	"user_agent" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid,
	"label" text NOT NULL,
	"academic_year" varchar(20),
	"update_total" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"regis_number" text NOT NULL,
	"icon" text DEFAULT null,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"postal_code" text NOT NULL,
	"leader_name" text NOT NULL,
	"web" text DEFAULT '-',
	"phone" text DEFAULT '-',
	"email" text DEFAULT '-',
	"subdistrict" text DEFAULT '-',
	"type" "type",
	"status" "status",
	"update_total" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "institutions_regis_number_unique" UNIQUE("regis_number")
);
--> statement-breakpoint
CREATE TABLE "letter_template" (
	"id" uuid PRIMARY KEY NOT NULL,
	"institutions_id" uuid,
	"uploader_id" uuid,
	"application_letter" text NOT NULL,
	"reply_letter" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mentors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid,
	"title" text DEFAULT '-',
	"specialization" text DEFAULT '-',
	CONSTRAINT "mentors_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "offices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon" text,
	"name" text NOT NULL,
	"bio" text NOT NULL,
	"address" text NOT NULL,
	"owner" text NOT NULL,
	"banner" text,
	"phone" text,
	"email" text,
	"website" text,
	"verify" boolean DEFAULT false,
	"verified_at" timestamp with time zone,
	"update_total" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "offices_email_unique" UNIQUE("email")
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
	CONSTRAINT "participants_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "participants_student_national_unique" UNIQUE("student_national")
);
--> statement-breakpoint
CREATE TABLE "trainees_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "activity_type" DEFAULT 'action',
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trainees_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"office_id" uuid NOT NULL,
	"join_code" varchar(8) DEFAULT '',
	"can_participant_action" boolean DEFAULT true,
	"status" "group_status" DEFAULT 'draft',
	"school_request_letter" text,
	"school_reply_letter" text,
	"office_acceptance_letter" text,
	"office_other_letters" jsonb,
	"created_by" uuid,
	"approved_by" uuid,
	"notes" text,
	"update_total" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "trainees_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "participant_type" DEFAULT 'participant',
	"join_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institutions_id" uuid,
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
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auths" ADD CONSTRAINT "auths_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "letter_template" ADD CONSTRAINT "letter_template_institutions_id_institutions_id_fk" FOREIGN KEY ("institutions_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "letter_template" ADD CONSTRAINT "letter_template_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainees_activity" ADD CONSTRAINT "trainees_activity_group_id_trainees_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."trainees_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainees_activity" ADD CONSTRAINT "trainees_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainees_groups" ADD CONSTRAINT "trainees_groups_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainees_groups" ADD CONSTRAINT "trainees_groups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainees_groups" ADD CONSTRAINT "trainees_groups_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainees_participants" ADD CONSTRAINT "trainees_participants_group_id_trainees_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."trainees_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainees_participants" ADD CONSTRAINT "trainees_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_institutions_id_institutions_id_fk" FOREIGN KEY ("institutions_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;