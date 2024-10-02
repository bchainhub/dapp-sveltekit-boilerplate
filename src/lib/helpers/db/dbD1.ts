import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

export async function initDb($type?: string) {
	const d1: D1Database | undefined = env.D1_DB as D1Database | undefined;

	if (!d1) {
		throw new Error("D1 Database not found!");
	}

	return drizzle(d1);
}
