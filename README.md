# Tiny Explorer Frontend

This is the frontend application for **Tiny Explorer**, an e-commerce platform for baby products. It is built using **Astro**, **React**, and **Tailwind CSS**.

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

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

