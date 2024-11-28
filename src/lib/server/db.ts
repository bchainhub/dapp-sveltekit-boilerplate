import {
	DB_TYPE,
	DB_URL,
	DB_D1,
	HYPERDRIVE,
	BCH_DB_TYPE,
	BCH_DB_URL,
	BCH_HYPERDRIVE
} from '$env/static/private';
import { getDatabaseInstance, getBCHDatabaseInstance } from '$lib/helpers/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function initializeDatabases(event: RequestEvent) {
	let db = null;
	let bchdb = null;

	try {
		if (DB_TYPE) {
			db = await getDatabaseInstance({
				type: DB_TYPE,
				url: DB_URL,
				d1: DB_D1,
				hyperdrive: HYPERDRIVE,
				event
			});
		}

		if (BCH_DB_TYPE) {
			bchdb = await getBCHDatabaseInstance({
				type: BCH_DB_TYPE,
				url: BCH_DB_URL,
				hyperdrive: BCH_HYPERDRIVE,
				event
			});
		}
	} catch (error) {
		console.error('Error initializing databases:', error);
	}

	return { db, bchdb };
}
