import { Target } from "lucide-svelte";

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
			style: "auto",
			orientation: "horizontal",
			hideOnScroll: true,
			iconExternal: true,
			items: [
				{
					label: "Home",
					to: "/",
					position: "left",
					icon: "home"
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
			iconExternal: true,
			links: [
				{
					title: "1st Category",
					items: [
						{ label: "Home", to: "/", icon: "home" },
						{ label: "Core", href: "https://coreblockchain.net" }
					]
				},
				{
					title: "2nd Category",
					items: [
						{ label: "About", to: "/about" },
						{ label: "Core CIP", href: "https://cip.coreblockchain.net" }
					]
				},
				{
					title: "3rd Category",
					items: [
						{ label: "Services", to: "/services" },
						{ label: "PayTo", href: "https://payto.money", target: "_blank" }
					]
				}
			],
			liner: [
				{
					label: "🦖 Donate monthly",
					to: "payto://xcb/cb7147879011ea207df5b35a24ca6f0859dcfb145999?rc=m&donate=1&org=MOTA+Foundation&item=Donation&color-f=0d2b27&color-b=2fa99b"
				},
				{
					label: "Privacy Policy",
					to: "/privacy"
				},
				{
					label: "Terms of Service",
					to: "/terms-of-service"
				},
				{
					label: "Imprint",
					href: "https://coreblockchain.net",
					target: "_blank"
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
