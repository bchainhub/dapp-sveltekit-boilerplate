import * as publicDynamicEnv from '$env/dynamic/public';
import { PUBLIC_WEB4_URL } from '$env/static/public';
import { loadWeb4Loc } from '$lib/helpers/connectWeb4';
import type { RequestEvent } from '@sveltejs/kit';

// Global variables to cache the database instances
let dbInstance: any;
let bchInstance: any;
let previousBCHInstance: any;

const publicEnableWeb4: boolean = publicDynamicEnv.env.PUBLIC_ENABLE_WEB4 === 'true' || false;
const publicWeb4Url: string = PUBLIC_WEB4_URL || 'file:local.db';

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

	// Handle PUBLIC_WEB4_URL and PUBLIC_ENABLE_WEB4 for BCH
	let bchDbUrl: string | null = null;
	if (publicEnableWeb4 && publicWeb4Url) {
		bchDbUrl = publicWeb4Url; // Static Public Web4 URL
	} else if (publicEnableWeb4) {
		bchDbUrl = loadWeb4Loc(); // Dynamic Web4 URL
	}

	// Dynamically load the appropriate database engine
	const { initDb } = await loadDbEngine(type);

	// Pass only the required parameters to initDb
	const connectionString = bchDbUrl ?? url ?? hyperdrive;
	if (!connectionString) {
		throw new Error('No connection details provided for BCH database initialization.');
	}

	// Initialize and cache the BCH database instance
	bchInstance = await initDb(connectionString);
	return bchInstance;
}

// Web4-Specific Functions
export async function enableWeb4() {
	if (!publicEnableWeb4) {
		console.warn('Web4 is disabled by configuration.');
		return false;
	}

	const web4Url = publicWeb4Url || loadWeb4Loc(); // Use PUBLIC_WEB4_URL or dynamic URL

	if (!web4Url) {
		console.error('Web4 URL is missing. Cannot enable Web4.');
		return false;
	}

	try {
		// Cache the previous BCH instance for fallback
		if (!previousBCHInstance) {
			previousBCHInstance = bchInstance;
		}

		// Use Web4 database
		const { initDb } = await loadDbEngine('sqlite');
		bchInstance = await initDb(web4Url); // Pass the resolved Web4 URL
		return true;
	} catch (error) {
		console.error('Failed to enable Web4:', error);
		return false;
	}
}

export async function disableWeb4() {
	if (!publicEnableWeb4) {
		console.warn('Web4 is disabled by configuration.');
		return;
	}

	if (!previousBCHInstance) {
		console.warn('No previous BCH database configuration available.');
		return;
	}

	try {
		// Restore the previous BCH instance
		bchInstance = previousBCHInstance;
		previousBCHInstance = null; // Clear the cache
	} catch (error) {
		console.error('Failed to disable Web4:', error);
	}
}

// Utility functions to check Web4 state
export function isWeb4Connected() {
	return publicEnableWeb4 && bchInstance;
}

export function isPublicEnableWeb4(): boolean {
	return publicEnableWeb4;
}
