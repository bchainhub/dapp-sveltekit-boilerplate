import postgres from 'postgres';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';  // For PostgreSQL
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';  // For D1/SQLite
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';
import type { D1Database } from '@cloudflare/workers-types';
import * as postgresSchema from '../../schemas/postgres'; // Import PostgreSQL schema
import * as sqliteSchema from '../../schemas/sqlite'; // Import SQLite schema
import * as bchPostgresSchema from '../../schemas/bch/postgres'; // Import BCH PostgreSQL schema
import * as bchSqliteSchema from '../../schemas/bch/sqlite'; // Import BCH SQLite schema

// Global variables to cache the database instances
let dbInstance: any;
let bchInstance: any;

// Function to initialize and return the main database instance
export async function getDatabaseInstance(event: RequestEvent) {
	if (dbInstance) {
		return dbInstance;  // Return cached instance if it exists
	}

	if (!env.DB_TYPE || !env.DB_URL) {
		throw new Error('Database type or URL is not defined.');
	}

	const dbType = env.DB_TYPE.toUpperCase();
	switch (dbType) {
		case 'D1': {
			const d1DatabaseName = env.DB_URL;  // Get D1 DB name from env
			const d1 = (event.platform?.env as Record<string, D1Database | undefined>)?.[d1DatabaseName];

			if (!d1) {
				throw new Error("D1 Database not found.");
			}

			dbInstance = drizzleD1(d1, { schema: sqliteSchema });  // Use SQLite schema for D1
			break;
		}

		case 'POSTGRES': {
			const sql = postgres(env.DB_URL, {
				ssl: env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,  // Handle SSL
			});

			dbInstance = drizzlePostgres(sql, { schema: postgresSchema });  // Use PostgreSQL schema
			break;
		}

		default:
			throw new Error(`Unsupported database type: ${dbType}`);
	}

	return dbInstance;  // Return the initialized instance
}

// Function to initialize and return the BCH-related database instance
export async function getBCHDatabaseInstance(event: RequestEvent) {
	if (bchInstance) {
		return bchInstance;  // Return cached instance if it exists
	}

	if (!env.BCH_DB_TYPE || !env.BCH_DB_URL) {
		throw new Error('BCH database type or URL is not defined.');
	}

	const bchDbType = env.BCH_DB_TYPE.toUpperCase();
	switch (bchDbType) {
		case 'D1': {
			const d1DatabaseName = env.BCH_DB_URL;  // Get D1 DB name for BCH from env
			const d1 = (event.platform?.env as Record<string, D1Database | undefined>)?.[d1DatabaseName];

			if (!d1) {
				throw new Error("BCH D1 Database not found.");
			}

			bchInstance = drizzleD1(d1, { schema: bchSqliteSchema });  // Use SQLite schema for BCH
			break;
		}

		case 'POSTGRES': {
			const sql = postgres(env.BCH_DB_URL, {
				ssl: env.BCH_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,  // Handle SSL for BCH
			});

			bchInstance = drizzlePostgres(sql, { schema: bchPostgresSchema });  // Use PostgreSQL schema for BCH
			break;
		}

		default:
			throw new Error(`Unsupported BCH database type: ${bchDbType}`);
	}

	return bchInstance;  // Return the initialized instance
}
