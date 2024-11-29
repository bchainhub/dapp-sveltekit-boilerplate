type KVNamespace = import('@cloudflare/workers-types').KVNamespace;
type R2Bucket = import('@cloudflare/workers-types').R2Bucket;

interface Config {
	title: string;
	url: string;
	organizationName?: string;
	projectName?: string;
	favicon?: string;

	themeConfig: {
		navbar?: {
			logo?: { src: string; alt: string };
			items?: NavbarItem[];
			authItems?: NavbarItem[];
			style?: "auto" | "transparent";
			hideOnScroll?: boolean;
			orientation?: "horizontal" | "vertical";
			iconExternal?: boolean;
		};
		footer?: {
			style?: "light" | "dark" | "transparent";
			logo?: { src: string; alt: string };
			links?: { title: string; items: FooterLinkItem[] }[];
			copyright?: string;
			liner?: FooterLinkItem[];
			iconExternal?: boolean;
		};
		metadata?: { name?: string; content: string; property?: string }[];
		colorMode?: {
			defaultMode?: "light" | "dark";
			disableSwitch?: boolean;
			respectPrefersColorScheme?: boolean;
			iconExternal?: boolean;
		};
	};
}

declare module 'vite-plugin-config' {
	export type Config = import('./site.config').Config;
}

declare const __SITE_CONFIG__: Config;

interface NavbarItem {
	label: string;
	to?: string;
	href?: string;
	position?: "left" | "right";
	target?: "_blank" | "_self" | "_parent" | "_top";
	icon?: string;
}

interface FooterLinkItem {
	label: string;
	to?: string;
	href?: string;
	target?: "_blank" | "_self" | "_parent" | "_top";
	icon?: string;
}

type MenuItem = NavbarItem & {
	action?: () => void;
};

declare namespace App {
	interface Locals {
		db?: any;
		bchdb?: any;
		kv?: KVNamespace;
		bucket?: R2Bucket;
		country?: string;
		city?: string;
	}

	interface PageData {
		config?: Config;
	}

	interface Platform {
		caches?: CacheStorage & { default: Cache };
		context?: {
			waitUntil(promise: Promise<any>): void;
		};
		env?: Env;
		cf?: {
			[key: string]: string | undefined;
		};
	}
}

type dbType = 'd1' | 'sqlite' | 'web4' | 'postgres';

interface Env {
	CLOUDFLARE_ACCOUNT_ID?: string;
	CLOUDFLARE_API_TOKEN?: string;
	[key: string]: string | undefined;
}

declare module '$env/static/public' {
	export const PUBLIC_WEB4_URL: string | undefined;
}

declare module '$env/dynamic/public' {
	export const PUBLIC_ENABLE_AUTH: string | undefined;
	export const PUBLIC_ENABLE_WEB4: string | undefined;
}

declare module '$env/static/private' {
	export const KV_NAME: string | undefined;
	export const R2_NAME: string | undefined;
	export const DB_TYPE: string | undefined;
	export const DB_URL: string | undefined;
	export const DB_AUTH_TOKEN: string | undefined;
	export const DB_SSL: string | undefined;
	export const BCH_DB_TYPE: string | undefined;
	export const BCH_DB_URL: string | undefined;
	export const BCH_DB_AUTH_TOKEN: string | undefined;
	export const BCH_DB_SSL: string | undefined;
	export const DB_D1: string | undefined;
	export const HYPERDRIVE: string | undefined;
	export const BCH_HYPERDRIVE: string | undefined;
}

declare module '$env/dynamic/private' {
	export const ENABLE_FILE_ACCESS: string | undefined;
	export const CAPTURE_COUNTRY: string | undefined;
	export const CAPTURE_CITY: string | undefined;
}

interface Window {
	corepass?: {
		isCorePass?: boolean;
		request: (args: { method: string; params?: unknown[] }) => Promise<any>;
		on?: (eventName: string, callback: (...args: any[]) => void) => void;
		removeListener?: (eventName: string, callback: (...args: any[]) => void) => void;
	};
}
