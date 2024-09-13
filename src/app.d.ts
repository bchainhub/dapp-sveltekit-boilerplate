type KVNamespace = import('@cloudflare/workers-types').KVNamespace;
type R2Bucket = import('@cloudflare/workers-types').R2Bucket;
type AuthSession = import("@auth/core/types").Session;
type AuthUser = import("@auth/core/types").User;

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

interface User extends AuthUser {
	authId?: string;
	isVerified?: boolean;
}

interface Session extends AuthSession {
	user: User;
}

declare namespace App {
	interface Locals {
		db?: any;
		bchdb?: any;
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
		cf?: {
			[key: string]: string | undefined;
		};
	}
}

type Env = {
	AUTH_SECRET?: string;
	LOGIN_MAX_AGE?: string;
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
	DB_URL?: string;
	DB_AUTH_TOKEN?: string;
	DB_SSL?: string;
	BCH_DB_TYPE?: string;
	BCH_DB_URL?: string;
	BCH_DB_AUTH_TOKEN?: string;
	BCH_DB_SSL?: string;
	[key: string]: string | undefined;
};
