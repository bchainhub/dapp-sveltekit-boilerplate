/**
 * Retrieves and processes all environment variables from the Cloudflare environment.
 * @param platform - The platform object provided by Cloudflare Workers.
 * @returns An object containing all environment variables with 'true'/'false' strings converted to boolean values.
 * @throws Will throw an error if the platform or platform.env is not defined.
 */
export function genv(platform: any): { [key: string]: string | boolean } {
	if (!platform || !platform.env) {
		throw new Error("Platform or environment configuration missing.");
	}

	const envVars: { [key: string]: string | boolean } = {};
	for (const key in platform.env) {
		if (Object.prototype.hasOwnProperty.call(platform.env, key)) {
			let value = platform.env[key];

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
}
