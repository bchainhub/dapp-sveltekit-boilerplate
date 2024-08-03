import { SvelteKitAuth } from "@auth/sveltekit";
import Passkey from "@auth/sveltekit/providers/passkey";
import { D1Adapter } from "@auth/d1-adapter";
import { v7 as uuidv7 } from 'uuid';
import { generateToken } from '$lib/helpers/jwt';
import { env } from '$env/dynamic/private';
import { genv } from '$lib/helpers/genv';
import type { Session as AuthSession, User as AuthUser } from "@auth/core/types";

interface User extends AuthUser {
	coreId?: string;
	isActive?: boolean;
	isVerified?: boolean;
}

interface Session extends AuthSession {
	user: User;
}

export const { handle, signIn, signOut } = SvelteKitAuth(async (platform, locals) => {
	const d1Namespace = genv(platform).D1_NAMESPACE;
	const authSecret = genv(platform).AUTH_SECRET as string;
	const maxAge = genv(platform).LOGIN_MAX_AGE || 604800; // 1 week
	const bareUrl = locals.config.url.replace(/(^\w+:|^)\/\//, '');
	const passkeyDuration = Number(env.PASSKEY_DURATION);
	const finalPasskeyDuration = isNaN(passkeyDuration) ? 60000 : (passkeyDuration * 1000);

	const authOptions = {
		providers: [
			Passkey({
				id: `corepass/${bareUrl}`,
				name: 'CorePass',
				relayingParty: {
					id: bareUrl,
					name: locals.config.title,
					origin: locals.config.url,
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
					//attestation: "indirect",
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
