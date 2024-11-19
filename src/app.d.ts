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

type dbType = 'd1' | 'sqlite' | 'orb' | 'postgres';

interface Env {
	CLOUDFLARE_ACCOUNT_ID?: string;
	CLOUDFLARE_API_TOKEN?: string;
	ENABLE_FILE_ACCESS?: string;
	KV_NAME?: string;
	R2_NAME?: string;
	CAPTURE_COUNTRY?: string;
	CAPTURE_CITY?: string;
	DB_TYPE?: dbType;
	DB_URL?: string;
	DB_AUTH_TOKEN?: string;
	DB_SSL?: string;
	BCH_DB_TYPE?: string;
	BCH_DB_URL?: string;
	BCH_DB_AUTH_TOKEN?: string;
	BCH_DB_SSL?: string;
	D1_DB?: string;
	HYPERDRIVE?: string;
	BCH_HYPERDRIVE?: string;
	ORB_ENABLE?: string;
	ORB_URL?: string;
	PUBLIC_ENABLE_AUTH?: string;
	PUBLIC_WALLET_PRIORITY?: string;
	[key: string]: string | undefined;
  }
