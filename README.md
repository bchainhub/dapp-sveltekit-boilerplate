# SvelteKit Boilerplate WIP (Work in Progress)

This project is work-in-progress, then it can introduce any breaking changes. Please, use it with caution.

Welcome to the SvelteKit Boilerplate! This project provides a solid foundation for building web applications with SvelteKit, along with security features and compatibility with Cloudflare services.

## Features

- **[SvelteKit](https://kit.svelte.dev/)**: A framework for building fast, modern web applications.
- **[Typescript](https://www.typescriptlang.org/)**: Type-safe development with TypeScript integration.
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
- **[PostCSS](https://postcss.org/)**: Transform CSS with JavaScript plugins.
- **[ESLint](https://eslint.org/)**: Linting utility for identifying and reporting on patterns in JavaScript.
- **[Prettier](https://prettier.io/)**: Code formatter for maintaining consistent style.
- **[Lucide icons](https://lucide.dev/)**: Beautiful and customizable icon set.
- **[blo identicons](https://github.com/bchainhub/blo)**: blo is a small and fast library to generate Blockchain identicons.
- **[ICAN / IBAN validation](https://github.com/bchainhub/ican.js)**: Validate international bank account numbers.
- **[Exchange Number Format](https://github.com/bchainhub/exchange-rounding)**: Utility for formatting and rounding exchange numbers.

## Databases

- **[Drizzle ORM](https://orm.drizzle.team)**: Headless TypeScript ORM with a head.
  - SQLite / CloudFlare D1 database.
  - Postgres database.
  - Hyperdrive connector.
  - and many more... (write your own connector in the `src/server/db` directory)

### Database connectors

- [Postgres.js](https://github.com/porsager/postgres) for Postgres database.
- [libSQL](https://github.com/tursodatabase/libsql) for SQLite and Web4 database.
- [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) connector for Cloudflare (paid plan).

## Installation

To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/bchainhub/dapp-sveltekit-boilerplate.git
cd dapp-sveltekit-boilerplate
npm install
```

## Usage

Start the development server:

```bash
npm run dev
```

Build the project for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Configuration

Update the `vite.config.ts` file located in the main folder to customize the project settings.

You can customize application settings in `wrangler.toml` file:

- `NODE_VERSION`: Node.js version.

Environment variables are stored in the `.env` file. You can add your own environment variables to this file.

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID.
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token.
- `CAPTURE_COUNTRY`: Provide country as a variable from CF pages, Netlify, Vercel. If enabled.
- `CAPTURE_CITY`: Provide city as a variable from CF pages, Netlify, Vercel. If enabled.

Public variables:

- `PUBLIC_ENABLE_AUTH`: Enable or disable authentication. Default is false (disabled).

Environment variables for database setup:

- `DB_TYPE`: Database type: SQLite, PostgeSQL. Default is no database (empty string).
- `DB_URL`: Database URL.
- `DB_AUTH_TOKEN`: Database authentication token.
- `DB_SSL`: Enable or disable SSL for Postgres database.

## Web4

Web4 is the tool for connecting to the offline blockchain data and ecosystem using specialized devices. You can use it for blockchain operations and interaction using radio frequencies. Native support for Web4 is included in the project.

Currently, we are supporting the following functionality:

- Read-only data from the blockchain ETL service.
- TxMS transactions.

What is Web4?

In short Web4 is an alternative network and operations instead of the Internet. It is a secure and reliable way to interact with the blockchain data. You can use it for blockchain operations and interaction using radio frequencies as well as 0G connectivity. But it is not focused only on Blockchain, can it be various types of data.

Why do you need Web4?

In some cases you need to interact with the blockchain data offline. You can use Web4 + Web3 for this purpose. It is a secure and reliable way to interact with the blockchain data. You can use it for blockchain operations and interaction using radio frequencies as well as 0G connectivity.

## PWA

The project is a Progressive Web Application (PWA) by default. You can customize the PWA settings in the `vite.config.ts` file.

## Styling

The project uses TailwindCSS for styling. You can customize the styles by editing the `tailwind.config.js` file.

Custom styles and variables are defined in the `src/css` directory. You can use [customization tool](https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima) to edit variables. We are using prefix `skc` for custom classes.

You can use tool to generate TailwindCSS colors: [TailwindCSS Color Generator](https://javisperez.github.io/tailwindcolorshades/) or [TailwindCSS Color Shades](https://www.tailwindshades.com/).

## Database setup

Types of connectors:

- [D1 database](https://developers.cloudflare.com/d1/) Cloudflare's free plan
- [Hyperdrive connector](https://developers.cloudflare.com/hyperdrive/) Cloudflare's paid plan

We are recommending purchasing the Hyperdrive connector for production use. There are many advantages and you can bind plenty of databases.

You can use SQLite, Postgres database, or any other supported by Drizzle. Supported drivers by Cloudflare are listed [here](https://developers.cloudflare.com/hyperdrive/configuration/connect-to-postgres/#supported-drivers). The database setup is defined in the `.env` file prefixed with `DB_`.

### ORM Database Setup

The project uses Drizzle ORM for database setup. You can find more information in the [Drizzle ORM documentation](https://orm.drizzle.team/).

This step is optional, but required for authentication and blockchain operations.

We are supporting three categories of databases:

- Ordinary databases
- Blockchain databases
- Local Blockchain databases on the ORB (or any other) device

### Drizzle setup

Drizzle setup is located in the `drizzle.config.ts` file. Configure it for your database setup.

Schemas are located in the `src/schemas` directory. You can add your own schema files.

### Recommended database setup

We are recommending to use the following setup:

If you own the Orb device, you can use it for blockchain operations. You can use the D1 database for ordinary operations. You can use the Hyperdrive connector for production use - for Apps they need the heavy load.

- Small applications: D1 database + Blockchain database on Orb device or D1.
- Medium applications: Hyperdrive connector + Blockchain database on Orb device.
- Large applications: Hyperdrive connector + Blockchain database on Orb device or another Hyperdrive instance.

## Authentication

The project uses CorePass Extension for authentication but Passkey is possible to build also.

Dependencies:

- CorePass Extension
- Node.js version 22 or higher.

## Sitemaps

Sitemaps help search engines prioritize pages within your site, particularly when you have a large amount of content. You can create a sitemap dynamically using an endpoint: `src/routes/sitemap.xml/+server.ts`

```ts
export async function GET() {
  return new Response(
    `
    <?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
      xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
      <!-- <url> elements go here -->
    </urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}
```

## Security

About Platform Environment Variables:

- These variables are accessible in server-side code except those that are prefixed with `PUBLIC_`.

### Local environment variables

We can access local environment variables using the `env` function. This function is used to read the environment variables from the `.env` file. Any value is returned as `string`.

## Contributing

Contributions are welcome! For feature requests, bug reports, or questions, please [open an issue](https://github.com/bchainhub/dapp-sveltekit-boilerplate/issues).

## License

This project is open source and available under the [CORE License](LICENSE).
