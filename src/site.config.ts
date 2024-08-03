export const config: Config = {
	title: "MOTA",
	url: "http://localhost:3000",
	organizationName: "rastislavcore",
	projectName: "dapp-sveltekit-boilerplate",
	favicon: "/img/favicon.png",
	themeConfig: {
		navbar: {
			logo: {
				src: "/img/logo.svg",
				alt: "MOTA"
			},
			hideOnScroll: true,
			items: [
				{
					label: "Home",
					to: "/",
					position: "left"
				},
				{
					label: "About",
					to: "/about",
					position: "left"
				},
				{
					label: "Services",
					to: "/services",
					position: "left"
				},
				{
					label: "Contact",
					to: "/contact",
					position: "left"
				},
				{
					label: "Blog",
					href: "https://blog.coreblockchain.net",
					position: "right",
					target: "_blank"
				}
			],
			authItems: [
				{
					label: "Profile",
					to: "/profile"
				},
				{
					label: "Settings",
					to: "/settings"
				}
			]
		},
		footer: {
			style: "transparent",
			logo: {
				src: "/img/logo-footer.svg",
				alt: "MOTA"
			},
			links: [
				{
					title: "1st Category",
					items: [
						{ label: "Item 1", to: "/" },
						{ label: "Item 2", href: "https://coreblockchain.net" }
					]
				},
				{
					title: "2nd Category",
					items: [
						{ label: "Item 1", to: "/" },
						{ label: "Item 2", href: "https://coreblockchain.net" }
					]
				},
				{
					title: "3rd Category",
					items: [
						{ label: "Item 1", to: "/" },
						{ label: "Item 2", href: "https://coreblockchain.net", target: "_blank" }
					]
				}
			],
			copyright: `Copyright © 2020-${new Date().getFullYear()} MOTA Foundation`
		},
		metadata: [
			{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
			{ name: "theme-color", content: "#25c19f" },
			{ name: "apple-mobile-web-app-capable", content: "yes" },
			{ name: "description", content: "This is SvetleKit Boilerplate website" },
			{ name: "keywords", content: "website, sveltekit, vite, cloudflare" },
			{ property: "og:type", content: "website" }
		],
		colorMode: {
			defaultMode: "light",
			disableSwitch: false,
			respectPrefersColorScheme: true
		}
	}
};
