import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({ fallback: '404.html' })
		}),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			injectRegister: false,
			kit: {
				adapterFallback: '404.html',
				spa: true
			},
			devOptions: {
				enabled: true,
				navigateFallbackAllowlist: []
			},
			manifest: {
				id: '/',
				name: 'Entrelinhas',
				short_name: 'Entrelinhas',
				description: 'A tua fila de leitura, decidida sem pressa.',
				lang: 'pt',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				background_color: '#f7f3ec',
				theme_color: '#f7f3ec',
				icons: [
					{ src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png' },
					{
						src: '/pwa/icon-maskable-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['client/**/*.woff2'],
				globIgnores: [
					'sw.js',
					'workbox-*.js',
					'client/sw.js',
					'client/workbox-*.js',
					'manifest.webmanifest'
				],
				navigateFallback: '404.html',
				cleanupOutdatedCaches: true,
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.hostname === 'covers.openlibrary.org',
						handler: 'CacheFirst',
						options: {
							cacheName: 'entrelinhas-covers',
							expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
							cacheableResponse: { statuses: [0, 200] }
						}
					},
					{
						urlPattern: ({ url }) => url.hostname.endsWith('jelly-ui.com'),
						handler: 'CacheFirst',
						options: {
							cacheName: 'entrelinhas-jelly-ui',
							expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
							cacheableResponse: { statuses: [0, 200] }
						}
					}
				]
			}
		})
	]
});
