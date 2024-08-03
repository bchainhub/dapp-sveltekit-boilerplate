import { json } from '@sveltejs/kit';
import { genv } from '$lib/helpers/genv';
import { verifyRegistrationResponse } from '@simplewebauthn/server';

export async function POST({ request, locals }) {
	const { body } = await request.json();
	const user = locals.user; // Assume user is added to locals via some auth middleware
	const expectedChallenge = locals.session.challenge;

	try {
		const verification = await verifyRegistrationResponse({
			credential: body,
			expectedChallenge,
			expectedOrigin: 'https://your-app.com',
			expectedRPID: 'your-app.com',
			requireUserVerification: true,
		});

		if (verification.verified) {
			const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

			// Save the new credential in your D1 database
			await locals.db.prepare(`INSERT INTO Authenticators (id, publicKey, counter, userId) VALUES (?, ?, ?, ?)`)
				.bind(credentialID, credentialPublicKey, counter, user.id)
				.run();

			return json({ verified: true });
		} else {
			return json({ verified: false }, { status: 400 });
		}
	} catch (error) {
		console.error(error);
		return json({ verified: false, error: error.message }, { status: 400 });
	}
}
