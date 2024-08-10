<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Icon } from '$lib/components';
	import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-svelte';

	export let title: string = 'Menu';
	export let items: MenuItem[] = [];
	export let open: boolean = false;
	export let position: 'left' | 'right' = 'left';
	export let isSmall: boolean = false;
	export let iconExternal: boolean = true;

	let dropdownRef: HTMLDivElement | null = null;

	const handleItemClick = (item: MenuItem, event: Event) => {
		if (item.action) {
			item.action();
			open = false;
		} else if (item.href) {
			// Allow default anchor behavior
			return;
		}
		event.preventDefault();
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			open = false;
		}
	};

	const handleToggle = () => {
		open = !open;
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', handleClickOutside, true);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			document.removeEventListener('click', handleClickOutside, true);
		}
	});
</script>

<div class={`relative inline-block ${isSmall ? 'w-full' : 'text-left'}`} bind:this={dropdownRef}>
	<div>
		<button type="button" class="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" on:click={handleToggle}>
			{title}
			{#if open}
				<ChevronUp class="ml-2 h-5 w-5" />
			{:else}
				<ChevronDown class="ml-2 h-5 w-5" />
			{/if}
		</button>
	</div>

	{#if open}
		<div class={`origin-top-${position} absolute ${position}-0 mt-2 ${isSmall ? 'w-full' : 'w-56'} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}>
			<div class="py-1">
				{#each items as item (item.label)}
					<a href={item.href || '#'} target={item.target || '_self'} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center" on:click={(e) => handleItemClick(item, e)}>
						{#if item.icon}
							<Icon name={item.icon} className="h-4 w-4 mr-1.5" />
						{/if}
						{item.label}
						{#if item.href && (typeof iconExternal === 'undefined' || iconExternal === true)}
							<ArrowUpRight class="ml-1 h-4 w-4" />
						{/if}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>
