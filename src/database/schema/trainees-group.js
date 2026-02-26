import { pgTable, uuid, text, timestamp, pgEnum, jsonb, varchar, boolean } from "drizzle-orm/pg-core";
import { offices } from "./offices"; // Tempat PKL/Partner
import { users } from "./users";    // Untuk audit (siapa yang buat & acc)
import globalVariable from "@/lib/global-variable";

// Enum untuk status grup PKL
export const groupStatusEnum = pgEnum("group_status", globalVariable.db.trainees_status);

export const traineesGroups = pgTable("trainees_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Relasi ke Partner (Kantor/Tempat PKL)
  office_id: uuid("office_id").references(() => offices.id).notNull(),
  // Kode join
  join_code: varchar("join_code", { length: 8 }).default(""),
  can_participant_action: boolean("can_participant_action").default(true),
  // Status Grup
  status: groupStatusEnum("status").default(globalVariable.db.trainees_status[0]),
  // Surat dari Sekolah
  school_request_letter: text("school_request_letter"), // Surat Permohonan PKL
  school_reply_letter: text("school_reply_letter"), // Surat Balasan PKL
  // Surat dari Tempat PKL (Partner)
  office_acceptance_letter: text("office_acceptance_letter"), // Surat Balasan PKL
  office_other_letters: jsonb("office_other_letters"), // Surat Dukungan Lainnya
  // Audit & Metadata
  created_by: uuid("created_by").references(() => users.id), // Siswa/Ketua grup yang buat
  approved_by: uuid("approved_by").references(() => users.id), // Admin/Guru yang verifikasi
  // Catatan
  notes: text("notes"),
  // Audit & Metadata
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
});