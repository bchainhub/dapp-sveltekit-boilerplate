import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import WebAuthn from "@auth/core/providers/webauthn";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { env } from '$env/dynamic/private';
import { getDatabaseInstance } from '$lib/helpers/db';
import { verified } from '$lib/helpers/verification';
import { config } from './site.config';
import Ican from '@blockchainhub/ican';

const auth = SvelteKitAuth(async (event) => {
	const db = await getDatabaseInstance(event);
	if (!db) throw new Error('Database instance not found. Authentication cannot proceed.');

	const authSecret = env.AUTH_SECRET as string;
	const maxAge = Number(env.LOGIN_MAX_AGE) || 86400; // Default to 24 hours
	const bareUrl = config.url.replace(/(^\w+:|^)\/\//, '');
	const passkeyDuration = Number(env.PASSKEY_DURATION) || 120000; // 2 minutes

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
		adapter: DrizzleAdapter(db),
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
				const regCoreId = env.REG_COREID === undefined ? true : (env.REG_COREID === 'true');

				// For new users, handle registration logic
				if (isNewUser) {
					// Only Apps with valid Core ID can sign up
					if (regCoreId && !Ican.isValid(credentialID, true)) {
						return false;
					}

					// Only verified Core ID can sign up
					if (regCoreId && env.VERIFIED_ONLY === 'true') {
						const verif = await verified(credentialID);
						if (!verif) {
							return false;
						}
					}
				} else {
					// Existing user sign-in logic
					// Only verified Core ID can sign in
					if (regCoreId && Ican.isValid(credentialID, true) && env.VERIFIED_ONLY === 'true') {
						const verif = await verified(credentialID);
						if (verif) {
							user.isVerified = true;
						} else {
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
