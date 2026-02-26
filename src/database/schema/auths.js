import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const auths = pgTable("auths", {
  id: uuid("id").primaryKey().defaultRandom(), // Auth ID
  user_id: uuid("user_id").references(() => users.id), // User ID
  ip: text("ip").notNull(), // IP Address
  location: text("location").notNull(), // Location
  user_agent: text("user_agent").notNull(), // User Agent
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
  updated_at: timestamp("updated_at", { withTimezone: true }), // Updated At
});