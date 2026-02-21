import { pgTable, uuid, text, timestamp, date } from "drizzle-orm/pg-core"
import users from "./users"
import classes from "./classes"

const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(), // Participant ID
  user_id: uuid("user_id").references(() => users.id).unique().notNull(), // User ID
  class_id: uuid("class_id").references(() => classes.id), // Class ID (Optional)
  student_national: text("student_national").unique(), // NISN (National)
  student_number: text("student_number"), // NIS/NIM (Local)
  gender: text("gender"), // L/P
  birth_place: text("birth_place"), // Birth Place
  birth_date: date("birth_date", { mode: "string" }), // Birth Date
  address: text("address"), // Address
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
  updated_at: timestamp("updated_at", { withTimezone: true }), // Updated At
  deleted_at: timestamp("deleted_at", { withTimezone: true }), // Deleted At
})

export default participants
