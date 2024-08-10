<script lang="ts">
	import { config } from '../../site.config';
	import { ArrowUpRight } from 'lucide-svelte';
	import { Icon } from '$lib/components';
	const { style, logo, links, copyright, liner, iconExternal } = config?.themeConfig?.footer || {};
	const footerClass = style && `footer-${style}`;
</script>

<footer class={`footer ${footerClass}`}>
	<div class="container mx-auto p-4 pt-8">
		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 text-center md:text-left">
			{#if links}
				{#each links as { title, items }}
					<div>
						<h4 class="font-bold mb-2">{title}</h4>
						<ul class="space-y-1">
							{#each items as { label, to, href, target, icon }}
								<li>
									{#if to}
										<a href={to} class="hover:text-footer-link-hover flex justify-center md:justify-start items-center">
											{#if icon}
												<Icon name={icon} className="h-4 w-4 mr-1.5" />
											{/if}
											{label}
										</a>
									{:else if href}
										<a href={href} target={target ? target : undefined} rel={target ? 'noopener noreferrer' : undefined} class="hover:text-footer-link-hover flex justify-center md:justify-start items-center">
											{#if icon}
												<Icon name={icon} className="h-4 w-4 mr-1.5" />
											{/if}
											{label}
											{#if typeof iconExternal === 'undefined' || iconExternal === true}
												<ArrowUpRight class="ml-1 h-4 w-4 inline-block align-middle" />
											{/if}
										</a>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			{/if}
		</div>
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
		</div>
	</div>
</footer>
