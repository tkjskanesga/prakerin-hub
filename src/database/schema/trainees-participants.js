import { pgTable, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { traineesGroups } from "./trainees-group";
import { users } from "./users";
import globalVariable from "@/lib/global-variable";

export const participantTypeEnum = pgEnum("participant_type", globalVariable.db.trainees_type);

export const traineesParticipants = pgTable("trainees_participants", {
  id: uuid("id").primaryKey().defaultRandom(), // ID Partisipasi
  group_id: uuid("group_id").references(() => traineesGroups.id).notNull(), // ID Grup
  user_id: uuid("user_id").references(() => users.id).notNull(), // ID pengguna
  type: participantTypeEnum("type").default(globalVariable.db.trainees_type[0]), // Jenis berpartisipasi
  join_at: timestamp("join_at", { withTimezone: true }).defaultNow(), // Waktu join
});