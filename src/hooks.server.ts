import { env } from '$env/dynamic/private';
import { handle as authHandle } from './auth';
import { getDatabaseInstance } from '$lib/helpers/db';
import { getKVNamespace } from '$lib/helpers/kv';
import { getR2Bucket } from '$lib/helpers/r2';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize the database if D1_NAMESPACE is provided
	if (env.D1_NAMESPACE) {
		try {
			const db = getDatabaseInstance(event.platform);
			event.locals.db = db;
		} catch (error) {
			console.error('Failed to initialize database.');
		}
	}

	// Initialize the key-value if KV_NAMESPACE is provided
	if (env.KV_NAMESPACE) {
		try {
			const kv = getKVNamespace(event.platform);
			event.locals.kv = kv;
		} catch (error) {
			console.error('Failed to initialize KV.');
		}
	}

	// Initialize the R2 bucket if R2_NAMESPACE is provided
	if (env.R2_NAMESPACE) {
		try {
			const bucket = getR2Bucket(event.platform);
			event.locals.bucket = bucket;
		} catch (error) {
			console.error('Failed to initialize R2 bucket.');
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
