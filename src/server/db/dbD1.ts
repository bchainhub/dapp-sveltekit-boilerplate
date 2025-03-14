import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

const DB_D1 = process.env.DB_D1;

export async function initDb($type?: string) {
	const d1: D1Database | undefined = DB_D1 as D1Database | undefined;

	if (!d1) {
		throw new Error("D1 Database not found!");
	}

	return drizzle(d1);
}
