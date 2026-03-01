import { relations } from "drizzle-orm";
import { users } from "./users";
import { auths } from "./auths";
import { classes } from "./classes";
import { participants } from "./participants";
import { mentors } from "./mentors";
import { institutions } from "./institutions";

export const usersRelations = relations(users, ({ one }) => ({
  participantProfile: one(participants, {
    fields: [users.id],
    references: [participants.user_id],
  }),
  mentorProfile: one(mentors, {
    fields: [users.id],
    references: [mentors.user_id],
  }),
  institutionView: one(institutions, {
    fields: [users.institution_id],
    references: [institutions.id],
  }),
}));

export const authsRelations = relations(auths, ({ one }) => ({
  user: one(users, {
    fields: [auths.user_id],
    references: [users.id],
  }),
}));

export const participantsRelations = relations(participants, ({ one }) => ({
  classes: one(classes, {
    fields: [participants.class_id],
    references: [classes.id],
  }),
}));