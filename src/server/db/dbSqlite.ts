import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import type { Hyperdrive } from '@cloudflare/workers-types';

const DB_URL = process.env.DB_URL;
const BCH_DB_URL = process.env.BCH_DB_URL;
const HYPERDRIVE = process.env.HYPERDRIVE;
const BCH_HYPERDRIVE = process.env.BCH_HYPERDRIVE;
const DB_AUTH_TOKEN = process.env.DB_AUTH_TOKEN;
const BCH_DB_AUTH_TOKEN = process.env.BCH_DB_AUTH_TOKEN;

export async function initDb($type?: string) {
	let sqliteDatabase = ($type === 'bch') ? BCH_DB_URL : DB_URL;
	const hdenv = ($type === 'bch') ? BCH_HYPERDRIVE : HYPERDRIVE;

	let hyperdrive: Hyperdrive | undefined = undefined;

	if (hdenv) {
		try {
			hyperdrive = JSON.parse(hdenv) as Hyperdrive;
		} catch (error) {
			console.error('Invalid JSON in HYPERDRIVE environment variable:', error);
		}
	}

	if (hyperdrive && hyperdrive.connectionString) {
		sqliteDatabase = hyperdrive.connectionString;
	}

	if (!sqliteDatabase) {
		throw new Error("SQLite Database not found!");
	}

	if ($type === 'bch' && BCH_DB_AUTH_TOKEN) {
		return drizzle(createClient({ url: sqliteDatabase, authToken: BCH_DB_AUTH_TOKEN }));
	} else if (DB_AUTH_TOKEN) {
		return drizzle(createClient({ url: sqliteDatabase, authToken: DB_AUTH_TOKEN }));
	} else {
		return drizzle(createClient({ url: sqliteDatabase }));
	}
}
