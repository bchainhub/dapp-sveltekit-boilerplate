import { json } from '@sveltejs/kit';
import { genv } from '$lib/helpers/genv';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ platform, request, locals }) => {
	if (!platform || !platform.env) {
		return json({ error: 'Platform or environment configuration missing', code: 500.01 }, { status: 500 });
	}

	const shouldStart = genv(platform).DB_CLEAN_TOKEN;
	const data = await request.json();

	if (!shouldStart) {
		return json({ error: 'Cleaning is disabled by token', code: 400.01 }, { status: 400 });
	} else if (shouldStart !== data.token) {
		return json({ error: 'Invalid cleaning token', code: 401.01 }, { status: 401 });
	}

	const shouldClean = genv(platform).DB_CLEAN;

	if (!shouldClean) {
		return json({ error: 'Cleaning is disabled', code: 400.01 }, { status: 400 });
	}

	try {
		// Cleaning stale accounts:
		// If table uses the ON DELETE CASCADE option on the userId foreign key constraint,
		// deleting a user from the User table will automatically delete all associated entries in the related tables.
		await locals.db.prepare(`
			DELETE FROM users
			WHERE isActive = 0
			AND created_at < datetime('now', '-1 day');
		`).run();

		return json({ error: 'Database initialized successfully', code: 200.01 }, { status: 200 });
	} catch (error) {
		return json({ error: 'Error during database initialization', code: 500.02 }, { status: 500 });
	}
};
