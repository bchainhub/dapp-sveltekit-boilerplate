import { env } from '$env/dynamic/private';

/**
 * Checks if a user's `coreId` is verified and if the verification is still valid.
 *
 * The function queries an external verification oracle to check the verification status.
 * It compares the verification date with the current date and considers the expiration period
 * defined by the `VERIFIED_EXPIRATION_DAYS` environment variable.
 *
 * @param {string} coreId - The unique identifier of the user whose verification status is to be checked.
 * @returns {Promise<boolean>} - Returns `true` if the user is verified and their verification is still valid, otherwise `false`.
 */
export async function verified(coreId: string): Promise<boolean> {
	// Check if the verification oracle is configured
	if (!env.VERIFICATION_ORACLE) {
		return false;
	}

	// Fetch verification data from the oracle
	try {
		const response = await fetch(env.VERIFICATION_ORACLE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ coreId: coreId }),
		});

		// Parse the response JSON
		const verifiedData: { verified?: boolean; [key: string]: any } = await response.json();

		// Check if the status code is OK and the user is verified
		if (response.status === 200 && verifiedData.verified) {
			// If expiration days are configured, check the expiration date
			if (Number(env.VERIFIED_EXPIRATION_DAYS) > 0) {
				const verificationDate = new Date(verifiedData.date);
				const currentDate = new Date();

				// Calculate the expiration date
				let expirationDate = new Date(verificationDate);
				expirationDate.setDate(verificationDate.getDate() + Number(env.VERIFIED_EXPIRATION_DAYS));

				// Return true if the current date is before or equal to the expiration date
				return currentDate <= expirationDate;
			}

			// Return true as the user is verified if no expiration days are set
			return true;
		}

		// Return false if not verified or the status code is not 200
		return false;
	} catch (error) {
		console.error('Error fetching verification data:', error);
		return false;
	}
}
