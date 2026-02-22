import "@/lib/dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import configdb from "./init";
import * as schema from "./schema";

const pool = new Pool(configdb);
const db = drizzle(pool, {
  schema,
});

export default db;
