import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
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
	]
});
