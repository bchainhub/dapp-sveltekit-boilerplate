import { env } from '$env/dynamic/private';
import { handle as authHandle } from './auth';
import { getDatabaseInstance } from '$lib/helpers/db';
import { getKVNamespace } from '$lib/helpers/kv';
import { getR2Bucket } from '$lib/helpers/r2';
import { getGeoData } from '$lib/helpers/geo';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		// Initialize the database
		if (env.DB_TYPE) {
			try {
				const db = getDatabaseInstance(event);
				event.locals.db = db;
			} catch (error) {
				console.error('Failed to initialize database:', error);
			}
		}

		if (!event.platform) {
			return resolve(event); // Continue without initializing services
		}

		// Check if authentication is enabled via the environment variable (DB required)
		if (env.ENABLE_AUTH === 'true' && event.locals.db) {
			// Use the authHandle for authentication
			return await authHandle({ event, resolve });
		}

		// Initialize the KV namespace if KV_NAME is provided
		if (env.KV_NAME && event.platform) {
			try {
				const kv = getKVNamespace(event);
				event.locals.kv = kv;
			} catch (error) {
				console.error('Failed to initialize KV:', error);
			}
		}

		// Initialize the R2 bucket if R2_NAME is provided
		if (env.R2_NAME && event.platform) {
			try {
				const bucket = getR2Bucket(event);
				event.locals.bucket = bucket;
			} catch (error) {
				console.error('Failed to initialize R2 bucket:', error);
			}
		}

		// Capture geo if enabled
		getGeoData(event);
	} catch (generalError) {
		console.error('General error in handle function:', generalError);
	}

	// If authentication is disabled or no errors occurred, proceed with the default request handling
	return resolve(event);
};
