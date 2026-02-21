import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import classes from "./classes"

const mentors = pgTable("mentors", {
  id: uuid("id").primaryKey().defaultRandom(), // Mentor ID
  name: text("name").notNull(), // Mentor Name
  class_id: uuid("class_id").references(() => classes.id), // Class ID (Optional)
  address: text("address"), // Mentor Address
  phone: text("phone"), // Office Phone
  email: text("email"), // Office Email
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
  updated_at: timestamp("updated_at", { withTimezone: true }), // Updated At
  deleted_at: timestamp("deleted_at", { withTimezone: true }), // Deleted At
})

export default mentors