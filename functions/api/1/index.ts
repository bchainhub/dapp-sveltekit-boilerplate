import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

if (process.env.ENABLE_API !== 'true') {
	throw new Error('API is disabled!');
}

const app = new Hono().basePath('/api/1');

app.get('/ping', (c) => {
	const jsonResult = {
		message: 'pong',
		status: 'ok'
	};
	return c.json(jsonResult);
});

export const onRequest = handle(app);
