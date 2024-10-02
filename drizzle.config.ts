import { defineConfig } from "drizzle-kit";

// Define the allowed dialect types explicitly
type Dialect = "postgresql" | "mysql" | "sqlite";

// Map DB_TYPE to the appropriate dialect, with special handling for "d1"
const dbType = process.env.DB_TYPE?.toLowerCase();
const dialect: Dialect = dbType === 'd1' ? 'sqlite' : (dbType as Dialect) || 'postgresql';

// Define available schemas for different dialects
const schemas = {
	postgresql: [
		"./src/schemas/postgres.ts"
	],
	sqlite: [
		"./src/schemas/sqlite.ts"
	],
	d1: [
		"./src/schemas/d1.ts"
	],
};

// Select the appropriate schema based on the dialect and dbType
const selectedSchemas = dbType === 'd1'
	? schemas['d1']
	: schemas[dialect] || [];

// Define D1-specific configurations (only when dbType is "d1")
const d1Config = dbType === 'd1'
	? {
		driver: "d1-http",
		dbCredentials: {
			accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
			databaseId: process.env.D1_DB || "",
			token: process.env.CLOUDFLARE_API_TOKEN || "",
		},
	}
	: {};

// Export the Drizzle config
export default defineConfig({
	dialect: dialect, // Use the determined dialect (sqlite for "d1", other for normal db types)
	schema: selectedSchemas, // Choose the correct schemas based on the type
	out: "./drizzle/main", // Output directory for the generated files
	...d1Config, // Spread D1-specific configuration if the database type is "d1"
});
