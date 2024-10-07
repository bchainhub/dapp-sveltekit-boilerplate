import { env } from '$env/dynamic/private';

/**
 * Retrieves and processes all environment variables.
 * @returns An object containing all environment variables with 'true'/'false' strings converted to boolean values.
 */
export const genv = (): { [key: string]: string | boolean } => {
	const envVars: { [key: string]: string | boolean } = {};

	for (const key in env) {
		if (Object.prototype.hasOwnProperty.call(env, key)) {
			let value = env[key];

			if (typeof value === 'string') {
				value = value.trim();
				if (value.toLowerCase() === 'true') {
					envVars[key] = true;
				} else if (value.toLowerCase() === 'false') {
					envVars[key] = false;
				} else {
					envVars[key] = value;
				}
			}
		}
	}
	return envVars;
};
