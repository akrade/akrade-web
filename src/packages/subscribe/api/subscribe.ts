import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import { sendConfirmationEmail } from '@/utils/email/sendConfirmationEmail';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Initialize Supabase client - use service role key for server-side operations
    const supabaseUrl = process.env.AKRADE_PUBLIC_SUPABASE_URL || import.meta.env.AKRADE_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.AKRADE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.AKRADE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body - use json() instead of text() + JSON.parse()
    let data;
    try {
      // Clone the request first in case body was already read
      const clonedRequest = request.clone();
      data = await clonedRequest.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalize = (value: unknown) =>
      typeof value === 'string' ? value.trim() : undefined;

    const {
      email,
      source = 'website',
      full_name,
      company_name,
      role,
      consent,
      consent_copy,
      form_url,
      // Accept alt keys from BusyFolk form payload
      name,
      company
    } = data || {};

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanFullName = normalize(full_name ?? name);
    const cleanCompany = normalize(company_name ?? company);
    const cleanRole = normalize(role);
    const consentCopy =
      typeof consent_copy === 'string' && consent_copy.trim().length > 0
        ? consent_copy.trim()
        : 'I agree to receive the newsletter and occasional updates.';
    const formUrl =
      typeof form_url === 'string' && form_url.trim().length > 0
        ? form_url.trim()
        : request.headers.get('referer') || undefined;
    const ipHeader =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('true-client-ip') ||
      '';
    const clientIp = ipHeader.split(',')[0]?.trim() || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;
    const origin = request.headers.get('origin') || process.env.AKRADE_SITE_URL || import.meta.env.AKRADE_SITE_URL || '';

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (consent !== true) {
      return new Response(
        JSON.stringify({ error: 'Consent required before subscribing' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for existing subscriber
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id,status')
      .eq('email', cleanEmail)
      .maybeSingle();

    const token = crypto.randomUUID();
    const now = new Date().toISOString();

    const payload = {
      email: cleanEmail,
      full_name: cleanFullName || null,
      company_name: cleanCompany || null,
      role: cleanRole || null,
      source,
      status: existing?.status === 'confirmed' ? 'confirmed' : 'pending',
      subscribed_at: existing?.subscribed_at || now,
      confirmation_token: token,
      confirmation_sent_at: now,
      form_url: formUrl,
      consent_copy: consentCopy,
      metadata: {
        user_agent: userAgent,
        referrer: request.headers.get('referer'),
        ip: clientIp
      }
    };

    // Upsert to avoid duplicate-key errors while refreshing pending records
    const { error: upsertError } = await supabase
      .from('newsletter_subscribers')
      .upsert(payload, { onConflict: 'email' });

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError);
      return new Response(
        JSON.stringify({ error: 'Database error', details: upsertError.message, code: upsertError.code }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      await sendConfirmationEmail({
        to: cleanEmail,
        token,
        origin,
        consentCopy,
        formUrl
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send confirmation email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Almost done! Check your inbox to confirm your subscription.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({
        error: 'Failed to subscribe',
        debug: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
