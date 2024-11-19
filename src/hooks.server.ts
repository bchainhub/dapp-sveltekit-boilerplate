import { env } from '$env/dynamic/private';
import { getDatabaseInstance, getBCHDatabaseInstance } from '$lib/helpers/db';
import { getGeoData } from '$lib/helpers/geo';
import { connectWalletServer, disconnectWalletServer } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		// Initialize the database
		if (env.DB_TYPE) {
			try {
				const db = await getDatabaseInstance(event);
				event.locals.db = db;
			} catch (error) {
				console.error('Failed to initialize database: ', error);
			}
		}

		if (env.BCH_DB_TYPE) {
			try {
				const bchdb = await getBCHDatabaseInstance(event);
				event.locals.bchdb = bchdb;
			} catch (error) {
				console.error('Failed to initialize BCH database: ', error);
			}
		}

		// Initialize wallet if authentication is enabled
		if (env.ENABLE_AUTH === 'true') {
			try {
				const result = await connectWalletServer(); // Assuming connectWalletServer returns wallet info
				event.locals.wallet = {
					address: result.accounts[0],
					type: result.type
				};
			} catch (error) {
				console.error('Wallet initialization failed:', error);
			}
		}

		// Provide geo data if enabled
		getGeoData(event);
	} catch (generalError) {
		console.error('General error in handle function:', generalError);
	}

	return resolve(event);
};
