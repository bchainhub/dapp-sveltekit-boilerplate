import { PUBLIC_WEB4_URL } from '$env/static/public';
import * as publicDynamicEnv from '$env/dynamic/public';

// Global variables for Web4 state management
let previousBCHInstance: any;
let bchInstance: any;

export async function enableWeb4() {
	const publicEnableWeb4: boolean =
		publicDynamicEnv.env.PUBLIC_ENABLE_WEB4 === 'true' || false;
	const publicWeb4Url: string = PUBLIC_WEB4_URL || 'file:local.db';

	if (!publicEnableWeb4) {
		console.warn('Web4 is disabled by configuration.');
		return false;
	}

	const web4Url = publicWeb4Url;

	if (!web4Url) {
		console.error('Web4 URL is missing. Cannot enable Web4.');
		return false;
	}

	try {
		// Cache the previous BCH instance for fallback
		if (!previousBCHInstance) {
			previousBCHInstance = bchInstance;
		}

		// Dynamically load Web4 database engine
		const { initDb } = await import('../../server/db/dbSqlite'); // Assuming sqlite is used for Web4
		bchInstance = await initDb(web4Url);
		return true;
	} catch (error) {
		console.error('Failed to enable Web4:', error);
		return false;
	}
}

export async function disableWeb4() {
	const publicEnableWeb4: boolean =
		publicDynamicEnv.env.PUBLIC_ENABLE_WEB4 === 'true' || false;

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

export function isWeb4Connected() {
	const publicEnableWeb4: boolean =
		publicDynamicEnv.env.PUBLIC_ENABLE_WEB4 === 'true' || false;
	return publicEnableWeb4 && bchInstance;
}

export function isPublicEnableWeb4(): boolean {
	return publicDynamicEnv.env.PUBLIC_ENABLE_WEB4 === 'true' || false;
}
