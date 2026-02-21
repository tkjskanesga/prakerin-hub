import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from "./src/database/db";

async function main() {
  console.log("[Migrate DB]: Running migrations...");
  await migrate(db, { migrationsFolder: "./src/database/drizzle" });
  console.log("[Migrate DB]: Migrations complete!");
  process.exit(0);
}

main();