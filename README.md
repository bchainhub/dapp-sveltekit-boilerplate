# SvelteKit Boilerplate WIP

This project is work-in-progress, then it can introduce any breaking changes. Please, use it with caution.

Welcome to the SvelteKit Boilerplate! This project provides a solid foundation for building web applications with SvelteKit, along with security features and compatibility with Cloudflare services.

## Features

- **[SvelteKit](https://kit.svelte.dev/)**: A framework for building fast, modern web applications.
- **[Typescript](https://www.typescriptlang.org/)**: Type-safe development with TypeScript integration.
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
- **[PostCSS](https://postcss.org/)**: Transform CSS with JavaScript plugins.
- **[ESLint](https://eslint.org/)**: Linting utility for identifying and reporting on patterns in JavaScript.
- **[Prettier](https://prettier.io/)**: Code formatter for maintaining consistent style.
- **[Auth.js](https://authjs.dev/)**: Authentication library for secure login functionality.
- **[Hono API](https://hono.dev/)**: Web framework for building fast web applications and APIs.
- **[Lucide icons](https://lucide.dev/)**: Beautiful and customizable icon set.
- **[blo identicons](https://github.com/bchainhub/blo)**: blo is a small and fast library to generate Blockchain identicons.
- **[ICAN / IBAN validation](https://github.com/bchainhub/ican.js)**: Validate international bank account numbers.
- **[Exchange Number Format](https://github.com/bchainhub/exchange-rounding)**: Utility for formatting and rounding exchange numbers.

## Compatibility

- **[CloudFlare Pages](https://developers.cloudflare.com/pages/)**: Deploy web applications directly to Cloudflare's global network.
- **[CloudFlare Functions API](https://developers.cloudflare.com/workers/)**: Build and deploy serverless functions.
- **[CloudFlare D1](https://developers.cloudflare.com/d1/)**: Database solution for Cloudflare applications.
- **[CloudFlare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)**: Key-Value storage for serverless applications.
- **[Cloudflare R2](https://developers.cloudflare.com/r2/)**: Cloudflare R2 Storage allows developers to store large amounts of unstructured data.

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

- `AUTH_SECRET`: Secret key for authentication.
- `LOGIN_MAX_AGE`: Login expiration time. Default is 24 hours.
- `DB_INIT`: Enable the functionality to initialize the database.
- `DB_CLEAN`: Enable functionality to clean the database.
- `DB_CLEAN_TOKEN`: Token for cleaning the database. This prevents for unauthorized cleaning.
- `NODE_VERSION`: Node.js version.

Environment variables are stored in the `.env` file. You can add your own environment variables to this file.

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID.
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token.
- `ENABLE_API`: Enable or disable the API.
- `ENABLE_AUTH`: Enable or disable authentication.
- `ONLY_ACTIVATED`: Enable or disable only activated users. This prevents not activated users to login. CorePass is sending activation request using Pipe.
- `ENABLE_FILE_ACCESS`: Enable or disable file access.
- `D1_NAMESPACE`: Cloudflare D1 namespace name.
- `KV_NAMESPACE`: Cloudflare KV namespace name.
- `R2_NAMESPACE`: Cloudflare R2 namespace name.
- `PASSKEY_DURATION`: Passkey expiration time.
- `CAPTURE_COUNTRY`: Capture country from CF pages, Netlify, Vercel. If enabled.
- `CAPTURE_CITY`: Capture city from CF pages, Netlify, Vercel. If enabled.

Generate the authentication secret key, cleaning token, JWT secret in secure way or using the following command:

```bash
openssl rand -base64 33
```

## API

Api is disabled by default. You can enable it by setting `ENABLE_API=true` in the `.env` filed. If you don't need the API, you can remove the `functions/` directory. It is good practice to disable the API in production environment if you don't need it as well as removing the folder.

Api is using Hono API framework. You can find more information in the [Hono API documentation](https://hono.dev/).

Api is versioned and the version is defined in the `functions/api/${version}/` folder, where `${version}` is the number of version. It is good practice to divide the versions in the folders.

## Styling

The project uses TailwindCSS for styling. You can customize the styles by editing the `tailwind.config.js` file.

Custom styles and variables are defined in the `src/css` directory. You can use [customization tool](https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima) to edit variables. We are using prefix `skc` for custom classes.

You can use tool to generate TailwindCSS colors: [TailwindCSS Color Generator](https://javisperez.github.io/tailwindcolorshades/) or [TailwindCSS Color Shades](https://www.tailwindshades.com/).

## Connection to D1

You can connect your application to Cloudflare D1 by setting the `D1_NAMESPACE` variable in the `.env` file. You can find the D1 namespace in the Cloudflare dashboard and bind it with your `D1_NAMESPACE` setup.

Make sure the `wrangler.toml` file is properly configured with the correct DB binding information.

## Connection to KV

You can connect your application to Cloudflare KV by setting the `KV_NAMESPACE` variable in the `.env` file. You can find the KV namespace in the Cloudflare dashboard and bind it with your `KV_NAMESPACE` setup.

Make sure the `wrangler.toml` file is properly configured with the correct KV binding information.

## Connection to R2

You can connect your application to Cloudflare R2 by setting the `R2_NAMESPACE` variable in the `.env` file or dashboard. You can find the R2 namespace in the Cloudflare dashboard and bind it with your `R2_NAMESPACE` setup.

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

## Authentication

The project uses Auth.js for authentication together with Passkey & CorePass.

Dependencies:

- Cloudflare D1 database.
- DB initialization process.
- Node.js version 20.9.0 or higher.
- CorePass if you would like to use Pipe - activation model.

Before first run of your application you need to:

- Create a new D1 database in the Cloudflare dashboard.
- Set the D1 namespace in the `wrangler.toml` file or dashboard.
- Initialize the D1 database with enabling `DB_INIT=true` in the `wrangler.toml` file or dashboard.
- Load the url: `yoururl.com/db/init` to initialize the seeding.
- Set the `DB_INIT=false` in the `wrangler.toml` file or dashboard. This is important to prevent the database initialization on every url access.

## Security

There is difference between access local environment variables and environment variables in Cloudflare.

Key points:

- Separate Management Systems: The environment variables for Cloudflare Workers and SvelteKit are managed separately and do not overlap. `platform.env` in Cloudflare Workers is not directly accessible to SvelteKit components or server-side logic.
- Deployment Context: When using SvelteKit, the environment variables accessed via `import { env } from '$env/dynamic/private';` are provided by the deployment environment's configuration. These could come from services like Vercel, Netlify, or other hosting providers that support environment variable management.
- No Cross-Access: SvelteKit does not have a built-in mechanism to directly access Cloudflare Workers' environment variables set via `wrangler.toml`. Similarly, Cloudflare Workers cannot directly access environment variables set up for a SvelteKit deployment.

About Platform Environment Variables:

- Platform environment variables are stored in the `wrangler.toml` file.
- These variables are accessible in server-side code except those that are prefixed with `PUBLIC_`.

### Local environment variables

We can access local environment variables using the `env` function. This function is used to read the environment variables from the `.env` file. Any value is returned as `string`.

```ts
import { env } from '$env/dynamic/private';
const secret = env.SECRET;
```

This is SvelteKit way of reading the environment variables.

### Cloudflare environment variables

We have helper function `genv` to read Cloudflare's environment variables. This function is used to read the environment variables directly from Cloudflare instead of the classic `.env` variables. `true` and `false` (not case sensitive) is returned as boolean value, all other values are returned as `string`.

```ts
import { genv } from from '$lib/helpers/genv';
const secret = genv(platform).SECRET;
```

## Management API

### Pipe (WIP)

- Update User using Pipe.

`POST /pipe`

Header:

- Content-Type: application/json
- Authorization: Bearer ${token}

Json body:

- `id`: Pipie ID w/o prefix `pipe-`
- `coreId`: Core ID

### DB / Initialize

- Initialize the D1 database.

`GET /db/init`

### DB / Clean Accounts (WIP)

- Clean all accounts non-active and older than one day.

`POST /db/cleanAccounts`

Header:

- Content-Type: application/json

Json body:

- `token`: Auth token for cleaning from environment variable.

## Error codes (WIP)

Err ID | Err Code | Category | Description
--- | --- | --- | ---
400 | 400.01 | Validation | Invalid request

## Contributing

Contributions are welcome! For feature requests, bug reports, or questions, please [open an issue](https://github.com/bchainhub/dapp-sveltekit-boilerplate/issues).

## License

This project is open source and available under the [Core License](LICENSE).
