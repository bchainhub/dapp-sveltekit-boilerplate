import type { RequestEvent } from '@sveltejs/kit';
import type { KVNamespace } from '@cloudflare/workers-types';
import { env } from '$env/dynamic/private';

/**
 * Retrieves and validates the KV namespace instance from the RequestEvent object.
 * @param event - The RequestEvent object provided by SvelteKit.
 * @returns The KV namespace instance.
 * @throws Will throw an error if the KV binding is not defined or not found.
 */
export function getKVNamespace(event: RequestEvent, namespace = env.KV_NAME): KVNamespace {
	if (!event.platform || !event.platform.env) {
		throw new Error("Platform or platform.env is undefined.");
	}

	if (!namespace) {
		throw new Error("KV namespace name not defined.");
	}

	// Cast the value to unknown before asserting it as KVNamespace
	const kvNamespace = event.platform.env[namespace as keyof typeof event.platform.env] as unknown as KVNamespace;

	if (!kvNamespace) {
		throw new Error('KV namespace not found.');
	}

	return kvNamespace;
}
