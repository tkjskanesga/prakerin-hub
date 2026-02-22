import db from "@/database/db";
import { users, institutions, classes, mentors } from "@/database/schema";
import { eq } from "drizzle-orm";
import fs from "fs";

const seeder = JSON.parse(fs.readFileSync("./seeder.json", "utf8"));

async function main() {
  const { admin, institution, class_seed, mentor } = seeder;

  console.log("[Seeder]: Checking admin...");
  // Check admin
  const user = await db.query.users.findFirst({
    where: eq(users.role, "default-admin"),
  });

  if (!user) {
    // Insert admin
    console.log("[Seeder]: Admin not found, inserting...");
    await db.insert(users).values({
      fullname: admin.fullname,
      username: admin.username,
      password: admin.password,
      email: admin.email,
      role: "default-admin",
    });
  }

  console.log("[Seeder]: Checking institution...");
  let institution_id = null;

  // Check institution
  const institution_data = await db.query.institutions.findFirst({
    where: eq(institutions.regis_number, institution.regis_number),
  });

  if (!institution_data) {
    console.log("[Seeder]: Institution not found, inserting...");
    const [dataInstitution] = await db.insert(institutions).values(institution).returning({ id: institutions.id });
    institution_id = dataInstitution.id;
  } else {
    institution_id = institution_data.id;
  }

  console.log("[Seeder]: Inserting class...");
  // Insert class
  const [dataClass] = await db.insert(classes).values(class_seed).returning({ id: classes.id });

  console.log("[Seeder]: Inserting mentor...");
  // Insert mentor user
  const [dataMentors] = await db.insert(users).values({
    fullname: mentor.fullname,
    username: mentor.username,
    password: mentor.password,
    email: mentor.email,
    role: "mentor-high",
  }).returning({ id: users.id });

  // Insert mentor profile
  await db.insert(mentors).values({
    user_id: dataMentors.id,
    institution_id: institution_id,
    class_id: dataClass.id,
    title: mentor.title,
    specialization: mentor.specialization,
  });

  console.log("[Seeder]: Seeding complete!");
}

main();
