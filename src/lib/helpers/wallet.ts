import WalletConnectProvider from "@walletconnect/web3-provider";
import { writable, get } from 'svelte/store';
import { env } from '$env/dynamic/private';

// Svelte stores for wallet state
export const walletConnected = writable(false);
export const walletType = writable<string | null>(null);
export const walletAddress = writable<string | null>(null);
export const availableWallets = writable<string[]>([]);

let provider: WalletConnectProvider | null = null;

// Get wallet priority from environment variables
let walletPriority: string[] = env.WALLET_PRIORITY?.split(',') ?? [];

// Helper function to extract RPC URLs from environment variables
function getRpcUrls(): Record<number, string> {
	const rpcUrls: Record<number, string> = {};
	Object.entries(env).forEach(([key, value]) => {
		if (key.startsWith('RPC_')) {
			const chainId = parseInt(key.replace('RPC_', ''), 10);
			if (!isNaN(chainId) && value) {
				rpcUrls[chainId] = value;
			}
		}
	});
	return rpcUrls;
}

// Automatically login and connect wallet
export async function autoLogin() {
	await connectWallet();
}

// Connect wallet using WalletConnect
export async function connectWallet(wallet?: string) {
	try {
		if (!provider) {
			provider = new WalletConnectProvider({
				rpc: getRpcUrls(),
				qrcodeModalOptions: {
					mobileLinks: walletPriority,
				},
			});
		}

		// Ensure qrcodeModalOptions exists before modifying it
		if (wallet && provider.qrcodeModalOptions?.mobileLinks) {
			console.log(`Attempting to connect to ${wallet}`);
			provider.qrcodeModalOptions.mobileLinks = [wallet];
		}

		await provider.enable();

		const accounts = await provider.request({ method: 'eth_accounts' });

		walletType.set('walletconnect');
		walletAddress.set(accounts[0]);
		walletConnected.set(true);
		console.log("Connected via WalletConnect:", accounts[0]);
	} catch (error) {
		console.error("WalletConnect connection failed:", error);
	}
}

// Disconnect the current wallet
export function disconnectWallet() {
	if (provider) {
		provider.disconnect();
		provider = null;
	}
	walletConnected.set(false);
	walletType.set(null);
	walletAddress.set(null);
	console.log("Wallet disconnected!");
}

// Retrieve a list of available wallets for switching
export async function walletsList() {
	if (!provider || !provider.qrcodeModalOptions?.mobileLinks) {
		return [];
	}

	const installedWallets = provider.qrcodeModalOptions.mobileLinks || [];
	const currentWallet = get(walletType);

	return installedWallets.filter(wallet => wallet !== currentWallet);
}
