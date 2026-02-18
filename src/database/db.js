import "@/lib/dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import configdb from "./init";

const pool = new Pool(configdb);
const db = drizzle(pool);

export default db;
