import { env } from '$env/dynamic/private';
import type { KVNamespace } from '@cloudflare/workers-types';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Retrieves and validates the KV namespace instance from the RequestEvent object.
 * @param event - The RequestEvent object provided by SvelteKit.
 * @returns The KV namespace instance.
 * @throws Will throw an error if the KV namespace is not defined or not found.
 */
export function getKVNamespace(event: RequestEvent): KVNamespace {
	if (!event.platform) {
		throw new Error("Platform is undefined.");
	}

	const kvName = env.KV_NAME;
	if (!kvName) {
		throw new Error("KV namespace name not defined.");
	}

	const kv = (event.platform?.env as Record<string, KVNamespace | undefined>)?.[kvName];

	if (!kv) {
		throw new Error("KV namespace not found.");
	}

	return kv;
}
