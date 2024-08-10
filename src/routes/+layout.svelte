<script lang="ts">
	import "../css/app.css";
	import { Header, Footer } from '$lib/components';
	import { config } from '../site.config';
	const { title, themeConfig: { metadata, navbar, footer }, favicon } = config;
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

<div class={`view ${(navbar && navbar.orientation === 'vertical') ? 'vertical-max-w flex flex-col md:flex-row md:mx-auto md:container' : 'flex flex-col'}`}>
	{#if navbar}
		<div class={`header-wrapper ${(navbar && navbar.orientation === 'vertical') ? 'md:flex-shrink-0 md:h-auto max-md:contents' : 'contents'}`}>
			<Header />
		</div>
	{/if}
	<main class={`container flex-1 mx-auto p-4 ${(navbar && navbar.orientation === 'vertical') ? '' : 'pt-8'}`}>
		<slot />
	</main>
</div>
{#if footer}
	<Footer />
{/if}
