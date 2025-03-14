import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import type { Hyperdrive } from '@cloudflare/workers-types';

const DB_URL = process.env.DB_URL;
const HYPERDRIVE = process.env.HYPERDRIVE;
const DB_AUTH_TOKEN = process.env.DB_AUTH_TOKEN;

export async function initDb($type?: string) {
	let sqliteDatabase = DB_URL;
	const hdenv = HYPERDRIVE;

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

	if (DB_AUTH_TOKEN) {
		return drizzle(createClient({ url: sqliteDatabase, authToken: DB_AUTH_TOKEN }));
	} else {
		return drizzle(createClient({ url: sqliteDatabase }));
	}
}
