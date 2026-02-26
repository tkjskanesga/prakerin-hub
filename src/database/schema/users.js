import { pgTable, uuid, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { institutions } from "./institutions";
import globalVariable from "@/lib/global-variable";

export const usersRoleEnum = pgEnum("users_role", globalVariable.db.role_users);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // User ID
  institutions_id: uuid("institutions_id").references(() => institutions.id), // Institutions ID
  fullname: text("fullname").notNull(), // Fullname
  picture_url: text("picture_url").default(null), // Profile Picture URL
  username: text("username").unique().notNull(), // Unique Username
  password: text("password").notNull(), // Hash Password (!)
  address: text("address"), // Address
  email: text("email").unique().notNull(), // Email
  phone: text("phone"), // Phone
  role: usersRoleEnum("role").default("participant"), // Role ["participant", "mentor", "mentor-high", "admin", "default-admin"]
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
  update_total: integer("update_total").default(0), // Update Total
  updated_at: timestamp("updated_at", { withTimezone: true }), // Updated At
  deleted_at: timestamp("deleted_at", { withTimezone: true }), // Deleted At
});
