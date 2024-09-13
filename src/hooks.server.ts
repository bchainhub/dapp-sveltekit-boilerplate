import { env } from '$env/dynamic/private';
import { handle as authHandle } from './auth';
import { getDatabaseInstance, getBCHDatabaseInstance } from '$lib/helpers/db';
import { getGeoData } from '$lib/helpers/geo';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		// Initialize the database
		if (env.DB_TYPE) {
			try {
				const db = await getDatabaseInstance(event);  // Await the database initialization
				event.locals.db = db;  // Attach the db to the request locals
			} catch (error) {
				console.error('Failed to initialize database: ', error);
			}
		}

		// Initialize the Bch database
		if (env.BCH_DB_TYPE) {
			try {
				const bchdb = await getBCHDatabaseInstance(event);  // Await the database initialization
				event.locals.bchdb = bchdb;  // Attach the db to the request locals
			} catch (error) {
				console.error('Failed to initialize Bch database: ', error);
			}
		}

		if (!event.platform) {
			return resolve(event);  // Continue without initializing services
		}

		// Check if authentication is enabled via the environment variable (DB required)
		if (env.ENABLE_AUTH === 'true' && event.locals.db) {
			// Use the authHandle for authentication
			return await authHandle({ event, resolve });
		}

		// Provide geo (country, city) as variable if enabled
		getGeoData(event);
	} catch (generalError) {
		console.error('General error in handle function: ', generalError);
	}

	// If authentication is disabled or no errors occurred, proceed with the default request handling
	return resolve(event);
};
