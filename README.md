# Akradé Website

Company website for Akradé — an AI-forward product strategy and human-centered design practice.

## Tech Stack

- **[Astro](https://astro.build) v5.16.0** — Meta-framework for static site generation
- **[React](https://react.dev) v19.2.0** — UI library for interactive components
- **CSS + Sass** — Modern CSS with custom properties and `@layer` architecture
- **[Supabase](https://supabase.com)** — Backend and database
- **Vercel** — Deployment platform with analytics

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
├── components/              # Organized component library
│   ├── ui/                 # Pure, reusable UI components
│   ├── layout/             # Site-wide layout components
│   ├── features/           # Feature-specific components
│   ├── analytics/          # Third-party analytics integrations
│   └── seo/                # SEO and structured data components
│
├── layouts/                # Page layout templates
│   ├── BaseLayout.astro
│   ├── PageLayout.astro
│   └── LegalLayout.astro
│
├── pages/                  # File-based routing
│   ├── index.astro
│   ├── about.astro
│   ├── services.astro
│   ├── contact.astro
│   ├── api/               # API endpoints
│   └── legal/             # Legal pages
│
├── packages/               # Self-contained feature packages
│   ├── subscribe/          # Newsletter subscription
│   ├── slide-panel/        # Slide-in panel component
│   └── grainy-film/        # Grainy film visual effect
│
├── styles/                 # Global styles and design system
│   ├── foundation/         # Layers, tokens, reset, animations
│   └── base/              # Typography, layout, themes
│
└── utils/                  # Utility functions and helpers
```

## Component Organization

Components are organized by their purpose and scope:

### UI Components (`/src/components/ui/`)
Pure, reusable components with no business logic. Can be used anywhere in the app.
- `FloatingLabelInput.astro` - Material Design 3 floating label text input
- `FloatingLabelSelect.astro` - Material Design 3 floating label select
- `FloatingLabelCheckbox.astro` - Material Design 3 checkbox

**Usage:**
```astro
import { FloatingLabelInput } from '@/components/ui';
```

### Layout Components (`/src/components/layout/`)
Site-wide structural components used in layouts or multiple pages.
- `Header.astro` - Site navigation
- `Footer.astro` - Site footer

**Usage:**
```astro
import { Header, Footer } from '@/components/layout';
```

### Feature Components (`/src/components/features/`)
Domain-specific components tied to particular features.
- `ScheduleCallPanel.astro` - Cal.com scheduling widget
- `BusyFolkNewsletterPanel.astro` - Newsletter panel for BusyFolk
- `NewsletterSignup.tsx` - React newsletter signup form

**Usage:**
```astro
import { ScheduleCallPanel } from '@/components/features';
```

### Analytics Components (`/src/components/analytics/`)
Third-party service integrations for tracking and monitoring.
- `GoogleAnalytics.astro` - Google Analytics with consent mode
- `Clarity.astro` - Microsoft Clarity
- `CookieConsent.astro` - Cookie consent banner

### SEO Components (`/src/components/seo/`)
SEO optimization components.
- `Schema.astro` - JSON-LD structured data

### Packages (`/src/packages/`)
Self-contained feature modules with their own components, styles, and logic. Each package includes its own README and can be extracted to npm packages in the future.

**Usage:**
```astro
import { NewsletterForm } from '@/packages/subscribe';
import { SlidePanel } from '@/packages/slide-panel';
import { GrainyFilm } from '@/packages/grainy-film';
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