<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { ArrowUpRight, Haze, Menu, Moon, Sun } from 'lucide-svelte';
	import { ActionsDropdown, Icon } from '$lib/components';
	import { walletConnected, walletAddress, autoLogin, connectWallet, disconnectWallet } from '$lib/helpers/wallet';
	import { enableWeb4, disableWeb4, isWeb4Connected, isPublicEnableWeb4 } from '../../helpers/web4';
	import * as publicDynamicEnv from '$env/dynamic/public';

	const { logo, items = [], hideOnScroll, orientation = 'horizontal', style = 'auto', iconExternal } = __SITE_CONFIG__?.themeConfig?.navbar || {};
	const { disableSwitch, defaultMode, respectPrefersColorScheme } = __SITE_CONFIG__?.themeConfig?.colorMode || {};

	let isOpen: boolean = false;
	let lastScrollTop = 0;
	let isNavHidden: boolean = false;
	let dropdownOpen: boolean = false;
	let theme: 'light' | 'dark' | 'system' = respectPrefersColorScheme ? 'system' : (defaultMode ?? 'light');
	let authEnabled: boolean = publicDynamicEnv.env.PUBLIC_ENABLE_AUTH === 'true' || false;
	let web4Enabled: boolean = false;
	let publicEnableWeb4: boolean = isPublicEnableWeb4();

	const menuItems = writable([
		{ label: 'Logout', action: () => disconnectWallet() },
	]);

	const handleSelect = (event: CustomEvent<{ label: string; action: () => void; }>) => {
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
		if (menuElement && !menuElement.contains(event.target as Node) &&
			hamburgerButton && !hamburgerButton.contains(event.target as Node)) {
			closeMenu();
		}
	};

	const rotateTheme = () => {
		let prefersDark = defaultMode === 'dark';
		if (typeof window !== 'undefined') {
			prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		if (!respectPrefersColorScheme) {
			theme = theme === 'light' ? 'dark' : 'light';
		} else {
			theme = theme === 'system' ? (prefersDark ? 'light' : 'dark') : theme === 'dark' ? 'system' : 'dark';
		}

		applyTheme();
	};

	const applyTheme = () => {
		if (typeof window !== 'undefined') {
			const themeToApply = theme === 'system' && respectPrefersColorScheme
				? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
				: theme;
			document.documentElement.setAttribute('data-theme', themeToApply);
			localStorage.setItem('theme', themeToApply);
		}
	};

	const manualConnect = () => {
		if(authEnabled) connectWallet();
	}

	const handleScroll = () => {
		if (typeof window !== 'undefined') {
			const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
			if (isOpen) closeMenu();
			if (hideOnScroll) {
				isNavHidden = currentScrollTop > lastScrollTop && currentScrollTop > 0;
			}
			lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
		}
	};

	const toggleWeb4Connection = async () => {
		if (web4Enabled) {
			disableWeb4();
			web4Enabled = isWeb4Connected();
		} else {
			const success = await enableWeb4();
			web4Enabled = success ? isWeb4Connected() : false;
		}
	};

	onMount(() => {
		if (authEnabled) {
			autoLogin();
		}

		if (publicEnableWeb4) {
			web4Enabled = isWeb4Connected();
		}

		const storedTheme = localStorage.getItem('theme') as string | null;
		if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
			theme = storedTheme;
		} else {
			theme = respectPrefersColorScheme ? 'system' : (defaultMode ?? 'light');
		}

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
			{:else if __SITE_CONFIG__?.title}
				<a href="/" class={`flex justify-center md:mr-8 ${(orientation === 'vertical') ? 'space-y-2 md:mb-8' : 'space-x-2'}`}>
					<h1 class="text-2xl font-bold">{__SITE_CONFIG__.title}</h1>
				</a>
			{/if}
			{#if !disableSwitch}
				<button onclick={rotateTheme} class="focus:outline-hidden flex items-center md:hidden">
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
			<button id="hamburger-button" class="cursor-context-menu focus:outline-hidden flex items-center" onclick={toggleMenu}>
				<Menu class="w-8 h-8" />
			</button>
		</div>
		{#if orientation === 'vertical'}
			<nav class="hidden md:block">
				<ul class="flex flex-col space-y-1">
					{#if authEnabled && $walletConnected}
						<ActionsDropdown
							title={$walletAddress}
							bind:open={dropdownOpen}
							items={$menuItems}
							position="left"
							isSmall={true}
							iconExternal={iconExternal}
							on:change={handleSelect} />
					{:else if authEnabled}
						<li>
							<div class="block vertical-menu left p-2">
								<div  class="flex items-center whitespace-nowrap">
									<button onclick={manualConnect} class="action"><span>Connect</span></button>
								</div>
							</div>
						</li>
					{/if}
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
					{#if items}<li><hr /></li>{/if}
					<li class="hidden md:flex items-center">
						<button onclick={rotateTheme} class="menu-button focus:outline-hidden flex items-center p-2">
							{#if theme === 'system'}
								<Haze class="w-6 h-6 mr-1.5 text-gray-500" />System theme
							{:else if theme === 'dark'}
								<Moon class="w-6 h-6 mr-1.5 text-gray-500" />Dark theme
							{:else}
								<Sun class="w-6 h-6 mr-1.5 text-yellow-500" />Light theme
							{/if}
						</button>
					</li>
					{#if publicEnableWeb4}
						<li>
							<div class="block vertical-menu left p-2">
								<div  class="flex items-center whitespace-nowrap">
									<button onclick={toggleWeb4Connection} class="menu-button focus:outline-hidden flex items-center">
										<Icon name="web4" className="w-6 h-6 mr-1.5" color="fill-gray-500" />{web4Enabled ? 'Web4 On' : 'Web4 Off'}
									</button>
								</div>
							</div>
						</li>
					{/if}
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
						<button onclick={rotateTheme} class="menu-button focus:outline-hidden flex items-center">
							{#if theme === 'system'}
								<Haze class="w-6 h-6 text-gray-500" />
							{:else if theme === 'dark'}
								<Moon class="w-6 h-6 text-gray-500" />
							{:else}
								<Sun class="w-6 h-6 text-yellow-500" />
							{/if}
						</button>
					{/if}
					{#if publicEnableWeb4}
						<button onclick={toggleWeb4Connection} class="icon">
							<span>Web4</span>
							<Icon name="web4" className="h-6 w-6" color="fill-gray-500" />
						</button>
					{/if}
					{#if authEnabled && $walletConnected}
						<li class="flex items-center">
							<ActionsDropdown
								title={$walletAddress}
								bind:open={dropdownOpen}
								items={$menuItems}
								position="right"
								iconExternal={iconExternal}
								on:change={handleSelect} />
						</li>
					{:else if authEnabled}
						<li class="flex items-center">
							<div class="block horizontal-menu neon">
								<div  class="flex items-center whitespace-nowrap">
									<button onclick={manualConnect} class="action"><span>Connect</span></button>
								</div>
							</div>
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
				{#if authEnabled && $walletConnected}
					<ActionsDropdown
						title={$walletAddress}
						bind:open={dropdownOpen}
						items={$menuItems}
						position="left"
						isSmall={true}
						iconExternal={iconExternal}
						on:change={handleSelect} />
				{:else if authEnabled}
					<li>
						<div class="block horizontal-menu left">
							<div class="flex items-center whitespace-nowrap">
								<button onclick={manualConnect}>Connect</button>
							</div>
						</div>
					</li>
				{/if}
				{#if publicEnableWeb4}
					<li>
						<div class="block horizontal-menu left">
							<div  class="flex items-center whitespace-nowrap">
								<button onclick={toggleWeb4Connection}>
									<Icon name="web4" className="h-6 w-6 mr-1.5" color="fill-gray-500" />{web4Enabled ? 'Web4 On' : 'Web4 Off'}
								</button>
							</div>
						</div>
					</li>
				{/if}
			</ul>
		</nav>
	{/if}
</header>
