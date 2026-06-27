/**
 * Shared Supabase Admin client for Netlify Functions.
 * Uses the SERVICE ROLE KEY — never expose this to the browser.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required Supabase environment variables. See SETUP.md.');
}

/** Admin client — bypasses Row-Level Security. Only for server-side use. */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

/** Anon client — respects Row-Level Security. Used for verifying user JWTs. */
export const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

/** Standard CORS headers for all function responses */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

/** Helper to send a JSON response */
export function respond(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  };
}

/**
 * Verifies the Authorization Bearer token and returns the user profile.
 * Returns null if invalid or expired.
 */
export async function verifyAuth(event) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabaseAnon.auth.getUser(token);
  if (error || !user) return null;

  // Fetch profile from our profiles table
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) return null;
  if (profile.status === 'inactive') return null;

  return { ...profile, email: user.email };
}

/** Check if a profile has admin-level access */
export function isAdmin(profile) {
  return ['Admin', 'Camp Director', 'Program Director'].includes(profile?.role);
}
