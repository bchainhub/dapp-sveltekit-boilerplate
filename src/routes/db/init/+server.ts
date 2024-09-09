import { up } from "@auth/d1-adapter";
import { json } from '@sveltejs/kit';
import { genv } from '$lib/helpers/genv';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ platform, locals }) => {
	if (!platform || !platform.env) {
		return json({ error: 'Platform or environment configuration missing', code: 500.01 }, { status: 500 });
	}

	const shouldInit = genv(platform).DB_INIT;

	if (!shouldInit) {
		return json({ error: 'Initialization is disabled', code: 400.01 }, { status: 400 });
	}

	try {
		await up(locals.db);

		// Additional fields for the Authenticator table
		await locals.db?.prepare(`
			CREATE TABLE IF NOT EXISTS "Authenticator" (
				"id" TEXT NOT NULL PRIMARY KEY,
				"credentialID" TEXT NOT NULL,
				"userId" TEXT NOT NULL,
				"providerAccountId" TEXT NOT NULL,
				"credentialPublicKey" TEXT NOT NULL,
				"counter" INTEGER NOT NULL,
				"credentialDeviceType" TEXT NOT NULL,
				"credentialBackedUp" BOOLEAN NOT NULL,
				"transports" TEXT,
				CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
			);
		`).run();

		// Index for the credentialID field
		await locals.db?.prepare(`
			CREATE UNIQUE INDEX IF NOT EXISTS "Authenticator_credentialID_key" ON "Authenticator"("credentialID");
		`).run();

		// Additional fields for the User table:
		// coreId - The Core ID of the user (free item)
		// isActive - Whether the user Core ID is updated (user is activated)
		// isVerified - Whether the user Core ID is KYC verified (free item)
		await locals.db?.prepare(`
			ALTER TABLE users ADD COLUMN coreId CHAR(44);
			CREATE INDEX idx_coreid ON users (coreId);
			ALTER TABLE users ADD COLUMN isActive BOOLEAN DEFAULT 0;
			ALTER TABLE users ADD COLUMN isVerified BOOLEAN DEFAULT 0;
		`).run();

		return json({ error: 'Database initialized successfully', code: 200.01 }, { status: 200 });
	} catch (error) {
		return json({ error: 'Error during database initialization', code: 500.02 }, { status: 500 });
	}
};
