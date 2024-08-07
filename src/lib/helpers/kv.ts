import { env } from '$env/dynamic/private';
import type { KVNamespace } from '@cloudflare/workers-types';

/**
 * Retrieves and validates the KV namespace instance from the platform environment.
 * @param platform - The platform object from SvelteKit.
 * @returns The KV namespace instance.
 * @throws Will throw an error if the KV namespace is not defined or not found.
 */
export function getKVNamespace(platform: any): KVNamespace {
	const kvName = env.KV_NAMESPACE;
	if (!kvName) {
		throw new Error("KV namespace name not defined.");
	}

	const kv = platform.env[kvName as keyof typeof platform.env] as unknown as KVNamespace;

	if (!kv) {
		throw new Error("KV namespace not found.");
	}

	return kv;
}
