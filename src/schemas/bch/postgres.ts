import { BCH_HYPERDRIVE, BCH_DB_URL, BCH_DB_SSL } from '$env/static/private';
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
if (BCH_HYPERDRIVE) {
	hyperdrive = JSON.parse(BCH_HYPERDRIVE) as Hyperdrive
}

const connectionString = hyperdrive?.connectionString || BCH_DB_URL

if (!connectionString) {
	throw new Error("Connection string is undefined.")
}

const pool = postgres(connectionString, {
	ssl: BCH_DB_SSL ? 'require' : false,
});

export const db = drizzle(pool)
