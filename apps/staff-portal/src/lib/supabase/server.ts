import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Private key: Only available on the server (Vite/Next.js will not bundle it to the client)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Server-side Supabase environment variables are missing.');
}

/**
 * Creates a standard server-side Supabase client for Server Components/Route Handlers.
 */
export function createServerClient() {
  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
  );
}

/**
 * Creates an administrative server-side Supabase client bypassing RLS.
 * WARNING: Never import or run this on the client. It uses the private Service Role Key.
 */
export function createAdminClient() {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined. Admin client cannot be initialized.');
  }
  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseServiceKey
  );
}
