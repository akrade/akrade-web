import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [
    // your integrations here
  ],
  vite: {
    server: {
      headers: {
        'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com;"
      }
    }
  }
});