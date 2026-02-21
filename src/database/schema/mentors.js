import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import classes from "./classes";
import users from "./users";

const mentors = pgTable("mentors", {
  id: uuid("id").primaryKey().defaultRandom(), // Mentor ID
  user_id: uuid("user_id").references(() => users.id).unique().notNull(), // User ID
  class_id: uuid("class_id").references(() => classes.id), // Class ID (Optional)
  title: text("title"), // Gelar: S.T., M.Cs, dsb
  specialization: text("specialization"), // Bidang Keahlian
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
  updated_at: timestamp("updated_at", { withTimezone: true }), // Updated At
  deleted_at: timestamp("deleted_at", { withTimezone: true }), // Deleted At
});

export default mentors;

export const mentorsRelations = relations(mentors, ({ one }) => ({
  user: one(users, { fields: [mentors.user_id], references: [users.id] }),
}));