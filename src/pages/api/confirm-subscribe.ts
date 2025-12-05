import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token')?.trim();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing confirmation token' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    const { data: existing, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('id,status,confirmed_at,metadata')
      .eq('confirmation_token', token)
      .maybeSingle();

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!existing) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (existing.status === 'confirmed') {
      return new Response(
        JSON.stringify({ success: true, message: 'Already confirmed.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ipHeader =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('true-client-ip') ||
      '';
    const clientIp = ipHeader.split(',')[0]?.trim() || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: now,
        confirmation_token: null,
        metadata: {
          ...(existing.metadata || {}),
          confirm_ip: clientIp,
          confirm_user_agent: userAgent
        }
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to confirm subscription' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Subscription confirmed!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Confirmation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to confirm subscription' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
