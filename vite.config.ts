import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import type { Config } from 'vite-plugin-config';
import tailwindcss from '@tailwindcss/vite';

const siteConfig: Config = {
	title: "Mota ₡ore", // Site title - keep `₡ore` if you want to let people know it's powered by Core Infra
	url: "http://localhost:5173", // Site domain
	organizationName: "bchainhub", // Organization name - In most cases it's your GitHub username
	projectName: "dapp-sveltekit-boilerplate", // Project name - In most cases it's your repo name
	favicon: "/img/icons/favicon.png", // Favicon path in static folder
	themeConfig: {
		navbar: {
			logo: {
				src: "/img/logo.svg", // Logo path in static folder
				alt: "MOTA" // Logo alt attribute
			},
			style: "auto", // Navbar style (auto, dark, light)
			orientation: "horizontal", // Navbar orientation (horizontal, vertical)
			hideOnScroll: true, // Hide navbar on scroll down
			iconExternal: true, // Icon for external links
			items: [ // Navbar items
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
			authItems: [ // Auth items
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
			style: "transparent", // Footer style (auto, dark, light, transparent)
			logo: {
				src: "/img/logo-footer.svg", // Logo path in static folder
				alt: "MOTA" // Logo alt attribute
			},
			iconExternal: true, // Icon for external links
			links: [ // Footer links
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
			liner: [ // Footer liner
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
			copyright: `Core ⊛ 2020-${new Date().getFullYear()} MOTA Foundation` // Copyright text
		},
		metadata: [
			{ name: "viewport", content: "width=device-width, initial-scale=1.0" }, // Viewport meta tag
			{ name: "theme-color", content: "#25c19f" }, // Theme color meta tag
			{ name: "description", content: "This is SvetleKit Boilerplate website" }, // Description meta tag
			{ name: "keywords", content: "website, sveltekit, vite, cloudflare" }, // Keywords meta tag
			{ property: "og:type", content: "website" }, // Open Graph type meta tag
			{ property: "ican:xcb", content: "cb7147879011ea207df5b35a24ca6f0859dcfb145999" }, // FinTag
			{ property: "defi:fee", content: "1%" } // DeFi fee meta tag - To receive kickbacks for clients
		],
		colorMode: {
			defaultMode: "light", // Default color mode
			disableSwitch: false, // Disable color mode switch
			respectPrefersColorScheme: true // Respect browser color scheme preference
		}
	}
};

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['/icons/favicon.svg', 'robots.txt', '/icons/apple-touch-icon.png'],
			manifest: {
				name: 'MOTA — dApp Boilerplate',
				short_name: 'MOTA',
				description: 'Welcome to SvelteKit dApp Boilerplate',
				theme_color: '#45a699',
				icons: [
					{
						src: '/icons/192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icons/512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/icons/512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			}
		})
	],
	define: {
		__SITE_CONFIG__: JSON.stringify(siteConfig),
	},
});
