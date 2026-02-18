import "./src/lib/dotenv";
import { defineConfig } from "drizzle-kit";
import configdb from "./src/database/init";

export default defineConfig({
  out: "./src/database/drizzle",
  schema: "./src/database/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    ...configdb,
    ssl: configdb.ssl || false,
  },
  tablesFilter: ["users", "auths", "mails", "settings"],
});
