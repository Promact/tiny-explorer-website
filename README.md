# Tiny Explorer Frontend

This is the frontend application for **Tiny Explorer**, an e-commerce platform for baby products. It is built using **Astro**, **React**, and **Tailwind CSS**.

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Environment Setup

Before starting the project, you need to configure the environment variables.

1. **Create Local Environment File**
    Copy the template file to create your local environment file:

    ```bash
    cp env.template .env.local
    ```

2. **Strapi Setup**
    - **`STRAPI_URL`**: The URL where your Strapi backend is running (default: `http://localhost:1337`).
    - **`STRAPI_TOKEN`**: Generate an API token in your Strapi Admin Panel:
        1. Go to **Settings** > **Global Settings** > **API Tokens**.
        2. Click **Create new API Token**.
        3. Name it (e.g., "Frontend"), select **Full Access** (or Custom with appropriate permissions), and save.
        4. Copy the generated token and paste it as the value for `STRAPI_TOKEN`.

3. **Medusa Setup**
    - **`PUBLIC_MEDUSA_BACKEND_URL`**: The URL of your Medusa backend (e.g., `http://localhost:9000` or your deployed URL).
    - **`PUBLIC_MEDUSA_PUBLISHABLE_KEY`**: Generate a publishable API key in your Medusa Admin:
        1. Go to **Settings** > **Publishable API Keys**.
        2. Click **Create API Key**.
        3. Give it a title (e.g., "Storefront") and create it.
        4. Copy the key (starts with `pk_...`) and paste it as the value for `PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
        5. *Important*: Ensure you associate this key with the necessary Sales Channels in the Medusa settings.

## Getting Started

All commands are run from the root of this project (`tiny-explorer-fe`).

### Installation

```bash
pnpm install
```

### Development

To start the local development server:

```bash
pnpm run dev
```

The site will be available at `http://localhost:4321`.

### Build

To build the project for production:

```bash
pnpm run build
```

The output will be in the `dist/` directory.

### Preview

To preview the production build locally:

```bash
pnpm run preview
```

## Project Structure

```text
/
├── public/           # Static assets (images, fonts, etc.)
├── src/
│   ├── assets/       # Imported assets
│   ├── components/   # React and Astro components
│   ├── layouts/      # Page layouts
│   ├── pages/        # File-based routing
│   └── styles/       # Global styles (if any)
└── package.json
```
