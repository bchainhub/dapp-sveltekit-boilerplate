import type { R2Bucket } from '@cloudflare/workers-types';
import type { RequestEvent } from '@sveltejs/kit';
import { R2_NAME } from '$env/static/private';

/**
 * Retrieves and validates the R2 bucket instance from the RequestEvent object.
 * @param event - The RequestEvent object provided by SvelteKit.
 * @returns The R2 bucket instance.
 * @throws Will throw an error if the R2 bucket binding is not defined or not found.
 */
export function getR2Bucket(event: RequestEvent, namespace = R2_NAME): R2Bucket {
	if (!event.platform || !event.platform.env) {
		throw new Error("Platform or platform.env is undefined.");
	}

	if (!namespace) {
		throw new Error("R2 bucket name not defined.");
	}

	// Cast the value to unknown before asserting it as R2Bucket
	const bucket = event.platform.env[namespace as keyof typeof event.platform.env] as unknown as R2Bucket;

	if (!bucket) {
		throw new Error('R2 bucket not found.');
	}

	return bucket;
}
