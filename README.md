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
- **[Wallet Connect](https://walletconnect.network/)**: Connect to decentralized applications using WalletConnect.
- **[blo identicons](https://github.com/bchainhub/blo)**: blo is a small and fast library to generate Blockchain identicons.
- **[ICAN / IBAN validation](https://github.com/bchainhub/ican.js)**: Validate international bank account numbers.
- **[Exchange Number Format](https://github.com/bchainhub/exchange-rounding)**: Utility for formatting and rounding exchange numbers.

## Databases

- **[Drizzle ORM](https://orm.drizzle.team)**: Headless TypeScript ORM with a head.
  - SQLite / CloudFlare D1 database.
  - Postgres database.
  - Hyperdrive connector.
  - Web4 devices.
  - and many more... (write your own connector in the `src/db` directory)

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

Update the `site.config.ts` file located in `/src` to customize the project settings.

You can customize application settings in `wrangler.toml` file:

- `NODE_VERSION`: Node.js version.

Environment variables are stored in the `.env` file. You can add your own environment variables to this file.

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID.
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token.
- `ENABLE_FILE_ACCESS`: Enable or disable file access.
- `KV_NAME`: Cloudflare KV namespace name.
- `R2_NAME`: Cloudflare R2 namespace name.
- `CAPTURE_COUNTRY`: Provide country as a variable from CF pages, Netlify, Vercel. If enabled.
- `CAPTURE_CITY`: Provide city as a variable from CF pages, Netlify, Vercel. If enabled.

Public variables:

- `PUBLIC_ENABLE_AUTH`: Enable or disable authentication.
- `PUBLIC_WALLET_PRIORITY`: Wallet names delimited with `,` for priority. Default is `metamask,trustwallet,coinbase`.
- `PUBLIC_WEB4_ENABLE`: Enable or disable Web4 blockchain. Default is true (enabled).

Environment variables for database setup:

- `DB_TYPE`: Database type: SQLite, PostgeSQL. Default is no database (empty string).
- `DB_URL`: Database URL.
- `DB_AUTH_TOKEN`: Database authentication token.
- `DB_SSL`: Enable or disable SSL for Postgres database.

Blockchain database setup:

- `BCH_DB_TYPE`: Database type: SQLite, PostgeSQL. Default is no database (empty string).
- `BCH_DB_URL`: Database URL.
- `BCH_DB_AUTH_TOKEN`: Database authentication token.
- `BCH_DB_SSL`: Enable or disable SSL for Postgres database.
- `WEB4_URL`: Web4 blockchain URL if differs from default.

## Web4

Web4 is the tool for connecting to the offline blockchain data and ecosystem using specialized devices. You can use it for blockchain operations and interaction using radio frequencies. Native support for Web4 is included in the project.

Currently, we are supporting the following functionality:

- Read-only data from the blockchain ETL service.
- TxMS transactions.

Why do you need Web4?

In some cases you need to interact with the blockchain data offline. You can use Web4 for this purpose. It is a secure and reliable way to interact with the blockchain data. You can use it for blockchain operations and interaction using radio frequencies as well as 0G connectivity.

## PWA

The project is a Progressive Web Application (PWA) by default. You can customize the PWA settings in the `site.config.ts` file.

## Styling

The project uses TailwindCSS for styling. You can customize the styles by editing the `tailwind.config.js` file.

Custom styles and variables are defined in the `src/css` directory. You can use [customization tool](https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima) to edit variables. We are using prefix `skc` for custom classes.

You can use tool to generate TailwindCSS colors: [TailwindCSS Color Generator](https://javisperez.github.io/tailwindcolorshades/) or [TailwindCSS Color Shades](https://www.tailwindshades.com/).

## Connection to KV

You can connect your application to Cloudflare KV by setting the `KV_NAME` variable in the `.env` file. You can find the KV namespace in the Cloudflare dashboard and bind it with your `KV_NAME` setup.

Make sure the `wrangler.toml` file is properly configured with the correct KV binding information.

## Connection to R2

You can connect your application to Cloudflare R2 by setting the `R2_NAME` variable in the `.env` file or dashboard. You can find the R2 namespace in the Cloudflare dashboard and bind it with your `R2_NAME` setup.

Make sure the `wrangler.toml` file is properly configured with the correct R2 binding information.

## Deployment

Deploying your SvelteKit application on Cloudflare Pages is straightforward.

You can follow Cloudflare dashboard deployment or use Wrangler CLI for deployment.

Follow these steps to get started with Wrangler CLI:

### Step 1: Install Wrangler CLI

First, ensure that you have the Wrangler CLI installed. If you don't have it installed, you can install it using npm:

```bash
npm install -g wrangler
```

### Step 2: Authenticate Wrangler

Next, authenticate Wrangler with your Cloudflare account:

```bash
wrangler login
```

### Step 3: wrangler.toml Configuration

In your project root, you have a `wrangler.toml` file that contains the configuration for deploying your application.

Customize the configuration to match your project settings.

### Step 4: Specify Node.js Version

Default Node.js version is 20 (Iron LTS). You can specify a different version in the `package.json` and `wrangler.toml` file.

### Step 5: Deploy the Application

To deploy your application, run:

```bash
wrangler pages publish ./build
```

### Additional Information

For more details on configuring and using Wrangler with Cloudflare Pages, visit the [official Wrangler documentation](https://developers.cloudflare.com/workers/wrangler/).

### Cloudflare deployment using dashboard

1. Create a new Pages project in the Cloudflare dashboard.
2. Connect the project to your GitHub repository.
3. Configure the build settings.
4. Deploy the project.

## Database setup

Types of connectors:

- [D1 database](https://developers.cloudflare.com/d1/) Cloudflare's free plan
- [Hyperdrive connector](https://developers.cloudflare.com/hyperdrive/) Cloudflare's paid plan
- ORB Web4 devices - local blockchain - SQLite based
- DePIN connector for ORB devices

We are recommending purchasing the Hyperdrive connector for production use. There are many advantages and you can bind plenty of databases.

You can use SQLite, Postgres database, or any other supported by Drizzle. Supported drivers by Cloudflare are listed [here](https://developers.cloudflare.com/hyperdrive/configuration/connect-to-postgres/#supported-drivers). The database setup is defined in the `.env` file prefixed with `DB_`.

Database requires Cloudflare flag `compatibility_flags = [ "nodejs_compat" ]` which is indicationg of using [Node.js compatibility mode](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#enable-nodejs-with-workers). You can consider to use `nodejs_compat_v2` if you need additional functionality.

### ORM Database Setup

The project uses Drizzle ORM for database setup. You can find more information in the [Drizzle ORM documentation](https://orm.drizzle.team/).

This step is optional, but required for authentication and blockchain operations.

We are supporting three categories of databases:

- Ordinary databases
- Blockchain databases
- Local Blockchain databases on the ORB (or any other) device

### Drizzle setup

Drizzle setup is located in the `drizzle.config.ts` file. Configure it for your database setup.

Schemas are located in the `src/schemas` directory. You can add your own schema files. Blockchain schemas are located in the `src/schemas/bch` directory.

### Blockchain databases

You can use SQLite, Postgres database, or any other supported by Drizzle. The database setup is defined in the `.env` file prefixed with `BCH_DB_`.

Blockchain data are parsed by oracle, which you can deploy.

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

## Security

About Platform Environment Variables:

- Platform environment variables are stored in the `wrangler.toml` file.
- These variables are accessible in server-side code except those that are prefixed with `PUBLIC_`.

### Local environment variables

We can access local environment variables using the `env` function. This function is used to read the environment variables from the `.env` file. Any value is returned as `string`.

## Contributing

Contributions are welcome! For feature requests, bug reports, or questions, please [open an issue](https://github.com/bchainhub/dapp-sveltekit-boilerplate/issues).

## License

This project is open source and available under the [CORE License](LICENSE).
