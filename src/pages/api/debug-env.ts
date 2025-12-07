import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const envCheck = {
    AKRADE_SMTP_HOST: !!(process.env.AKRADE_SMTP_HOST || (import.meta as any).env?.AKRADE_SMTP_HOST),
    AKRADE_SMTP_PORT: !!(process.env.AKRADE_SMTP_PORT || (import.meta as any).env?.AKRADE_SMTP_PORT),
    AKRADE_SMTP_USER: !!(process.env.AKRADE_SMTP_USER || (import.meta as any).env?.AKRADE_SMTP_USER),
    AKRADE_SMTP_PASS: !!(process.env.AKRADE_SMTP_PASS || (import.meta as any).env?.AKRADE_SMTP_PASS),
    AKRADE_SMTP_FROM: !!(process.env.AKRADE_SMTP_FROM || (import.meta as any).env?.AKRADE_SMTP_FROM),
    AKRADE_PUBLIC_SUPABASE_URL: !!(process.env.AKRADE_PUBLIC_SUPABASE_URL || (import.meta as any).env?.AKRADE_PUBLIC_SUPABASE_URL),
    AKRADE_SUPABASE_SERVICE_ROLE_KEY: !!(process.env.AKRADE_SUPABASE_SERVICE_ROLE_KEY || (import.meta as any).env?.AKRADE_SUPABASE_SERVICE_ROLE_KEY),
  };

  // Also show first 3 chars of SMTP_HOST to verify it's the right one
  const smtpHostPreview = (process.env.AKRADE_SMTP_HOST || (import.meta as any).env?.AKRADE_SMTP_HOST)?.substring(0, 10) + '...';

  return new Response(
    JSON.stringify({
      environment: process.env.NODE_ENV || 'unknown',
      variables: envCheck,
      smtp_host_preview: smtpHostPreview,
      all_set: Object.values(envCheck).every(v => v === true)
    }, null, 2),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
