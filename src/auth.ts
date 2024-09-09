import { SvelteKitAuth } from "@auth/sveltekit";
import Passkey from "@auth/sveltekit/providers/passkey";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { D1Adapter } from "@auth/d1-adapter";
import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';
import { genv } from '$lib/helpers/genv';
import { config } from './site.config';
import type { Session as AuthSession, User as AuthUser } from "@auth/core/types";

// Define User and Session interfaces
interface User extends AuthUser {
	coreId?: string;
	isActive?: boolean;
	isVerified?: boolean;
}

interface Session extends AuthSession {
	user: User;
}

// Define Prisma client globally to reuse the instance
let prisma: PrismaClient | null = null;

const auth = SvelteKitAuth(async (event) => {
	const db = event.locals.db;
	if (!db) throw new Error('Database instance not found. Authentication cannot proceed.');

	const authSecret = genv(event.platform).AUTH_SECRET as string;
	const maxAge = genv(event.platform).LOGIN_MAX_AGE || 86400; // Default to 24 hours
	const bareUrl = config.url.replace(/(^\w+:|^)\/\//, '');
	const passkeyDuration = Number(env.PASSKEY_DURATION) || 60000;

	let adapter;
	if (db instanceof PrismaClient) {
		adapter = PrismaAdapter(db);
	} else if (db instanceof D1Adapter) {
		adapter = D1Adapter(db);
	} else {
		throw new Error('Unsupported database type.');
	}

	return {
		providers: [
			Passkey({
				id: `corepass/${bareUrl}`,
				name: 'CorePass',
				relayingParty: {
					id: bareUrl,
					name: config.title,
					origin: config.url,
				},
				enableConditionalUI: true,
				formFields: {
					email: {
						label: "Email",
						required: true,
						autocomplete: "username webauthn",
					},
				},
				authenticationOptions: {
					timeout: passkeyDuration,
					userVerification: "required",
					extensions: {
						appid: bareUrl,
					},
				},
				registrationOptions: {
					timeout: passkeyDuration,
					extensions: {
						appid: bareUrl,
					},
					attestationType: "indirect",
					authenticatorSelection: {
						residentKey: "required",
						userVerification: "required",
						authenticatorAttachment: "cross-platform",
					},
					supportedAlgorithmIDs: [-8], // EdDSA
				},
			}),
		],
		adapter,
		secret: authSecret,
		maxAge: maxAge,
		experimental: { enableWebAuthn: true },
		callbacks: {
			async signIn({ user }: { user: User }) {
				if (env.ONLY_ACTIVATED === 'true' && !user.isActive) {
					return false;
				}
				return true;
			},
			async session({ session, user }: { session: Session; user: User }) {
				if (session.user) {
					session.user.coreId = user.coreId;
					session.user.isVerified = user.isVerified;
				}
				return session;
			},
		},
	};
});

// Export handle, signIn, and signOut separately
export const { handle, signIn, signOut } = auth;
