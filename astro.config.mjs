import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://akrade.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/admin/') && !page.includes('/draft/')
    })
  ],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      // Optimize JavaScript output with esbuild (faster than terser, built-in)
      minify: 'esbuild',
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            vendor: ['astro']
          }
        }
      },
      // Asset optimization
      assetsInlineLimit: 4096, // Inline assets smaller than 4KB
      cssCodeSplit: true, // Enable CSS code splitting
      cssMinify: true, // Minify CSS
      reportCompressedSize: true, // Report compressed size
      sourcemap: false // Disable sourcemaps in production for smaller files
    },
    server: {
      host: true,
      allowedHosts: ['akrade.local'],
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
