# Newsletter Subscription Package

A reusable, self-contained newsletter subscription package with React form component, API handler, and theming support. Easily deploy to any Astro site with minimal configuration.

## Features

- **React Component**: Pre-built form with state management and validation
- **API Handler**: Supabase-integrated backend with email validation
- **Theme Support**: Separates structural CSS from color theming
- **Analytics Ready**: Optional Google Analytics event tracking
- **User Feedback**: Loading, success, and error states with visual feedback
- **Accessible**: ARIA labels and semantic HTML
- **TypeScript**: Fully typed for better DX

## What's Included

```
src/packages/subscribe/
├── NewsletterForm.tsx          # React form component
├── newsletter.css              # Structural styles (layout, spacing)
├── api/
│   └── subscribe.ts            # API route handler
├── index.ts                    # Package exports
└── README.md                   # This file
```

## Installation

The package is already included in your project at `src/packages/subscribe/`.

## Prerequisites

### 1. Supabase Setup

Create a `newsletter_subscribers` table in your Supabase database:

```sql
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for email lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Add RLS policies (adjust as needed)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
```

### 2. Environment Variables

Add to `.env`:

```bash
AKRADE_PUBLIC_SUPABASE_URL=your_supabase_url
AKRADE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Dependencies

Ensure these are in your `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x",
    "react": "^18.x.x"
  }
}
```

## Usage

### 1. Add the API Route

Copy the API handler to `/src/pages/api/subscribe.ts`:

```bash
cp src/packages/subscribe/api/subscribe.ts src/pages/api/subscribe.ts
```

**Note**: Due to Astro API route limitations with request body handling, the handler code must be copied directly rather than re-exported. This ensures the request stream is properly consumed.

### 2. Import the Component

In your Astro component (e.g., Footer):

```astro
---
import { NewsletterForm } from '@/packages/subscribe';
import '@/packages/subscribe/newsletter.css';
---

<div class="newsletter-section">
  <h3>Sign Up for Our Newsletter</h3>
  <NewsletterForm client:load />
</div>
```

### 3. Add Theme Colors

Add newsletter colors to your theme files:

**Dark Theme** (`theme-dark.css`):
```css
[data-theme="dark"] .newsletter-form {
  border-bottom-color: var(--color-muted);
}

[data-theme="dark"] .newsletter-input {
  color: var(--color-text);
}

[data-theme="dark"] .newsletter-input::placeholder {
  color: var(--color-muted);
}

[data-theme="dark"] .newsletter-submit {
  color: var(--color-text);
}

[data-theme="dark"] .newsletter-submit:hover {
  color: var(--color-accent-secondary);
}

/* Success/Error States */
[data-theme="dark"] .newsletter-input.success {
  color: #10b981;
}

[data-theme="dark"] .newsletter-input.error {
  color: #ef4444;
}

[data-theme="dark"] .newsletter-submit.success {
  color: #10b981;
}

[data-theme="dark"] .newsletter-submit.error {
  color: #ef4444;
}
```

**Light Theme** (`theme-light.css`):
```css
[data-theme="light"] .newsletter-form {
  border-bottom-color: var(--color-bronze);
}

[data-theme="light"] .newsletter-input {
  color: var(--color-charcoal);
}

[data-theme="light"] .newsletter-input::placeholder {
  color: var(--color-muted);
}

[data-theme="light"] .newsletter-submit {
  color: var(--color-bronze);
}

[data-theme="light"] .newsletter-submit:hover {
  color: var(--color-text);
}

/* Success/Error States */
[data-theme="light"] .newsletter-input.success {
  color: #059669;
}

[data-theme="light"] .newsletter-input.error {
  color: #dc2626;
}

[data-theme="light"] .newsletter-submit.success {
  color: #059669;
}

[data-theme="light"] .newsletter-submit.error {
  color: #dc2626;
}
```

## Component Props

The `NewsletterForm` component accepts no props but can be customized via CSS.

## API Endpoint

### POST `/api/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com",
  "source": "footer"  // optional, defaults to "website"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Successfully subscribed!"
}
```

**Error Responses:**
- `400`: Invalid email format
- `409`: Email already subscribed
- `500`: Server error

## Form States

The component has four states:

1. **Idle**: Default state, ready for input
2. **Loading**: Submitting to API (shows spinner: ◌)
3. **Success**: Subscription successful (shows checkmark: ✓)
4. **Error**: Submission failed (shows X: ✕)

States auto-reset after 5 seconds.

## Analytics Integration

The component includes optional Google Analytics tracking:

```typescript
// Automatically tracks when user subscribes
gtag('event', 'newsletter_signup', {
  email_domain: 'example.com',  // Only domain, not full email
  source: 'footer'
});
```

Tracking only fires if `window.gtag` exists.

## Customization

### Change Submit Button Icons

Edit `NewsletterForm.tsx`:

```tsx
{status === 'loading' ? '⏳' : status === 'success' ? '✅' : status === 'error' ? '❌' : '➡️'}
```

### Change Auto-Reset Timing

Edit the timeout in `NewsletterForm.tsx`:

```tsx
setTimeout(() => {
  setStatus('idle');
  setMessage('');
}, 3000);  // 3 seconds instead of 5
```

### Custom Error Messages

Modify the API handler in `api/subscribe.ts`:

```typescript
return new Response(
  JSON.stringify({ error: 'Custom error message' }),
  { status: 400, headers: { 'Content-Type': 'application/json' } }
);
```

### Styling

The package separates structure from theming:

- **Structure**: `newsletter.css` (layout, spacing, animations)
- **Colors**: Your theme files (text color, borders, states)

This allows the same component to work across different design systems.

## Database Schema Details

The `metadata` JSONB field stores:
- `user_agent`: Browser/device information
- `referrer`: Page URL where signup occurred

Use this for analytics and understanding signup sources:

```sql
-- See which browsers are most common
SELECT
  metadata->>'user_agent' as browser,
  COUNT(*) as signups
FROM newsletter_subscribers
GROUP BY browser
ORDER BY signups DESC;
```

## Deployment to Another Site

1. **Copy the package folder** to your new project
2. **Install dependencies**: `@supabase/supabase-js`, `react`
3. **Set up Supabase** with the table schema above
4. **Add environment variables** to `.env`
5. **Create API route** at `/pages/api/subscribe.ts`
6. **Import component** where needed
7. **Add theme colors** to your CSS

That's it! The package is fully self-contained.

## Security Considerations

- Uses **service role key** server-side only (never exposed to client)
- **Email validation** on both client and server
- **SQL injection protection** via Supabase parameterized queries
- **Rate limiting** should be added at the infrastructure level (Vercel, Cloudflare, etc.)

## Future Enhancements

Potential additions:
- Double opt-in email confirmation
- Unsubscribe functionality
- Admin dashboard for managing subscribers
- Export subscribers to CSV
- Integration with email services (Mailchimp, SendGrid, etc.)
- Rate limiting built into API handler

## Troubleshooting

### "Server configuration error"

- Check environment variables are set correctly
- Verify Supabase URL and service role key are valid

### "Database error"

- Verify the `newsletter_subscribers` table exists
- Check RLS policies aren't blocking inserts
- Ensure service role key has proper permissions

### Form not submitting

- Open browser console to see network errors
- Verify `/api/subscribe` route is accessible
- Check React component is loaded with `client:load`

### Styles not applying

- Ensure `newsletter.css` is imported
- Check theme colors are defined
- Inspect element to see which styles are applied

## Support

For issues specific to this package, check:
- API route handler was copied (not re-exported) to `/src/pages/api/subscribe.ts`
- Supabase credentials are valid
- Database table schema matches documentation
- Component is loaded with `client:load` directive