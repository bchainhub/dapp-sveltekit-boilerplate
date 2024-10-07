import { env } from '$env/dynamic/private';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { Hyperdrive } from '@cloudflare/workers-types';

export async function initDb($type?: string) {
	let pgDatabaseName = ($type === 'bch') ? env.BCH_DB_URL : env.DB_URL;
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
		pgDatabaseName = hyperdrive.connectionString;
	}

	if (!pgDatabaseName) {
		throw new Error("PostgreSQL Database not found!");
	}

	const pgDatabase = postgres(pgDatabaseName, {
		ssl: env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
	});

	return drizzle(pgDatabase);
}
