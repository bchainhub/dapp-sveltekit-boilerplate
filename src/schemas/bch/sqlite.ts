import { env } from '$env/dynamic/private';
import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import type { AdapterAccount } from "next-auth/adapters"

const dbUrl = env.BCH_DB_URL
if (!dbUrl) {
	throw new Error("Database URL is not defined. Please set the DB_URL environment variable.")
}

const client = createClient({
	url: dbUrl,
	authToken: env.BCH_DB_AUTH_TOKEN || "",
})

export const db = drizzle(client)
