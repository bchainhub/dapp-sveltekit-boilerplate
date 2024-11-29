import { getDatabaseInstance, getBCHDatabaseInstance } from './index';
import type { RequestEvent } from '@sveltejs/kit';

// Dynamically handle optional environment variables
const ENV_DB_TYPE: string | undefined = process.env.DB_TYPE;
const ENV_DB_URL: string | undefined = process.env.DB_URL;
const ENV_DB_D1: string | undefined = process.env.DB_D1;
const ENV_HYPERDRIVE: string | undefined = process.env.HYPERDRIVE;

const ENV_BCH_DB_TYPE: string | undefined = process.env.BCH_DB_TYPE;
const ENV_BCH_DB_URL: string | undefined = process.env.BCH_DB_URL;
const ENV_BCH_HYPERDRIVE: string | undefined = process.env.BCH_HYPERDRIVE;

export async function initializeDatabases(event: RequestEvent) {
	let db = null;
	let bchdb = null;

	try {
		// Primary database initialization
		if (ENV_DB_TYPE) {
			db = await getDatabaseInstance({
				type: ENV_DB_TYPE,
				url: ENV_DB_URL || undefined,
				d1: ENV_DB_D1 || undefined,
				hyperdrive: ENV_HYPERDRIVE || undefined,
				event
			});
		} else {
			console.warn('DB_TYPE is not defined. Skipping primary database initialization.');
		}

		// BCH database initialization
		if (ENV_BCH_DB_TYPE) {
			bchdb = await getBCHDatabaseInstance({
				type: ENV_BCH_DB_TYPE,
				url: ENV_BCH_DB_URL || undefined,
				hyperdrive: ENV_BCH_HYPERDRIVE || undefined,
				event
			});
		} else {
			console.warn('BCH_DB_TYPE is not defined. Skipping BCH database initialization.');
		}
	} catch (error) {
		console.error('Error initializing databases:', error);
	}

	return { db, bchdb };
}
