import WalletConnectProvider from "@walletconnect/web3-provider";
import { env } from '$env/dynamic/private';

let provider: WalletConnectProvider | null = null;

function getRpcUrls(): Record<number, string> {
	const rpcUrls: Record<number, string> = {};
	Object.entries(env).forEach(([key, value]) => {
		if (key.startsWith('RPC_')) {
			const chainId = parseInt(key.replace('RPC_', ''), 10);
			if (!isNaN(chainId)) {
				rpcUrls[chainId] = value;
			}
		}
	});
	return rpcUrls;
}

export async function connectWalletServer(wallet?: string): Promise<{ accounts: string[]; type: string }> {
	if (!provider) {
		provider = new WalletConnectProvider({
			rpc: getRpcUrls(),
			qrcodeModalOptions: {
				mobileLinks: env.WALLET_PRIORITY?.split(',') ?? [],
			},
		});
	}

	if (wallet && provider.qrcodeModalOptions?.mobileLinks) {
		provider.qrcodeModalOptions.mobileLinks = [wallet];
	}

	await provider.enable();

	const accounts = await provider.request({ method: 'eth_accounts' });
	return { accounts, type: 'walletconnect' };
}

export function disconnectWalletServer() {
	if (provider) {
		provider.disconnect();
		provider = null;
	}
}
