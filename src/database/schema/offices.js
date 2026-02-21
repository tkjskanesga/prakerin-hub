import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core"

const offices = pgTable("offices", {
  id: uuid("id").primaryKey().defaultRandom(), // Office ID
  icon: text("icon"), // Office Icon
  name: text("name").notNull(), // Office Name
  bio: text("bio").notNull(), // Office Bio
  address: text("address").notNull(), // Office 
  banner: text("banner"), // Office Banner
  phone: text("phone"), // Office Phone
  email: text("email"), // Office Email
  website: text("website"), // Office Website
  verify: boolean("verify").default(false), // Office Verify By Admin Platform
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
  updated_at: timestamp("updated_at", { withTimezone: true }), // Updated At
  deleted_at: timestamp("deleted_at", { withTimezone: true }), // Deleted At
})

export default offices