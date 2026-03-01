import { pgTable, uuid, text, timestamp, date, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { classes } from "./classes";

export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(), // Participant ID
  user_id: uuid("user_id").references(() => users.id).unique().notNull(), // User ID
  class_id: uuid("class_id").references(() => classes.id), // Class ID (Optional)
  student_national: text("student_national").unique(), // NISN (National)
  student_number: text("student_number"), // NIS/NIM (Local)
  gender: varchar("gender", { length: 1 }), // L/P
  birth_place: text("birth_place"), // Birth Place
  birth_date: date("birth_date", { mode: "string" }), // Birth Date
  religion: text("religion"), // Religion
});