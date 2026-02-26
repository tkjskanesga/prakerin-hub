import { pgTable, uuid, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { traineesGroups } from "./trainees-group";
import { users } from "./users";
import globalVariable from "@/lib/global-variable";

export const activityTypeEnum = pgEnum("activity_type", globalVariable.db.trainees_activity_type);

export const traineesActivity = pgTable("trainees_activity", {
  id: uuid("id").primaryKey().defaultRandom(), // ID Activity
  group_id: uuid("group_id").references(() => traineesGroups.id).notNull(), // ID Group
  user_id: uuid("user_id").references(() => users.id).notNull(), // ID Users
  type: activityTypeEnum("type").default(globalVariable.db.trainees_activity_type[0]), // Jenis Activity
  data: jsonb("data").default({}).notNull(), // Data Activity
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Waktu Activity
});