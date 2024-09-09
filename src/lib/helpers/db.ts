import { env } from '$env/dynamic/private';
import type { D1Database } from '@cloudflare/workers-types';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Retrieves and validates the database instance from the RequestEvent object.
 * @param event - The RequestEvent object provided by SvelteKit.
 * @returns The database instance.
 * @throws Will throw an error if the database name is not defined or the database instance is not found.
 */
export function getDatabaseInstance(event: RequestEvent): D1Database {
	if (!event.platform) {
		throw new Error("Platform is undefined.");
	}

	const dbName = env.D1_NAMESPACE;
	if (!dbName) {
		throw new Error("Database name not defined.");
	}

	const db = (event.platform?.env as Record<string, D1Database | undefined>)?.[dbName];

	if (!db) {
		throw new Error("Database not found.");
	}

	return db;
}
