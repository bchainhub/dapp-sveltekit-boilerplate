import type { D1Database } from '@cloudflare/workers-types';

interface Config {
	title: string;
	url: string;
	organizationName?: string;
	projectName?: string;
	favicon?: string;

	themeConfig: {
		navbar?: {
			logo?: { src: string; alt: string };
			items?: { label: string; to?: string; href?: string; position?: "left" | "right", target?: "_blank" | "_self" | "_parent" | "_top" }[];
			authItems?: { label: string; to?: string; href?: string; target?: "_blank" | "_self" | "_parent" | "_top" }[];
			hideOnScroll?: boolean;
		};
		footer?: {
			style?: "light" | "dark" | "transparent";
			logo?: { src: string; alt: string };
			links?: { title: string; items: { label: string; to?: string; href?: string, target?: "_blank" | "_self" | "_parent" | "_top" }[] }[];
			copyright?: string;
		};
		metadata?: { name?: string; content: string; property?: string }[];
		colorMode?: {
			defaultMode?: "light" | "dark";
			disableSwitch?: boolean;
			respectPrefersColorScheme?: boolean;
		};
	};
}

declare namespace App {
	interface Locals {
		db?: D1Database;
		session?: {
			challenge: string;
		};
	}

	interface PageData {
		config: Config;
	}

	interface Platform {
		env: Env;
		context: {
			waitUntil(promise: Promise<any>): void;
		};
		caches: CacheStorage & { default: Cache };
	}
}

type Env = {
	ENABLE_API?: string;
	ENABLE_AUTH?: string;
	ONLY_ACTIVATED?: string;
	ENABLE_PIPE?: string;
	ENABLE_FILE_ACCESS?: string;
	D1_NAMESPACE?: string;
	KV_NAMESPACE?: string;
	R2_NAMESPACE?: string;
	JWT_SECRET?: string;
	JWT_DURATION?: string;
	PIPE_DURATION?: string;
	PASSKEY_DURATION?: string;
};
