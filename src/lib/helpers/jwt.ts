import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import { config } from '../../site.config';

/**
 * Generates a JWT token based on coreId and current time.
 * @param {string} id - The unique identifier for the user.
 * @param {string} expiresIn - The expiration time for the token (e.g., '1h' for 1 hour).
 * @returns {string} - The generated JWT token.
 */
export function generateToken(id: string, expiresIn: string = (env.JWT_DURATION || '1h')): string {
	const cid = `${config.url}/${id}`;
	const payload = {
		cid,
		iat: Math.floor(Date.now() / 1000), // Issued at: current time in seconds
	};

	const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn });
	return token;
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify.
 * @returns {object|null} - The decoded token payload if valid, otherwise null.
 */
export function verifyToken(token: string): object | null {
	try {
		const decoded = jwt.verify(token, env.JWT_SECRET);
		return decoded;
	} catch (err) {
		return null;
	}
}
