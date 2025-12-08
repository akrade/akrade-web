# Copilot Instructions for Akradé Website

## Project Overview

Akradé is a marketing website for an AI-driven product strategy and design consultancy. It's built with **Astro 5** (static site generator), **vanilla CSS** (no frameworks), and **React** components for interactive features. Deployed on Vercel with analytics integration.

## Architecture & Tech Stack

### Core Stack
- **Astro 5**: Static site generator with partial React hydration
- **Vanilla CSS**: No Tailwind/Bootstrap; use design tokens via CSS custom properties
- **React 19**: Only for interactive components (`NewsletterSignup.tsx`, `FooterNewsletter.tsx`)
- **TypeScript**: Strict mode enabled; use type imports for Astro routes

### Key Integrations
- **Supabase**: Newsletter subscriber database (via `/api/subscribe` endpoint)
- **Vercel**: Hosting + Analytics + Speed Insights
- **Google Analytics**: Consent-based tracking with `gtag` events
- **Cal.com**: Schedule meeting embed (referenced in `ScheduleCallPanel`)
- **Radix UI Colors**: Design system tokens for accessible color scales

### Build & Deployment
- **Package Manager**: `pnpm` (workspace configured in `pnpm-workspace.yaml`)
- **Build Process**: `pnpm build` compiles Astro → `dist/` folder; SSR disabled for 100% static output
- **Optimization**: Manual chunk splitting, CSS code-split, esbuild minify, 4KB asset inline limit

## File Structure & Conventions

```
src/
├── components/         # Astro components + React interactive UI
├── layouts/           # BaseLayout.astro (global page wrapper)
├── pages/             # Astro file-based routing
│   ├── *.astro        # Page templates
│   └── api/           # Server endpoints (prerender: false for POST)
├── packages/          # Local npm-like packages (e.g., grainy-film)
├── styles/            # Global CSS with color tokens
└── utils/             # Shared TypeScript utilities
```

## Patterns & Conventions

### Styling
- **Design Tokens**: Use CSS custom properties in `src/styles/colors.css`
  - Dark theme (default): `--color-text`, `--color-bg-primary`, `--color-accent`
  - Light/neutral themes: Add `data-theme="light|neutral"` to `<html>`
  - No hardcoded colors; reference tokens instead
- **Per-component CSS**: Each Astro component imports its own `.css` file (e.g., `Header.astro` → `header.css`)
- **No Frameworks**: Don't add CSS frameworks; maintain Astro's vanilla CSS philosophy

### Components
- **Astro Components** (`.astro`): Page templates, layouts, static UI
- **React Components** (`.tsx`): Client-side interactivity only
  - Use `client:visible` or similar loading directives in Astro markup
  - Avoid unnecessary re-renders; memoize if needed
  - Example: `NewsletterSignup.tsx` handles form submission to `/api/subscribe`

### Server Routes (`src/pages/api/`)
- **API Routes**: Use Astro's `APIRoute` type; set `export const prerender = false`
- **Environment Variables**: Prefix with `AKRADE_` (e.g., `AKRADE_PUBLIC_SUPABASE_URL`)
- **Error Handling**: Return JSON responses with status codes (400, 409, 500)
- **Example**: `/api/subscribe` validates email, inserts into Supabase `newsletter_subscribers` table

### Astro Conventions
- **Props Interface**: Define `interface Props` at top of frontmatter for page/layout props
- **Data Attributes**: Use for styling state (e.g., `data-grainy-film`, `data-theme`)
- **Inline Scripts**: Use `<script is:inline>` for global interaction; avoid hydration overhead

### Navigation & Layout
- **Active Link Detection**: Use `Astro.url.pathname` to highlight current page (see `Header.astro`)
- **Mega Menu**: Hamburger toggle + overlay menu pattern (avoid micro-interactions)
- **Z-Index Management**: Carefully ordered (footer z-index adjusted when mega-menu opens)

## Developer Workflows

### Dev Server
```bash
pnpm dev --host        # Start dev server on local network
```

### Build & Analysis
```bash
pnpm build             # Build static site to dist/
pnpm build:analyze     # Build + show JS bundle sizes
pnpm preview           # Preview production build locally
```

### Environment Setup
- Copy `.env.example` → `.env.local` (not in repo; ask maintainer)
- Required vars: `AKRADE_PUBLIC_SUPABASE_URL`, `AKRADE_SUPABASE_SERVICE_ROLE_KEY`
- Google Analytics & Vercel keys auto-configured on deploy

### Analytics & Tracking
- **Google Analytics**: Cookie-consent controlled; use `gtag('event', ...)` for custom events
- **Vercel Web Analytics**: Automatic; configured in `astro.config.mjs`
- **Microsoft Clarity**: Loaded via `Clarity.astro`; no manual tracking needed

## Important Details

### Grainy Film Effect
- Optional visual effect controlled by `data-grainy-film` attribute on `<html>`
- Implemented in `src/packages/grainy-film/` (canvas-based noise + vignette)
- Include `<GrainyFilm />` in layout to enable; pass `data-grainy-film="true"` to layout prop

### Newsletter Subscription

#### Data Flow
- Flow: React form (`NewsletterSignup.tsx`) → POST `/api/subscribe` → Supabase insert → response message
- Duplicate email handling: Returns 409 status (PostgreSQL unique constraint violation on `email`)
- Tracks signup event in GA with email domain via `gtag('event', 'newsletter_signup', {email_domain: ...})`

#### Supabase Schema
The `newsletter_subscribers` table structure:
```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website',  -- 'homepage', 'footer', 'website', etc.
  metadata JSONB,                 -- stores user_agent, referrer from request headers
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast email lookups during duplicate checks
CREATE UNIQUE INDEX idx_newsletter_email ON newsletter_subscribers(LOWER(email));
```

#### API Implementation Details
- Uses service role key (`AKRADE_SUPABASE_SERVICE_ROLE_KEY`) for server-side operations
- Validates email with regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Normalizes email: `.toLowerCase().trim()` before insertion
- Captures metadata: user-agent and referrer from request headers for analytics
- Error responses: 400 (invalid email), 409 (duplicate), 500 (server error)

### Theming
- Three theme options via `data-theme` attribute: `dark` (default), `light`, `neutral`
- CSS custom properties switch automatically; no JavaScript needed
- Color contrast ensured by Radix UI color scales

## Common Pitfalls to Avoid

1. **Don't add CSS frameworks**: Maintain vanilla CSS + design tokens approach
2. **Don't hydrate all components**: Only use React for interactive UI; keep Astro static
3. **Don't hardcode colors**: Always reference `--color-*` custom properties
4. **Don't commit `.env`**: Use `.env.local` locally; secrets in Vercel dashboard
5. **Don't forget `prerender: false`**: API routes need this to stay dynamic
6. **Import paths**: Use `@/` alias (maps to `src/`) defined in `tsconfig.json`

## Deployment & Infrastructure

### Vercel Configuration
- **Hosting**: Deployed via `@astrojs/vercel` adapter (Vercel Functions for API routes)
- **Build Command**: `pnpm build` (outputs 100% static `dist/` folder + serverless function for `/api/*`)
- **Environment Variables**: Set in Vercel dashboard under project settings
  - `AKRADE_PUBLIC_SUPABASE_URL` (public; prefixed with `PUBLIC_` in Vercel)
  - `AKRADE_SUPABASE_SERVICE_ROLE_KEY` (secret; never exposed to client)
  - `AKRADE_GOOGLE_ANALYTICS_ID` (auto-configured)
  - `AKRADE_VERCEL_ANALYTICS_ID` (auto-configured)

### Cache Headers (`vercel.json`)
- **Static assets** (`.js`, `.css`, `.woff2`, images): `max-age=31536000, immutable` (1 year)
- **HTML pages**: `max-age=0, must-revalidate` (cache-busted on every deploy)
- **Security headers**: DENY X-Frame-Options, nosniff Content-Type, XSS-Protection enabled
- **Partytown scripts**: Immutable cache for third-party analytics (Google Analytics, Clarity)

### Deployment Workflow
1. **Push to `main`**: Triggers Vercel auto-deploy
2. **Build phase**: Astro compiles → static HTML + CSS code-split → esbuild minify
3. **Function deployment**: `/api/subscribe` becomes Vercel Serverless Function with Supabase connection
4. **Cache invalidation**: Automatic for HTML; assets versioned by esbuild hash
5. **Analytics**: Vercel Speed Insights + Web Analytics enabled in config

### Database Seeding & Maintenance
- Supabase project must have `newsletter_subscribers` table pre-created
- No automatic migrations; manage schema directly in Supabase SQL editor
- RLS (Row Level Security) not required; service role key bypasses policies
- Backups: Configured in Supabase dashboard (default: daily)

### Local Development vs Production
- **Local env** (`.env.local`): Uses `import.meta.env.*` in API route fallback
- **Production env**: Uses `process.env.*` from Vercel Functions runtime
- API route respects both patterns to support dev and production seamlessly

## BusyFolk Newsletter Panel (site-specific, slide-panel based)
- Component lives at `src/components/BusyFolkNewsletterPanel.astro` and wraps the shared `SlidePanel` package.
- Renders a branded BusyFolk form posting to `/api/subscribe` (same API as the main newsletter).
- Usage on any page/layout:
  ```astro
  ---
  import BusyFolkNewsletterPanel from '@/components/BusyFolkNewsletterPanel.astro';
  ---
  <BusyFolkNewsletterPanel />
  ```
- Open/close helpers are auto-generated from `id="busyfolk-newsletter"`: call `openBusyfolkNewsletterPanel()` or `closeBusyfolkNewsletterPanel()`.
- To wire a CTA to this panel, set `panelId="busyfolk-newsletter"` on `NewsletterForm` (CTA variant, `displayMode="panel"`), or call the helper directly from a button/link.
- Keep brand-specific copy/styling inside this component; don’t modify the shared slide-panel package.

## References

- **Astro Docs**: https://docs.astro.build
- **Radix UI Colors**: https://radix-ui.com/colors
- **Supabase JS SDK**: https://supabase.com/docs/reference/javascript/start
- **Vercel Adapter**: https://docs.astro.build/en/guides/integrations-guide/vercel/
- **Vercel.json Reference**: https://vercel.com/docs/projects/project-configuration
- **Deployment**: Site auto-deploys on push to `main` via Vercel

## Implementation Plan: High-Compliance Newsletter Form (DOI + Consent)

1) Schema (Supabase)
- Add/ensure columns on `newsletter_subscribers`: `status` (pending|confirmed), `confirmation_token` (uuid or hashed), `confirmation_sent_at`, `confirmed_at`, `subscribed_at` default now, `email` (unique lower), `full_name`, `company_name`, `role`, `source`, `form_url`, `user_agent`, `ip_address`, `consent_copy` (text), `metadata` (jsonb). Keep existing indexes on lower(email); add index on token for confirmation lookup.

2) Capture + validate (API)
- In `src/packages/subscribe/api/subscribe.ts` and `src/pages/api/subscribe.ts`: require a `consent` boolean; reject if false. Normalize email (trim/lower), optional fields (name/company/role), accept BusyFolk aliases. Record `form_url` from `request.headers.get('referer')`, `user_agent`, `ip_address` from `x-forwarded-for`/`cf-connecting-ip`. Persist `consent_copy` sent from client (the exact string shown). Insert row with `status='pending'`, generated `confirmation_token`, and `confirmation_sent_at`.

3) UI/UX (forms)
- `NewsletterForm.tsx` (CTA/inline/panel) and `BusyFolkNewsletterPanel.astro`: add required consent checkbox with explicit text + privacy link; disable submit until email is valid and consent is checked. Update headings/value prop to emphasize benefit/cadence; keep single-column mobile-friendly layout. CTA text outcome-focused.
- On submit success, show “Check your inbox to confirm” message (no final success yet).

4) Double opt-in flow
- Create `/api/confirm-subscribe` (Astro API) that accepts `token`: find pending row by token, set `status='confirmed'`, `confirmed_at=now()`, log confirm IP/UA, clear token. On failure, return friendly error.
- Add confirmation page `/confirm` (or similar) that calls the API and renders final success/invalid token states; link to it from the email.

5) Confirmation email
- Send immediately on subscribe using the API: templated email with a single high-contrast button linking to `/confirm?token=...`. Include fallback text URL. Use existing email provider (Supabase function/Edge Function or SMTP service).

6) Auditing
- Store: `status`, `subscribed_at`, `confirmation_sent_at`, `confirmed_at`, `form_url`, `source`, `ip_address`, `user_agent`, `consent_copy`, `email` (lower), optional profile fields, metadata. Do not send marketing until `status='confirmed'`.
- After confirmation, clear `confirmation_token` (keeps tokens from lingering). Auditing relies on `status`, timestamps, consent copy, form URL, and metadata, not the raw token. If long-term token proof is required, store a hashed token instead of the raw value.

## SMTP (SendGrid example)
- Env: `AKRADE_SMTP_HOST=smtp.sendgrid.net`, `AKRADE_SMTP_PORT=587` (or 2525 if blocked), `AKRADE_SMTP_USER=apikey`, `AKRADE_SMTP_PASS=<SendGrid API key>`, `AKRADE_SMTP_FROM=<verified sender>`, `AKRADE_SITE_URL=https://www.akrade.com`.
- The subscribe APIs send confirmation emails via SMTP; failures return a 500 with `Failed to send confirmation email`. Ensure the sender is verified and SPF/DKIM are set on the domain.

7) Testing
- Manual: submit with/without consent (expect rejection), invalid email, happy path pending + confirmation link + confirmed state, duplicate email (should return 409), BusyFolk form field mapping. Verify DB rows store consent text, form URL, IP, and status transitions. Automated: add API tests for validation and token confirmation.
