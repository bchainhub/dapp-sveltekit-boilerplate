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

const connectionString = env.BCH_DB_URL || env.BCH_HYPERDRIVE!.connectionString;
const pool = postgres(connectionString, {
	ssl: env.BCH_DB_SSL ? 'require' : false,
})

export const db = drizzle(pool)
