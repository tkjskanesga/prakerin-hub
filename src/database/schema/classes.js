import { pgTable, uuid, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { institutions } from "./institutions";

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(), // Class ID
  institution_id: uuid("institution_id").references(() => institutions.id), // Institutions ID
  label: text("label").notNull(), // Class / Jurusan / Skills "XI IPA", "X TKJ"
  academic_year: varchar("academic_year", { length: 20 }), // "2025-2027"
  update_total: integer("update_total").default(0), // Update Total
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
  updated_at: timestamp("updated_at", { withTimezone: true }), // Updated At
});