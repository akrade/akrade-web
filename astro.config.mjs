import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://akrade.com',
  integrations: [
    sitemap()
  ],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      headers: {
        'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com;"
      }
    }
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  })
});
