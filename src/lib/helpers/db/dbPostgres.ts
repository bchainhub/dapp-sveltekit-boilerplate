import { DB_URL, BCH_DB_URL, HYPERDRIVE, BCH_HYPERDRIVE, DB_SSL, BCH_DB_SSL } from '$env/static/private';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { Hyperdrive } from '@cloudflare/workers-types';

export async function initDb($type?: string) {
	let pgDatabaseName = ($type === 'bch') ? BCH_DB_URL : DB_URL;
	const sslConfig = ($type === 'bch') ? BCH_DB_SSL : DB_SSL;
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
		pgDatabaseName = hyperdrive.connectionString;
	}

	if (!pgDatabaseName) {
		throw new Error("PostgreSQL Database connection string not found!");
	}

	const sslOptions = (sslConfig === 'true')
		? { ssl: { rejectUnauthorized: false } } // Enable SSL, don't reject unauthorized certificates
		: { ssl: false }; // Disable SSL

	const pgDatabase = postgres(pgDatabaseName, sslOptions);

	return drizzle(pgDatabase);
}
