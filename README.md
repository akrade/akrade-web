# Akradé Website

Company website for Akradé — an AI-forward product strategy and human-centered design practice.

## Tech Stack

- [Astro](https://astro.build) — Static site generator
- Vanilla CSS — No frameworks, just clean styles

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/
│   ├── Header.astro
│   └── Footer.astro
├── layouts/
│   └── BaseLayout.astro
└── pages/
    └── index.astro
```

## Deployment

Build the site and deploy the `dist/` folder to any static host:

```bash
pnpm build
```

Recommended hosts: Vercel, Netlify, Cloudflare Pages

## Contact

**Email:** hello@akrade.com  
**Location:** Atlanta, Georgia  
**Website:** [akrade.com](https://www.akrade.com)