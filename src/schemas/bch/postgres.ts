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
import type { Hyperdrive } from '@cloudflare/workers-types'

let hyperdrive: Hyperdrive | undefined = undefined
if (env.BCH_HYPERDRIVE) {
	hyperdrive = JSON.parse(env.BCH_HYPERDRIVE) as Hyperdrive
}

const connectionString = hyperdrive?.connectionString || env.BCH_DB_URL

if (!connectionString) {
	throw new Error("Connection string is undefined.")
}

const pool = postgres(connectionString, {
	ssl: env.BCH_DB_SSL ? 'require' : false,
});

export const db = drizzle(pool)
