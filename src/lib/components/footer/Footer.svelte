<script lang="ts">
	import { config } from '../../../site.config';
	import { ArrowUpRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { isWeb4Connected, isPublicEnableWeb4 } from '../../helpers/web4';

	const { style, logo, copyright, liner, iconExternal } = config?.themeConfig?.footer || {};
	const footerClass = style && `footer-${style}`;

	let connectionStatus: boolean = false;
	let connectionStatusWeb4: boolean = isWeb4Connected();
	let publicEnableWeb4: boolean = isPublicEnableWeb4();

	onMount(() => {
		const updateConnectionStatus = () => {
			connectionStatus = navigator.onLine ? true : false;
		};

		updateConnectionStatus();

		window.addEventListener('online', updateConnectionStatus);
		window.addEventListener('offline', updateConnectionStatus);

		return () => {
			window.removeEventListener('online', updateConnectionStatus);
			window.removeEventListener('offline', updateConnectionStatus);
		};
	});
</script>

<footer class={`footer ${footerClass}`}>
	<div class="container mx-auto p-4 pt-8">
		<hr class="my-5" />
		<div class="flex flex-col md:flex-row gap-4 items-center mb-2">
			{#if logo}
				<a href="/" class="flex items-center mb-4 md:mb-0">
					<img src={logo.src} alt={logo.alt} class="h-10" />
				</a>
			{:else if config?.title}
				<a href="/" class="flex items-center mb-4 md:mb-0">
					<h1 class="text-xl font-bold">{config.title}</h1>
				</a>
			{/if}
			<div class="text-center text-sm text-footer-link mt-4 md:mt-0">
				{copyright}
			</div>
			{#if liner}
				<div class="flex flex-wrap justify-center text-sm md:justify-start gap-4 mt-4 md:mt-0 md:ml-4">
					{#each liner as { label, to, href, target }}
						<div class="flex items-center">
							{#if to}
								<a href={to} class="hover:text-footer-link-hover">
									{label}
								</a>
							{:else if href}
								<a href={href} target={target ? target : undefined} rel={target ? 'noopener noreferrer' : undefined} class="hover:text-footer-link-hover flex items-center">
									{label}
									{#if typeof iconExternal === 'undefined' || iconExternal === true}
										<ArrowUpRight class="h-4 w-4" />
									{/if}
								</a>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
			<div class="mt-4 md:mt-0 md:ml-auto flex items-center gap-4">
				<div class="flex items-center gap-2">
					<span class="status-dot inline-block w-1.5 h-1.5 rounded-full {connectionStatus ? 'connected' : ''}"></span>
					<p class="text-sm text-footer-link">{connectionStatus ? 'Online' : 'Offline'}</p>
				</div>
				{#if publicEnableWeb4}
					<div class="flex items-center gap-2">
						<span class="status-dot-web4 inline-block w-1.5 h-1.5 rounded-full {connectionStatusWeb4 ? 'connected' : ''}"></span>
						<p class="text-sm text-footer-link">{connectionStatusWeb4 ? 'Web4 On' : 'Web4 Off'}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</footer>
