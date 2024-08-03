import type { LayoutServerLoad } from "./$types";
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async (event) => {
	let session = null;

	if (env.ENABLE_AUTH === 'true') {
		if (event.locals.auth) {
			session = await event.locals.auth();
		} else {
			console.error("Authentication function not available in locals.");
		}
	}

	return {
		session,
		config: event.locals.config
	};
};
