import { DB_TYPE, BCH_DB_TYPE } from '$env/static/private';
import { getDatabaseInstance, getBCHDatabaseInstance } from '$lib/helpers/db';
import { getGeoData } from '$lib/helpers/geo';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		// Initialize the database
		if (DB_TYPE) {
			try {
				const db = await getDatabaseInstance(event);
				event.locals.db = db;
			} catch (error) {
				console.error('Failed to initialize database: ', error);
			}
		}

		if (BCH_DB_TYPE) {
			try {
				const bchdb = await getBCHDatabaseInstance(event);
				event.locals.bchdb = bchdb;
			} catch (error) {
				console.error('Failed to initialize BCH database: ', error);
			}
		}

		// Provide geo data if enabled
		getGeoData(event);
	} catch (generalError) {
		console.error('General error in handle function:', generalError);
	}

	return resolve(event);
};
