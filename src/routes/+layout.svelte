<script lang="ts">
	import "../css/app.css";
	import { Header, Footer } from '$lib/components';
	import { config } from '../site.config';
	const { title, themeConfig: { metadata, navbar, footer }, favicon } = config;

	const menu = navbar?.items?.map(item => ({
		...item,
		position: item.position ?? "left"
	}));
</script>

<svelte:head>
	<title>{title}</title>
	{#if favicon}
		<link rel="icon" href={favicon} type="image/png" />
	{/if}
	{#if metadata}
		{#each metadata as { name, content, property }}
			{#if name}
				<meta name={name} content={content} />
			{/if}
			{#if property}
				<meta property={property} content={content} />
			{/if}
		{/each}
	{/if}
</svelte:head>

{#if navbar}
	<Header />
{/if}
<main class="container mx-auto p-4 flex-1">
	<slot />
</main>
{#if footer}
	<Footer />
{/if}
