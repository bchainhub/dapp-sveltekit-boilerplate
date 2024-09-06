import type { D1Database, KVNamespace, R2Bucket } from '@cloudflare/workers-types';

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
		db?: D1Database;
		kv?: KVNamespace;
		bucket?: R2Bucket;
		session?: {
			challenge: string;
		};
		country?: string;
		city?: string;
	}

	interface PageData {
		config: Config;
	}

	interface Platform {
		caches?: CacheStorage & { default: Cache };
		context?: {
			waitUntil(promise: Promise<any>): void;
		};
		env?: Env;
		// Cloudflare-specific properties
		cf?: {
			asn?: string;               // Autonomous System Number
			asOrganization?: string;    // Organization name of ASN
			city?: string;              // City of the request origin
			continent?: string;         // Continent of the request origin
			country?: string;           // Country code (ISO 3166-1 Alpha 2)
			latitude?: string;          // Latitude of the request origin
			longitude?: string;         // Longitude of the request origin
			postalCode?: string;        // Postal code of the request origin
			region?: string;            // Region name
			regionCode?: string;        // Region code
			timezone?: string;          // Timezone of the request origin
		};
	}
}

type Env = {
	ENABLE_API?: string;
	ENABLE_AUTH?: string;
	ONLY_ACTIVATED?: string;
	ENABLE_FILE_ACCESS?: string;
	D1_NAMESPACE?: string;
	KV_NAMESPACE?: string;
	R2_NAMESPACE?: string;
	PASSKEY_DURATION?: string;
	CAPTURE_COUNTRY?: string;
	CAPTURE_CITY?: string;
};
