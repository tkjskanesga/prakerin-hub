import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import institutions from "./institutions"

const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(), // Class ID
  institution_id: uuid("institution_id").references(() => institutions.id), // Institutions ID
  label: text("label").notNull(), // Class / Jurusan / Skills "XI IPA", "X TKJ"
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
})

export default classes