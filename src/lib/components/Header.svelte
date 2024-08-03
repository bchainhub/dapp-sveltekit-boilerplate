<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ArrowUpRight, Menu, Moon, Sun } from 'lucide-svelte';
	import { config } from '../../site.config';
	import { ActionsDropdown } from '$lib/components';
	import { page } from "$app/stores";
	import { SignIn, SignOut } from "@auth/sveltekit/components";

	const { logo, items = [], hideOnScroll } = config?.themeConfig?.navbar || {};
	const { disableSwitch, defaultMode, respectPrefersColorScheme } = config?.themeConfig?.colorMode || {};

	let isOpen = false;
	let isDarkMode = false;
	let lastScrollTop = 0;
	let isNavHidden = false;
	let dropdownOpen = false;

	const menuItems = [
		...(config?.themeConfig?.navbar?.authItems ?? []),
		{ label: 'Logout', action: () => SignOut }
	];

	const handleSelect = (event: CustomEvent<{ label: string; action: () => void; }>) => {
		console.log(`Selected item: ${event.detail.label}`);
		event.detail.action();
	};

	const toggleMenu = () => {
		isOpen = !isOpen;
		if (isOpen && typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const toggleDarkMode = () => {
		isDarkMode = !isDarkMode;
		if (typeof window !== 'undefined') {
			document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
			localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
		}
	};

	const handleScroll = () => {
		if (typeof window !== 'undefined') {
			const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
			if (hideOnScroll) {
				isNavHidden = currentScrollTop > lastScrollTop;
			}
			lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
		}
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			if (respectPrefersColorScheme) {
				isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
			} else {
				const storedTheme = localStorage.getItem('theme');
				isDarkMode = storedTheme ? storedTheme === 'dark' : defaultMode === 'dark';
			}
			document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

			if (hideOnScroll) {
				window.addEventListener('scroll', handleScroll);
			}
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && hideOnScroll) {
			window.removeEventListener('scroll', handleScroll);
		}
	});
</script>

<header class:nav-hidden={isNavHidden} class="sticky top-0 text-navbar-link shadow-navbar">
	<div class="container mx-auto flex items-center justify-between p-4">
		<div class="flex items-center space-x-4">
			{#if logo}
				<a href="/" class="flex items-center space-x-2 mr-4">
					<img src={logo.src} alt={logo.alt} class="h-10" />
				</a>
			{:else if config?.title}
				<a href="/" class="flex items-center space-x-2 mr-4">
					<h1 class="text-xl font-bold">{config.title}</h1>
				</a>
			{/if}
			{#if !disableSwitch}
				<div class="md:hidden block">
					<button on:click={toggleDarkMode} class="focus:outline-none flex items-center">
						{#if isDarkMode}
							<Sun class="w-6 h-6 text-yellow-500" />
						{:else}
							<Moon class="w-6 h-6 text-gray-500" />
						{/if}
					</button>
				</div>
			{/if}
		</div>
		<button class="md:hidden block" on:click={toggleMenu}>
			<Menu class="w-8 h-8" />
		</button>
		<nav class="hidden md:flex flex-1 items-center justify-between">
			<ul class="flex items-center space-x-4">
				{#each items as { label, to, href, target, position }}
					{#if position !== 'right'}
						<li class="flex items-center">
							{#if to}
								<a href={to}>{label}</a>
							{:else if href}
								<a href={href} target={target ? target : undefined} rel={target ? 'noopener noreferrer' : undefined} class="flex items-center">
									{label}
									<ArrowUpRight class="ml-1 h-4 w-4" />
								</a>
							{/if}
						</li>
					{/if}
				{/each}
			</ul>
			<ul class="flex items-center space-x-4 ml-auto">
				{#each items as { label, to, href, target, position }}
					{#if position === 'right'}
						<li class="flex items-center">
							{#if to}
								<a href={to}>{label}</a>
							{:else if href}
								<a href={href} target={target ? target : undefined} rel={target ? 'noopener noreferrer' : undefined} class="flex items-center">
									{label}
									<ArrowUpRight class="ml-1 h-4 w-4" />
								</a>
							{/if}
						</li>
					{/if}
				{/each}
				{#if !disableSwitch}
					<li class="hidden md:flex items-center">
						<button on:click={toggleDarkMode} class="focus:outline-none flex items-center">
							{#if isDarkMode}
								<Sun class="w-6 h-6 text-yellow-500" />
							{:else}
								<Moon class="w-6 h-6 text-gray-500" />
							{/if}
						</button>
					</li>
				{/if}
				{#if $page.data.session}
					<li class="flex items-center">
						<ActionsDropdown
							title={$page.data.session.user?.name ?? "User"}
							bind:open={dropdownOpen}
							items={menuItems}
							position="right"
							on:select={handleSelect} />
					</li>
				{:else}
					<li class="flex items-center">
						<SignIn action="register">
							<div slot="submitButton">Register</div>
						</SignIn>
					</li>
					<li class="flex items-center">
						<SignIn>
							<div slot="submitButton">CorePass Login</div>
						</SignIn>
					</li>
				{/if}
			</ul>
		</nav>
	</div>

	{#if isOpen}
		<nav class="md:hidden block">
			<ul class="flex flex-col space-y-4 p-4">
				{#each items as { label, to, href, target }}
					<li>
						{#if to}
							<a href={to} class="block">{label}</a>
						{:else if href}
							<a href={href} target={target ? target : undefined} rel={target ? 'noopener noreferrer' : undefined} class="flex items-center">
								{label}
								<ArrowUpRight class="ml-1 h-4 w-4" />
							</a>
						{/if}
					</li>
				{/each}
				{#if $page.data.session}
					<ActionsDropdown
						title={$page.data.session.user?.name ?? "User"}
						bind:open={dropdownOpen}
						items={menuItems}
						position="left"
						isSmall={true}
						on:select={handleSelect} />
				{:else}
					<li>
						<SignIn action="register">
							<div slot="submitButton">Register</div>
						</SignIn>
					</li>
					<li>
						<SignIn>
							<div slot="submitButton">CorePass Login</div>
						</SignIn>
					</li>
				{/if}
			</ul>
		</nav>
	{/if}
</header>
