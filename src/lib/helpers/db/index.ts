import {
	DB_TYPE,
	DB_URL,
	DB_D1,
	HYPERDRIVE,
	BCH_DB_TYPE,
	BCH_DB_URL,
	BCH_HYPERDRIVE,
	WEB4_URL
} from '$env/static/private';
import { PUBLIC_ENABLE_WEB4 } from '$env/dynamic/public';
import { loadWeb4Loc } from '$lib/helpers/connectWeb4';
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
		case 'web4':
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
		return dbInstance; // Return cached instance if it exists
	}

	// Handle optional DB_TYPE
	const dbType = DB_TYPE?.toLowerCase();
	if (!dbType) {
		throw new Error('DB_TYPE is not defined.');
	}

	if (!DB_URL && !DB_D1 && !HYPERDRIVE) {
		throw new Error('No database connection details are defined.');
	}

	// Dynamically load the appropriate database engine
	const { initDb } = await loadDbEngine(dbType);

	// Initialize and cache the database instance
	dbInstance = await initDb();
	return dbInstance;
}

// Function to initialize and return the BCH-related database instance
export async function getBCHDatabaseInstance(event: RequestEvent) {
	if (bchInstance) {
		return bchInstance; // Return cached instance if it exists
	}

	// Handle optional BCH_DB_TYPE
	const bchDbType = BCH_DB_TYPE?.toLowerCase();
	if (!bchDbType) {
		throw new Error('BCH_DB_TYPE is not defined.');
	}

	if (!BCH_DB_URL && !BCH_HYPERDRIVE) {
		throw new Error('No BCH database connection details are defined.');
	}

	// Handle WEB4_URL and PUBLIC_ENABLE_WEB4 for BCH
	let bchDbUrl: string | null = null;
	if (PUBLIC_ENABLE_WEB4 !== 'false' && WEB4_URL) {
		bchDbUrl = WEB4_URL; // Static Web4 URL
	} else if (PUBLIC_ENABLE_WEB4 !== 'false') {
		bchDbUrl = loadWeb4Loc(); // Dynamic Web4 URL
	}

	// Dynamically load the appropriate database engine
	const { initDb } = await loadDbEngine(bchDbType);

	// Initialize and cache the BCH database instance
	bchInstance = await initDb('bch');
	return bchInstance;
}
