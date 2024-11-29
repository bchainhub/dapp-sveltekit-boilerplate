import { writable } from 'svelte/store';
import { toast } from '$lib/components';

// Svelte stores for wallet state
export const walletConnected = writable(false);
export const walletType = writable<string | null>(null);
export const walletAddress = writable<string | null>(null);

// Automatically login and connect wallet
export async function autoLogin() {
	await connectWallet(false);
}

// Connect to CorePass wallet
export async function connectWallet(automessage: boolean = true) {
	// Check if CorePass is available
	if (typeof window.corepass !== "undefined") {
		try {
				// Request account access from CorePass
				const accounts = await window.corepass.request({ method: "xcb_requestAccounts" });

				if (accounts && accounts.length > 0) {
					// Set the wallet details in stores
					walletType.set("CorePass");
					walletAddress.set(accounts[0]);
					walletConnected.set(true);
				} else {
					toast({
						message: 'CorePass Extension is not configured.',
						type: 'warning'
					});
					throw new Error("No accounts found.");
				}
		} catch (error) {
			console.error("CorePass connection failed:", error);
			toast({
				message: 'Cannot connect CorePass Extension.',
				type: 'warning'
			});
		}
	} else if (automessage) {
		toast({
			message: 'CorePass Extension is not installed or enabled.',
			type: 'warning'
		});
	}
}

// Disconnect the current wallet
export function disconnectWallet() {
	walletConnected.set(false);
	walletType.set(null);
	walletAddress.set(null);
	toast({
		message: 'CorePass disconnected.',
		type: 'success'
	});
}
