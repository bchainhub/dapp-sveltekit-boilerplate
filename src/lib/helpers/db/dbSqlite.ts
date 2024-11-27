import { DB_URL, BCH_DB_URL, HYPERDRIVE, BCH_HYPERDRIVE, DB_AUTH_TOKEN, BCH_DB_AUTH_TOKEN } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import type { Hyperdrive } from '@cloudflare/workers-types';

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
