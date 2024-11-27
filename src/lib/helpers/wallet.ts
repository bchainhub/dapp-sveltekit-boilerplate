import { writable } from 'svelte/store';

// Svelte stores for wallet state
export const walletConnected = writable(false);
export const walletType = writable<string | null>(null);
export const walletAddress = writable<string | null>(null);

// Automatically login and connect wallet
export async function autoLogin() {
	await connectWallet();
}

// Connect to CorePass wallet
export async function connectWallet() {
	try {
		// Check if CorePass is available
		if (typeof window.corepass !== "undefined") {

			// Request account access from CorePass
			const accounts = await window.corepass.request({ method: "xcb_requestAccounts" });

			if (accounts && accounts.length > 0) {
				// Set the wallet details in stores
				walletType.set("CorePass");
				walletAddress.set(accounts[0]);
				walletConnected.set(true);
			} else {
				throw new Error("No accounts found.");
			}
		}
	} catch (error) {
		console.error("CorePass connection failed:", error);
	}
}

// Disconnect the current wallet
export function disconnectWallet() {
	walletConnected.set(false);
	walletType.set(null);
	walletAddress.set(null);
}
