import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import type { Hyperdrive } from '@cloudflare/workers-types';

export async function initDb($type?: string) {
	let sqliteDatabase = ($type === 'bch') ? env.BCH_DB_URL : env.DB_URL;
	const hdenv = ($type === 'bch') ? env.BCH_HYPERDRIVE : env.HYPERDRIVE;

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

	if ($type === 'bch' && env.BCH_AUTH_TOKEN) {
		return drizzle(createClient({ url: sqliteDatabase, authToken: env.BCH_AUTH_TOKEN }));
	} else if (env.DB_AUTH_TOKEN) {
		return drizzle(createClient({ url: sqliteDatabase, authToken: env.DB_AUTH_TOKEN }));
	} else {
		return drizzle(createClient({ url: sqliteDatabase }));
	}
}
