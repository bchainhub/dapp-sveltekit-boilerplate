<script lang="ts" context="module">
	export function toastType(type: string): string {
		return {
			success: 'bg-green-500',
			error: 'bg-red-500',
			info: 'bg-blue-500',
			warning: 'bg-yellow-500'
		}[type] || 'bg-gray-800';
	}
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { toasts } from './toastStore';

	let timeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();

	function handleMouseEnter(id: string) {
		if (timeouts.has(id)) {
			clearTimeout(timeouts.get(id));
			timeouts.delete(id);
		}
	}

	function handleMouseLeave(id: string, duration: number) {
		timeouts.set(
			id,
			setTimeout(() => {
				toasts.update((current) => current.filter((toast) => toast.id !== id));
			}, duration)
		);
	}

	function closeToast(id: string) {
		toasts.update((current) => current.filter((toast) => toast.id !== id));
		if (timeouts.has(id)) {
			clearTimeout(timeouts.get(id));
			timeouts.delete(id);
		}
	}
</script>

<div class="fixed bottom-4 right-4 space-y-2 z-20">
	{#each $toasts as { id, message, type = 'info', duration = 3000, className } (id)}
		<div
			in:fade
			out:fade
			role="alert"
			class={`toast p-4 rounded-lg shadow-lg text-zinc-700 font-medium text-sm w-72 ${toastType(type)} ${className}`}
			on:mouseenter={() => handleMouseEnter(id)}
			on:mouseleave={() => handleMouseLeave(id, duration)}
		>
			<div class="flex justify-between items-center">
				<span>{message}</span>
				<button
					class="ml-2 bg-transparent"
					on:click={() => closeToast(id)}
					aria-label="Close"
				>
					&times;
				</button>
			</div>
		</div>
	{/each}
</div>
