import { defineConfig } from "drizzle-kit";

// Define the allowed dialect types explicitly
type Dialect = "postgresql" | "mysql" | "sqlite";

// Map BCH_DB_TYPE to the appropriate dialect, with special handling for "d1"
const bchDbType = process.env.BCH_DB_TYPE?.toLowerCase();
const bchDialect: Dialect = bchDbType === 'd1' ? 'sqlite' : (bchDbType as Dialect) || 'postgresql';

// Define available schemas for different dialects
const schemasBch = {
	postgresql: [
		"./src/schemas/bch/postgres.ts"
	],
	sqlite: [
		"./src/schemas/bch/sqlite.ts"
	],
	d1: [
		"./src/schemas/bch/d1.ts"
	],
};

// Select the appropriate schema based on the BCH dialect
const selectedBchSchemas = bchDbType === 'd1'
	? schemasBch['d1']
	: schemasBch[bchDialect] || [];

// Define D1-specific configurations for BCH (only when BCH_DB_TYPE is "d1")
const d1BchConfig = bchDbType === 'd1'
	? {
		driver: "d1-http",
		dbCredentials: {
			accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
			databaseId: process.env.BCH_D1_DB || "",
			token: process.env.CLOUDFLARE_API_TOKEN || "",
		},
	}
	: {};

// Export the Drizzle config for BCH
export default defineConfig({
	dialect: bchDialect, // Use the determined dialect for BCH
	schema: selectedBchSchemas, // Choose the correct schemas for BCH
	out: "./drizzle/bch", // Output directory
	...d1BchConfig, // Spread D1-specific configuration for BCH if the database type is "d1"
});
