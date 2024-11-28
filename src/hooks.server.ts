import { initializeDatabases } from './server/db/db';
import { getGeoData } from '$lib/helpers/geo';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		// Initialize the databases and attach them to locals
		const { db, bchdb } = await initializeDatabases(event);
		event.locals.db = db;
		event.locals.bchdb = bchdb;

		// Attach geolocation data if available
		getGeoData(event);
	} catch (error) {
		console.error('Error in handle function:', error);
	}

	return resolve(event);
};
