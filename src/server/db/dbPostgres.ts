import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { Hyperdrive } from '@cloudflare/workers-types';

const DB_URL = process.env.DB_URL || undefined;
const HYPERDRIVE = process.env.HYPERDRIVE || undefined;
const DB_SSL = process.env.DB_SSL === 'true';

export async function initDb($type?: string) {
	let pgDatabaseName = DB_URL;
	const sslConfig = DB_SSL;
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
		pgDatabaseName = hyperdrive.connectionString;
	}

	if (!pgDatabaseName) {
		throw new Error("PostgreSQL Database connection string not found!");
	}

	const sslOptions = (sslConfig)
		? { ssl: { rejectUnauthorized: false } } // Enable SSL, don't reject unauthorized certificates
		: { ssl: false }; // Disable SSL

	const pgDatabase = postgres(pgDatabaseName, sslOptions);

	return drizzle(pgDatabase);
}
