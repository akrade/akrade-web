import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

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

    const { email, source = 'website' } = data;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert into database
    const { data: subscriber, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email.toLowerCase().trim(),
          source,
          metadata: {
            user_agent: request.headers.get('user-agent'),
            referrer: request.headers.get('referer')
          }
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Handle duplicate email
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Email already subscribed' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // Return detailed error for debugging
      return new Response(
        JSON.stringify({
          error: 'Database error',
          details: error.message,
          code: error.code
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Optional: Trigger CRM sync here
    // await syncToCRM(subscriber.email);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed!'
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