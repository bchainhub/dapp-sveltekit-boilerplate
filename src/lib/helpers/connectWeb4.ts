/**
 * Saves the user-defined database URL in localStorage.
 * @param url - The database URL to be saved.
 */
export const saveWeb4Loc = (url: string): void => {
	if (url) {
		// Save the database URL in localStorage
		localStorage.setItem('web4Loc', url);
	}
};

/**
 * Loads the user-defined database URL from localStorage.
 * @returns The saved database URL or null if not found.
 */
export const loadWeb4Loc = (): string | null => {
	// Retrieve the database URL from localStorage
	return localStorage.getItem('web4Loc');
};

/**
 * Removes the user-defined database URL from localStorage.
 */
export const removeWeb4Loc = (): void => {
	// Remove the database URL from localStorage
	localStorage.removeItem('web4Loc');
};
