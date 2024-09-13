import { env } from '$env/dynamic/private';
import {
	boolean,
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccount } from "next-auth/adapters"

const connectionString = env.BCH_DB_URL || "postgresql://username:password@host:port/database";
const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool)
