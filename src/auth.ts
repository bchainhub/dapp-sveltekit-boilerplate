import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import WebAuthn from "@auth/core/providers/webauthn";
import { D1Adapter } from "@auth/d1-adapter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';
import { genv } from '$lib/helpers/genv';
import { config } from './site.config';
import Ican from '@blockchainhub/ican';
import type { Session as AuthSession, User as AuthUser } from "@auth/core/types";

// TODO: Define User and Session interfaces; Move to a shared file if needed
interface User extends AuthUser {
	authId?: string;
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
	const maxAge = Number(genv(event.platform).LOGIN_MAX_AGE) || 86400; // Default to 24 hours
	const bareUrl = config.url.replace(/(^\w+:|^)\/\//, '');
	const passkeyDuration = Number(env.PASSKEY_DURATION) || 120000; // 2 minutes

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
			WebAuthn({
				id: `corepass/${bareUrl}`,
				name: 'CorePass',
				relayingParty: {
					id: bareUrl,
					name: config.title,
					origin: config.url,
				},
				enableConditionalUI: true,
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
					supportedAlgorithmIDs: [-8], // EdDSA only!
				},
			}),
		],
		adapter,
		secret: authSecret,
		session: {
			maxAge: maxAge,
		},
		experimental: { enableWebAuthn: true },
		callbacks: {
			async signIn({ account, credentials, user }: { account: any; credentials?: any; user: User }) {
				const isNewUser = account?.isNewUser;
				const credentialID = credentials?.credentialID;
				if (credentialID) {
					user.authId = credentialID;
				} else {
					return false;
				}

				// For new users, handle registration logic
				if (isNewUser) {
					const regCoreId = env.REG_COREID === undefined ? true : (env.REG_COREID === 'true');

					// Only Apps with valid Core ID can sign up
					if (regCoreId && !Ican.isValid(credentialID, true)) {
						return false;
					}

					// Only verified authenticators can sign up
					if (env.VERIFIED_ONLY === 'true') {
						try {
							const authenticator = await db.authenticator.findUnique({
								where: { credentialID: credentialID },
							});

							if (authenticator?.isVerified) {
								user.isVerified = true;
							} else {
								return false;
							}
						} catch (error) {
							return false;
						}
					}
				} else {
					// Existing user sign-in logic
					if (env.VERIFIED_ONLY === 'true') {
						try {
							const authenticator = await db.authenticator.findUnique({
								where: { credentialID: credentialID },
							});

							if (!authenticator?.isVerified) {
								return false;
							} else if (authenticator?.isVerified && Number(env.VERIFIED_EXPIRATION_DAYS) > 0) {
								const verificationDate = new Date(authenticator.receivedDate);
								const currentDate = new Date();
								const expirationDate = new Date(verificationDate);
								expirationDate.setDate(verificationDate.getDate() + Number(env.VERIFIED_EXPIRATION_DAYS));

								if (currentDate <= expirationDate) {
									user.isVerified = true;
								} else {
									return false;
								}
							}
						} catch (error) {
							return false;
						}
					}
				}

				return true;
			},

			async session({ session, user }: { session: Session; user: User }) {
				session.user.authId = user.authId;
				session.user.isVerified = user.isVerified;
				return session;
			},
		},
	} satisfies SvelteKitAuthConfig;
});

export const { handle, signIn, signOut } = auth;
