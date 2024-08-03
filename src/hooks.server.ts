import { env } from '$env/dynamic/private';
import { handle as authHandle } from './auth';
import { getDatabaseInstance } from '$lib/helpers/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize the database if D1_NAMESPACE is provided
	if (env.D1_NAMESPACE) {
		try {
			const db = getDatabaseInstance(event.platform);
			event.locals.db = db;
		} catch (error) {
			console.error('Failed to initialize database:', error);
		}
	}

	// Check if authentication is enabled via the environment variable
	if (env.ENABLE_AUTH === 'true') {
		// Use the authHandle for authentication
		return await authHandle({ event, resolve });
	} else {
		// If authentication is disabled, proceed with the default request handling
		return await resolve(event);
	}
};
