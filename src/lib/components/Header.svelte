<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ArrowUpRight, Haze, Menu, Moon, Sun } from 'lucide-svelte';
	import { Icon } from '$lib/components';
	import { config } from '../../site.config';
	import { ActionsDropdown } from '$lib/components';
	import { page } from "$app/stores";
	import { SignIn, SignOut } from "@auth/sveltekit/components";

	const { logo, items = [], hideOnScroll, orientation = 'horizontal', style = 'auto', iconExternal } = config?.themeConfig?.navbar || {};
	const { disableSwitch, defaultMode, respectPrefersColorScheme } = config?.themeConfig?.colorMode || {};

	let isOpen = false;
	let lastScrollTop = 0;
	let isNavHidden = false;
	let dropdownOpen = false;
	let theme = respectPrefersColorScheme ? 'system' : defaultMode;

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
	};

	const closeMenu = () => {
		isOpen = false;
	};

	const handleClickOutside = (event: MouseEvent) => {
		const menuElement = document.getElementById('dropdown-menu');
		const hamburgerButton = document.getElementById('hamburger-button');
		if (
			menuElement && !menuElement.contains(event.target as Node) &&
			hamburgerButton && !hamburgerButton.contains(event.target as Node)
		) {
			closeMenu();
		}
	};

	const rotateTheme = () => {
		let prefersDark = defaultMode;
		if (typeof window !== 'undefined') {
			prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		if (!respectPrefersColorScheme) {
			switch (theme) {
				case 'light':
					theme = 'dark';
					break;
				case 'dark':
					theme = 'light';
					break;
				default:
					theme = defaultMode === 'dark' ? 'dark' : 'light';
			}
		} else {
			switch (theme) {
				case 'system':
					theme = prefersDark ? 'light' : 'dark';
					break;
				case 'light':
					theme = 'dark';
					break;
				case 'dark':
					theme = 'system';
					break;
				default:
					theme = 'system';
			}
		}

		applyTheme();
	};

	const applyTheme = () => {
		if (typeof window !== 'undefined') {
			if (theme === 'system' && respectPrefersColorScheme) {
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
			} else {
				document.documentElement.setAttribute('data-theme', theme);
			}
			localStorage.setItem('theme', theme);
		} else {
			localStorage.setItem('theme', theme);
		}
	};

	const handleScroll = () => {
		if (typeof window !== 'undefined') {
			const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
			if (isOpen) {
				closeMenu();
			}
			if (hideOnScroll) {
				isNavHidden = currentScrollTop > lastScrollTop;
				if (currentScrollTop === 0) {
					isNavHidden = false;
				}
			}
			lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
		}
	};

	onMount(() => {
		const storedTheme = localStorage.getItem('theme') || (respectPrefersColorScheme ? 'system' : defaultMode);
		theme = storedTheme;
		applyTheme();

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', handleScroll);
			document.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<header class:nav-hidden={isNavHidden} class={`sticky top-0 text-navbar-link ${style === 'transparent' ? 'transparent' : 'shadow-navbar'} ${(orientation === 'vertical') ? 'vertical md:mr-4' : 'horizontal'}`}>
	<div class={`flex justify-between p-4 md:container md:mx-auto ${(orientation === 'vertical') ? 'flex-row md:flex-col' : ''}`}>
		<div class={`flex items-center space-x-4 ${(orientation === 'vertical') ? 'flex-grow' : ''}`}>
			{#if logo}
				<a href="/" class={`flex justify-center md:mr-8 ${(orientation === 'vertical') ? 'space-y-2 md:mb-8' : 'space-x-2'}`}>
					<img src={logo.src} alt={logo.alt} class="h-10" />
				</a>
			{:else if config?.title}
				<a href="/" class={`flex justify-center md:mr-8 ${(orientation === 'vertical') ? 'space-y-2 md:mb-8' : 'space-x-2'}`}>
					<h1 class="text-2xl font-bold">{config.title}</h1>
				</a>
			{/if}
			{#if !disableSwitch}
				<button on:click={rotateTheme} class="focus:outline-none flex items-center md:hidden">
					{#if theme === 'system'}
						<Haze class="w-6 h-6 text-gray-500" />
					{:else if theme === 'dark'}
						<Moon class="w-6 h-6 text-gray-500" />
					{:else}
						<Sun class="w-6 h-6 text-yellow-500" />
					{/if}
				</button>
			{/if}
		</div>
		<div class="md:hidden flex items-center">
			<button id="hamburger-button" class="cursor-context-menu focus:outline-none flex items-center" on:click={toggleMenu}>
				<Menu class="w-8 h-8" />
			</button>
		</div>
		{#if orientation === 'vertical'}
			<nav class="hidden md:block">
				<ul class="flex flex-col space-y-1">
					{#each items as { label, to, href, target, icon }}
						<li>
							{#if to}
								<a href={to} class="flex items-center block p-2">
									{#if icon}
										<Icon name={icon} className="h-5 w-5 mr-1.5" />
									{/if}
									{label}
								</a>
							{:else if href}
								<a href={href} target={target ? target : undefined} rel={target ? 'noopener noreferrer' : undefined} class="flex items-center p-2">
									{#if icon}
										<Icon name={icon} className="h-5 w-5 mr-1.5" />
									{/if}
									{label}
									{#if typeof iconExternal === 'undefined' || iconExternal === true}
										<ArrowUpRight class="ml-1 h-4 w-4" />
									{/if}
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
							iconExternal={iconExternal}
							on:select={handleSelect} />
					{:else}
						<li>
							<SignIn action="register" className="block vertical-menu left p-2">
								<div slot="submitButton">Register</div>
							</SignIn>
						</li>
						<li>
							<SignIn className="block vertical-menu left p-2">
								<div slot="submitButton" class="flex items-center whitespace-nowrap">
									<Icon name="corepass" className="w-5 h-5 mr-1.5" color="#1066df" />
									CorePass SignIn
								</div>
							</SignIn>
						</li>
					{/if}
					<li class="hidden md:flex items-center">
						<button on:click={rotateTheme} class="menu-button focus:outline-none flex items-center p-2">
							{#if theme === 'system'}
								<Haze class="w-6 h-6 mr-1.5 text-gray-500" />System theme
							{:else if theme === 'dark'}
								<Moon class="w-6 h-6 mr-1.5 text-gray-500" />Dark theme
							{:else}
								<Sun class="w-6 h-6 mr-1.5 text-yellow-500" />Light theme
							{/if}
						</button>
					</li>
				</ul>
			</nav>
		{:else}
			<nav class="hidden md:flex flex-1 items-center justify-between">
				<ul class="flex items-center space-x-4">
					{#each items as { label, to, href, target, position, icon }}
						{#if position !== 'right'}
							<li class="flex items-center">
								{#if to}
									<a href={to} class="flex items-center">
										{#if icon}
											<Icon name={icon} className="h-5 w-5 mr-1.5" />
										{/if}
										{label}
									</a>
								{:else if href}
									<a href={href} target={target ? target : undefined} rel={target ? 'noopener noreferrer' : undefined} class="flex items-center">
										{#if icon}
											<Icon name={icon} className="h-5 w-5 mr-1.5" />
										{/if}
										{label}
										{#if typeof iconExternal === 'undefined' || iconExternal === true}
											<ArrowUpRight class="ml-1 h-4 w-4" />
										{/if}
									</a>
								{/if}
							</li>
						{/if}
					{/each}
				</ul>
				<ul class="flex items-center space-x-4 ml-auto">
					{#each items as { label, to, href, target, position, icon }}
						{#if position === 'right'}
							<li class="flex items-center">
								{#if to}
									<a href={to} class="flex items-center">
										{#if icon}
											<Icon name={icon} className="h-5 w-5 mr-1.5" />
										{/if}
										{label}
									</a>
								{:else if href}
									<a href={href} target={target ? target : undefined} rel={target ? 'noopener noreferrer' : undefined} class="flex items-center">
										{#if icon}
											<Icon name={icon} className="h-5 w-5 mr-1.5" />
										{/if}
										{label}
										{#if typeof iconExternal === 'undefined' || iconExternal === true}
											<ArrowUpRight class="ml-1 h-4 w-4" />
										{/if}
									</a>
								{/if}
							</li>
						{/if}
					{/each}
					{#if !disableSwitch}
						<button on:click={rotateTheme} class="menu-button focus:outline-none flex items-center p-2">
							{#if theme === 'system'}
								<Haze class="w-6 h-6 text-gray-500" />
							{:else if theme === 'dark'}
								<Moon class="w-6 h-6 text-gray-500" />
							{:else}
								<Sun class="w-6 h-6 text-yellow-500" />
							{/if}
						</button>
					{/if}
					{#if $page.data.session}
						<li class="flex items-center">
							<ActionsDropdown
								title={$page.data.session.user?.name ?? "User"}
								bind:open={dropdownOpen}
								items={menuItems}
								position="right"
								iconExternal={iconExternal}
								on:select={handleSelect} />
						</li>
					{:else}
						<li class="flex items-center">
							<SignIn action="register" className="block horizontal-menu">
								<div slot="submitButton">Register</div>
							</SignIn>
						</li>
						<li class="flex items-center">
							<SignIn className="block horizontal-menu neon">
								<div slot="submitButton" class="flex items-center whitespace-nowrap">
									<Icon name="corepass" className="w-5 h-5 mr-1.5" color="#1066df" />
									CorePass SignIn
								</div>
							</SignIn>
						</li>
					{/if}
				</ul>
			</nav>
		{/if}
	</div>

	{#if isOpen}
		<nav id="dropdown-menu" class="absolute top-full left-0 w-full max-h-[calc(100vh-4rem)] h-auto overflow-y-auto shadow-md z-50 md:hidden">
			<ul class="flex flex-col space-y-4 p-4">
				{#each items as { label, to, href, target, icon }}
					<li>
						{#if to}
							<a href={to} class="block flex items-center">
								{#if icon}
									<Icon name={icon} className="h-5 w-5 mr-1.5" />
								{/if}
								{label}
							</a>
						{:else if href}
							<a href={href} target={target ? target : undefined} rel={target ? 'noopener noreferrer' : undefined} class="flex items-center">
								{#if icon}
									<Icon name={icon} className="h-5 w-5 mr-1.5" />
								{/if}
								{label}
								{#if typeof iconExternal === 'undefined' || iconExternal === true}
									<ArrowUpRight class="ml-1 h-4 w-4" />
								{/if}
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
						iconExternal={iconExternal}
						on:select={handleSelect} />
				{:else}
					<li>
						<SignIn action="register" className="block horizontal-menu left">
							<div slot="submitButton">Register</div>
						</SignIn>
					</li>
					<li>
						<SignIn className="block horizontal-menu left">
							<div slot="submitButton" class="flex items-center whitespace-nowrap">
								<Icon name="corepass" className="w-5 h-5 mr-1.5" color="#1066df" />
								CorePass SignIn
							</div>
						</SignIn>
					</li>
				{/if}
			</ul>
		</nav>
	{/if}
</header>
