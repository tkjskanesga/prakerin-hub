import db from "@/database/db";
import { users, institutions, classes, mentors, participants } from "@/database/schema";
import { eq } from "drizzle-orm";
import fs from "fs";

const seeder = JSON.parse(fs.readFileSync("./seeder.json", "utf8"));

async function main() {
  const { admin, institution, class_seed, mentor, participant } = seeder;

  try {
    await db.transaction(async (tx) => {
      console.log("[Seeder]: Checking admin...");
      const user = await tx.query.users.findFirst({
        where: eq(users.role, "default-admin"),
      });

      if (!user) {
        console.log("[Seeder]: Admin not found, inserting...");
        await tx.insert(users).values({
          fullname: admin.fullname,
          username: admin.username,
          password: admin.password,
          email: admin.email,
          role: "default-admin",
        });
      }

      console.log("[Seeder]: Checking institution...");
      let institution_id = null;
      const institution_data = await tx.query.institutions.findFirst({
        where: eq(institutions.regis_number, institution.regis_number),
      });

      if (!institution_data) {
        console.log("[Seeder]: Institution not found, inserting...");
        const [dataInstitution] = await tx
          .insert(institutions)
          .values(institution)
          .returning({ id: institutions.id });
        institution_id = dataInstitution.id;
      } else {
        institution_id = institution_data.id;
      }

      console.log("[Seeder]: Inserting class...");
      const [dataClass] = await tx
        .insert(classes)
        .values({
          ...class_seed,
          institution_id: institution_id,
        })
        .returning({ id: classes.id });

      console.log("[Seeder]: Inserting mentor...");
      const [dataMentors] = await tx
        .insert(users)
        .values({
          institution_id: institution_id,
          fullname: mentor.fullname,
          username: mentor.username,
          password: mentor.password,
          email: mentor.email,
          role: "mentor-high",
        })
        .returning({ id: users.id });

      await tx.insert(mentors).values({
        user_id: dataMentors.id,
        institution_id: institution_id,
        class_id: dataClass.id,
        title: mentor.title,
        specialization: mentor.specialization,
      });

      console.log("[Seeder]: Inserting participant...");
      const [dataParticipant] = await tx
        .insert(users)
        .values({
          institution_id: institution_id,
          fullname: participant.fullname,
          username: participant.username,
          password: participant.password,
          email: participant.email,
          role: "participant",
        })
        .returning({ id: users.id });

      await tx.insert(participants).values({
        user_id: dataParticipant.id,
        institution_id: institution_id,
        class_id: dataClass.id,
        student_national: participant.student_national,
        student_number: participant.student_number,
        gender: participant.gender,
        birth_place: participant.birth_place,
        birth_date: participant.birth_date,
        religion: participant.religion,
      });
    });

    console.log("[Seeder]: Seeding complete!");
  } catch (error) {
    console.error("[Seeder]: Seeding failed, rolling back...", error);
    process.exit(1);
  }
}

main();
