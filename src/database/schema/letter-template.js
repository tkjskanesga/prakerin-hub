import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

import institutions from "./institutions";
import users from "./users";

const letterTemplate = pgTable("letter_template", {
  id: uuid("id").primaryKey(),
  institutions_id: uuid("institutions_id").references(() => institutions.id),
  uploader_id: uuid("uploader_id").references(() => users.id),
  application_letter: text("application_letter").notNull(), // Surat pengajuan
  reply_letter: text("reply_letter").notNull(), // Surat balasan
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
});

export default letterTemplate;