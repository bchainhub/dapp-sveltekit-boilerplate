import { env } from '$env/dynamic/private';
import { loadOrbUrl } from '$lib/helpers/connectOrb';
import type { RequestEvent } from '@sveltejs/kit';

// Global variables to cache the database instances
let dbInstance: any;
let bchInstance: any;

// Function to dynamically load db engines
async function loadDbEngine(dbType: string) {
	switch (dbType) {
		case 'd1':
			return await import('./dbD1');
		case 'sqlite':
		case 'orb':
			return await import('./dbSqlite');
		case 'postgres':
			return await import('./dbPostgres');
		default:
			throw new Error(`Unsupported database type: ${dbType}`);
	}
}

// Function to initialize and return the main database instance
export async function getDatabaseInstance(event: RequestEvent) {
	if (dbInstance) {
		return dbInstance;  // Return cached instance if it exists
	}

	if (!env.DB_TYPE || (!env.DB_URL && !env.D1 && !env.HYPERDRIVE)) {
		throw new Error('Database or type is not defined.');
	}

	const dbType = env.DB_TYPE.toLowerCase();
	const { initDb } = await loadDbEngine(dbType);

	dbInstance = await initDb();
	return dbInstance;
}

// Function to initialize and return the BCH-related database instance
export async function getBCHDatabaseInstance(event: RequestEvent) {
	if (bchInstance) {
		return bchInstance;  // Return cached instance if it exists
	}

	if (!env.BCH_DB_TYPE || (!env.BCH_DB_URL && !env.BCH_D1 && !env.BCH_HYPERDRIVE)) {
		throw new Error('BCH database type or URL is not defined.');
	}

	let bchDbUrl: string | null = null;
	if (env.ORB_ENABLE !== 'false' && env.ORB_URL) {
		bchDbUrl = env.ORB_URL;  // Load the the static Orb device URL
	} else if (env.ORB_ENABLE !== 'false') {
		bchDbUrl = loadOrbUrl();  // Load the dynamic Orb device URL
	}

	const bchDbType = env.BCH_DB_TYPE.toLowerCase();
	const { initDb } = await loadDbEngine(bchDbType);

	bchInstance = await initDb('bch');
	return bchInstance;
}
