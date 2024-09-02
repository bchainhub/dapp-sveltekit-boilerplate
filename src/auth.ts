import { SvelteKitAuth } from "@auth/sveltekit";
import Passkey from "@auth/sveltekit/providers/passkey";
import { D1Adapter } from "@auth/d1-adapter";
//import { v7 as uuidv7 } from 'uuid';
//import { generateToken } from '$lib/helpers/jwt';
import { env } from '$env/dynamic/private';
import { genv } from '$lib/helpers/genv';
import { config } from './site.config';
import type { Session as AuthSession, User as AuthUser } from "@auth/core/types";

interface User extends AuthUser {
	coreId?: string;
	isActive?: boolean;
	isVerified?: boolean;
}

interface Session extends AuthSession {
	user: User;
}

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
	const d1Namespace = genv(event.platform).D1_NAMESPACE;
	const authSecret = genv(event.platform).AUTH_SECRET as string;
	const maxAge = genv(event.platform).LOGIN_MAX_AGE || 86400; // 24h
	const bareUrl = config.url.replace(/(^\w+:|^)\/\//, '');
	const passkeyDuration = Number(env.PASSKEY_DURATION);
	const finalPasskeyDuration = isNaN(passkeyDuration) ? 60000 : (passkeyDuration * 1000);

	const authOptions = {
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
					timeout: finalPasskeyDuration,
					userVerification: "required",
					extensions: {
						appid: bareUrl,
					},
				},
				registrationOptions: {
					//userID: `pipe-${generateToken(uuidv7())}`,
					//userName: "",
					timeout: finalPasskeyDuration,
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
		adapter: D1Adapter(d1Namespace),
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
	}
	return authOptions;
});
