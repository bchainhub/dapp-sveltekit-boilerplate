import { env } from '$env/dynamic/private';
import type { R2Bucket } from '@cloudflare/workers-types';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Retrieves and validates the R2 bucket instance from the RequestEvent object.
 * @param event - The RequestEvent object provided by SvelteKit.
 * @returns The R2 bucket instance.
 * @throws Will throw an error if the R2 bucket binding is not defined or not found.
 */
export function getR2Bucket(event: RequestEvent): R2Bucket {
	if (!event.platform) {
		throw new Error("Platform is undefined.");
	}

	if (env.ENABLE_FILE_ACCESS !== 'true') {
		throw new Error("File access is disabled.");
	}
	const bucketName = env.R2_NAMESPACE;
	if (!bucketName) {
		throw new Error("R2 bucket name not defined.");
	}

	const bucket = (event.platform?.env as Record<string, R2Bucket | undefined>)?.[bucketName];

	if (!bucket) {
		throw new Error("R2 bucket not found.");
	}

	return bucket;
}
