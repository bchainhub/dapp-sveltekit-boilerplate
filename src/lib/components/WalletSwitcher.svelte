<script lang="ts">
	import { onMount } from 'svelte';
	import { walletsList, connectWallet } from '$lib/helpers/wallet';

	export let isOpen: boolean;
	export let onClose: () => void;
	let availableWallets: string[] = [];

	onMount(() => {
		(async () => {
			availableWallets = await walletsList();
		})();
	});

	async function handleWalletSwitch(wallet: string) {
		await connectWallet(wallet);
		onClose();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if isOpen}
	<div class="overlay" aria-hidden="true" on:click={onClose}>
		<dialog class="wallet-dialog" open role="dialog" aria-modal="true" on:keydown={handleKeyDown}>
			<section class="wallet-switcher" on:click|stopPropagation>
				<h2>Select a Wallet</h2>
				<ul>
					{#each availableWallets as wallet}
						<li>
							<button type="button" on:click={() => handleWalletSwitch(wallet)}>{wallet}</button>
						</li>
					{/each}
				</ul>
				<button type="button" on:click={onClose}>Cancel</button>
			</section>
		</dialog>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.wallet-dialog {
		border: none;
		padding: 0;
	}
	.wallet-switcher {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		width: 300px;
	}
	button {
		margin: 0.5rem 0;
		background-color: #007bff;
		color: white;
		padding: 0.5rem;
		border: none;
		cursor: pointer;
		width: 100%;
	}
	button:hover {
		background-color: #0056b3;
	}
</style>
