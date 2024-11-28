import { PUBLIC_WEB4_URL } from '$env/static/public';
import * as publicDynamicEnv from '$env/dynamic/public';
import type { RequestEvent } from '@sveltejs/kit';

// Global variables to cache the database instances
let dbInstance: any;
let bchInstance: any;

// Helper function to dynamically load database engines
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
export async function getDatabaseInstance({
	type,
	url,
	d1,
	hyperdrive,
	event
}: {
	type: string;
	url?: string;
	d1?: string;
	hyperdrive?: string;
	event: RequestEvent;
}) {
	if (dbInstance) {
		return dbInstance; // Return cached instance if it exists
	}

	// Dynamically load the appropriate database engine
	const { initDb } = await loadDbEngine(type);

	// Pass only the required parameters to initDb
	const connectionString = url ?? d1 ?? hyperdrive;
	if (!connectionString) {
		throw new Error('No connection details provided for database initialization.');
	}

	// Initialize and cache the database instance
	dbInstance = await initDb(connectionString);
	return dbInstance;
}

// Function to initialize and return the BCH-related database instance
export async function getBCHDatabaseInstance({
	type,
	url,
	hyperdrive,
	event
}: {
	type: string;
	url?: string;
	hyperdrive?: string;
	event: RequestEvent;
}) {
	if (bchInstance) {
		return bchInstance; // Return cached instance if it exists
	}

	const publicEnableWeb4: boolean =
		publicDynamicEnv.env.PUBLIC_ENABLE_WEB4 === 'true' || false;
	const publicWeb4Url: string = PUBLIC_WEB4_URL || 'file:local.db';

	// Dynamically load the appropriate database engine
	const { initDb } = await loadDbEngine(type);

	// Pass only the required parameters to initDb
	const connectionString = publicEnableWeb4
		? publicWeb4Url || null
		: url ?? hyperdrive;

	if (!connectionString) {
		throw new Error('No connection details provided for BCH database initialization.');
	}

	// Initialize and cache the BCH database instance
	bchInstance = await initDb(connectionString);
	return bchInstance;
}
