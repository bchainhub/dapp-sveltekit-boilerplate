if (import.meta.env.MODE === 'production' && 'serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').catch((err) => {
		console.error('Service worker registration failed:', err);
	});
}
