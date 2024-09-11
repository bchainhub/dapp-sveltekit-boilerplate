import { up } from "@auth/d1-adapter";
import { json } from '@sveltejs/kit';
import { genv } from '$lib/helpers/genv';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ platform, locals, url }) => {
	if (!platform || !platform.env) {
		return json({ error: 'Platform or environment configuration missing', code: 500.01 }, { status: 500 });
	}

	const shouldInit = genv(platform).DB_INIT;
	const initParam = url.searchParams.get('tk');

	if (shouldInit && initParam && initParam === shouldInit) {

		try {
			const dbType = genv(platform).DB_TYPE;

			if (dbType === 'D1') {
				await up(locals.db); // D1-specific schema migration

				// D1 - Use raw SQL for initialization
				await locals.db?.prepare(`
					CREATE TABLE IF NOT EXISTS "Authenticator" (
						"credentialID" TEXT NOT NULL PRIMARY KEY,
						"userId" TEXT NOT NULL,
						"providerAccountId" TEXT NOT NULL,
						"credentialPublicKey" TEXT NOT NULL,
						"counter" INTEGER NOT NULL,
						"credentialDeviceType" TEXT NOT NULL,
						"credentialBackedUp" BOOLEAN NOT NULL,
						"transports" TEXT,
						"isVerified" BOOLEAN DEFAULT 0,
						"receivedDate" DATE DEFAULT NULL,
						CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
					);
					CREATE INDEX IF NOT EXISTS Authenticator_isVerified_key ON Authenticator (isVerified);
					CREATE INDEX IF NOT EXISTS Authenticator_receivedDate_key ON Authenticator (receivedDate);
				`).run();

			} else if (dbType === 'PRISMA') {
				// Prisma - use Prisma migration system (schema.prisma should be defined)
				console.log('Prisma DB schema should be managed via Prisma Migrations');
				// Here you wouldn't run raw SQL, you should have your schema in schema.prisma
			}

			return json({ error: 'Database initialized successfully', code: 200.01 }, { status: 200 });
		} catch (error) {
			return json({ error: 'Error during database initialization', code: 500.02 }, { status: 500 });
		}

	} else {
		return json({ error: 'Initialization is disabled', code: 400.01 }, { status: 400 });
	}
};
