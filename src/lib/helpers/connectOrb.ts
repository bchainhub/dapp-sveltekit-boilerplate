/**
 * Saves the user-defined database URL in localStorage.
 * @param url - The database URL to be saved.
 */
export const saveOrbUrl = (url: string): void => {
	if (url) {
		// Save the database URL in localStorage
		localStorage.setItem('orbUrl', url);
	}
};

/**
 * Loads the user-defined database URL from localStorage.
 * @returns The saved database URL or null if not found.
 */
export const loadOrbUrl = (): string | null => {
	// Retrieve the database URL from localStorage
	return localStorage.getItem('orbUrl');
};

/**
 * Removes the user-defined database URL from localStorage.
 */
export const removeOrbUrl = (): void => {
	// Remove the database URL from localStorage
	localStorage.removeItem('orbUrl');
};
