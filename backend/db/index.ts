import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DATABASE_URL } from "../constants";

const pgClient = postgres(DATABASE_URL, { prepare: false });
export const db = drizzle({ client: pgClient });
