import { env } from '$env/dynamic/private';
import type { D1Database } from '@cloudflare/workers-types';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Define Prisma and Supabase clients (to be instantiated lazily)
let prisma: PrismaClient | null = null;

/**
 * Retrieves and validates the database instance based on the type defined in the environment.
 * @param event - The RequestEvent object provided by SvelteKit.
 * @returns The database instance (either D1Database, PrismaClient, or SupabaseClient).
 * @throws Will throw an error if the database type or instance is not found.
 */
export function getDatabaseInstance(event: RequestEvent): D1Database | PrismaClient | ReturnType<typeof createSupabaseClient> {
	const dbType = env.DB_TYPE;

	if (!dbType) {
		throw new Error("Database type is not defined in environment.");
	}

	switch (dbType.toUpperCase()) {
		case 'D1': {
			// Handle Cloudflare D1 database
			if (!event.platform) {
				throw new Error("Platform is undefined.");
			}

			const dbName = env.D1_NAMESPACE;
			if (!dbName) {
				throw new Error("Database name not defined.");
			}

			const d1 = (event.platform?.env as Record<string, D1Database | undefined>)?.[dbName];

			if (!d1) {
				throw new Error("D1 Database not found.");
			}

			return d1;
		}

		case 'PRISMA': {
			// Handle Prisma (instantiate the Prisma client if not already done)
			if (!prisma) {
				const prisma_provider = env.PRISMA_PROVIDER || 'postgresql';
				const prisma_api_key = env.PRISMA_API_KEY;

				if (!prisma_api_key) {
					throw new Error("PRISMA_API_KEY is not defined.");
				}

				prisma = new PrismaClient({
					datasources: {
						db: {
							url: `prisma://accelerate.prisma-data.net/?api_key=${prisma_api_key}`
						}
					}
				}).$extends(withAccelerate());
			}
			return prisma;
		}

		default: {
			throw new Error(`Unsupported database type: ${dbType}`);
		}
	}
}
