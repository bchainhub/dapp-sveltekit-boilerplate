type D1Database = import('@cloudflare/workers-types').D1Database;
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

interface User { // TODO: Review and update as needed
	name?: string | null;
	email?: string | null;
	image?: string | null;
	id?: string | null;      // Optional user ID (can be from OAuth provider or internal)
	role?: string | null;     // Optional role for authorization
	[key: string]: any;       // Allow other properties as needed for flexibility
}

// Define the session type to include user and session-specific properties
interface Session { // TODO: Review and update as needed
	user?: User | null;       // User information associated with the session
	expires: string;          // Expiration date as an ISO string
	accessToken?: string;     // Optional access token for OAuth/JWT providers
	refreshToken?: string;    // Optional refresh token for OAuth/JWT providers
	[key: string]: any;       // Allow extensions for future changes or addons
}

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
		session: Session | null;
		config?: Config;
	}

	interface Platform {
		caches?: CacheStorage & { default: Cache };
		context?: {
			waitUntil(promise: Promise<any>): void;
		};
		env?: Env;
		// Cloudflare-specific properties
		cf?: {
			[key: string]: string | undefined;
		};
	}
}

type Env = {
	ENABLE_API?: string;
	ENABLE_AUTH?: string;
	REG_COREID?: string;
	VERIFIED_ONLY?: string;
	VERIFIED_EXIPRATION_DAYS?: string;
	ENABLE_FILE_ACCESS?: string;
	KV_NAME?: string;
	R2_NAME?: string;
	PASSKEY_DURATION?: string;
	CAPTURE_COUNTRY?: string;
	CAPTURE_CITY?: string;
	DB_TYPE?: string;
	DB_NAME?: string;
	PRISMA_PROVIDER?: string;
	PRISMA_API_KEY?: string;
};
