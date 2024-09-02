import { env } from '$env/dynamic/private';
import type { D1Database } from '@cloudflare/workers-types';

/**
 * Retrieves and validates the database instance from the platform environment.
 * @param platform - The platform object from SvelteKit.
 * @returns The database instance.
 * @throws Will throw an error if the database name is not defined or the database instance is not found.
 */
export function getDatabaseInstance(platform: Readonly<App.Platform>): D1Database {
	if (!platform.env) {
		throw new Error("Platform environment is undefined.");
	}

	const dbName = env.D1_NAMESPACE;
	if (!dbName) {
		throw new Error("Database name not defined.");
	}

	const db = platform.env[dbName as keyof typeof platform.env] as unknown as D1Database;

	if (!db) {
		throw new Error("Database not found.");
	}

	return db;
}
