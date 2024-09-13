import { env } from '$env/dynamic/private';
import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import type { AdapterAccount } from "next-auth/adapters"

const client = createClient({
	url: env.BCH_DB_URL || "libsql://host/database-name",
	authToken: env.BCH_DB_AUTH_TOKEN || "",
})
export const db = drizzle(client)
