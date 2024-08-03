import { env } from '$env/dynamic/private';
import type { R2Bucket } from '@cloudflare/workers-types';

/**
 * Retrieves and validates the R2 bucket instance from the platform environment.
 * @param platform - The platform object from SvelteKit.
 * @returns The R2 bucket instance.
 * @throws Will throw an error if the R2 bucket binding is not defined or not found.
 */
export function getR2Bucket(platform: any): R2Bucket {
	if (env.ENABLE_FILE_ACCESS !== 'true') {
		throw new Error("File access is disabled.");
	}
	const bucketName = env.R2_NAMESPACE;
	if (!bucketName) {
		throw new Error("R2 bucket name not defined.");
	}

	const bucket = platform.env[bucketName as keyof typeof platform.env] as unknown as R2Bucket;

	if (!bucket) {
		throw new Error("R2 bucket not found.");
	}

	return bucket;
}
