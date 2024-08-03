import { getUser, updateUser } from '@auth/sveltekit';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { verifyToken } from '$lib/helpers/jwt';
import Ican from '@blockchainhub/ican';

// This should be defined or imported from your user model/database interaction
const creationTimes = new Map(); // Stores user creation times or request creation times

// Middleware to handle user update requests
export const POST: RequestHandler = async ({ request }) => {
	try {
		// If Auth is enabled
		if (env.ENABLE_AUTH !== 'true') {
			return json({ error: 'Auth is disabled', code: 400.01 }, { status: 400 });
		}

		// If Pipe is enabled
		if (env.ENABLE_PIPE !== 'true') {
			return json({ error: 'Pipe is disabled', code: 400.01 }, { status: 400 });
		}

		// Check if the Content-Type header is application/json
		const contentType = request.headers.get('Content-Type');
		if (!contentType || contentType !== 'application/json') {
			return json({ error: 'Invalid content type, expected application/json', code: 400.02 }, { status: 400 });
		}

		// Authorization check
		const authHeader = request.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return json({ error: 'Unauthorized', code: 401.01 }, { status: 401 });
		}
		const token = authHeader.split('Bearer ')[1];
		if (!token) {
			return json({ error: 'Unauthorized', code: 401.02 }, { status: 401 });
		}
		if (!verifyToken(token)) {
			return json({ error: 'Unauthorized', code: 401.03 }, { status: 401 });
		}

		const data = await request.json();
		const coreId = data.coreId; // Core ID
		const id = data.id;
		const userId = `pipe-${id}`; // Pipe ID - to identify the user

		// Check if the coreId is provided and valid
		if (!coreId || !Ican.isValid(coreId, true)) {
			return json({ error: 'CoreId is required and must be valid', code: 400.03 }, { status: 400 });
		}

		// Check if the id is provided and exists
		if (!id) {
			return json({ error: 'UserId is required', code: 400.04 }, { status: 400 });
		}

		// Retrieve user and check existence
		const user = await getUser(userId);
		if (!user) {
			return json({ error: 'User not found', code: 404.01 }, { status: 404 });
		}

		// Check if the request is within the valid time frame
		const now = Date.now();
		const creationTime = creationTimes.get(userId);
		const pipeDuration = Number(env.PIPE_DURATION);
		const finalPipeDuration = isNaN(pipeDuration) ? 60 : pipeDuration;

		if (!creationTime || now - creationTime > finalPipeDuration * 1000) {
			return json({ error: 'Request expired', code: 400.05 }, { status: 400 });
		}

		// Ensure the userId is not being updated
		if (id && userId !== user.userId) {
			return json({ error: 'Cannot change userId', code: 400.06 }, { status: 400 });
		}

		// Ensure the coreId is not being updated
		if (coreId && coreId !== user.coreId) {
			return json({ error: 'Cannot change coreId', code: 400.07 }, { status: 400 });
		}

		// Process the allowed updates
		const allowedUpdates = [
			'coreId', 'isVerified'
		];
		// Filtering updates to only allowed fields
		const filteredUpdates = Object.keys(data)
		.filter(key => allowedUpdates.includes(key))
		.reduce((obj, key) => {
			obj[key] = data[key];
			return obj;
		}, {});
		const finalUpdates = { ...filteredUpdates, isActive: true };

		// Update the user in the database
		await updateUser(userId, finalUpdates);

		return json({ message: 'User updated successfully', code: 200.01 }, { status: 200 });

	} catch (error) {
		return json({ error: 'Internal Server Error', code: 500.01 }, { status: 500 });
	}
};
