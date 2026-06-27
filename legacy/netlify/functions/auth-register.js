/**
 * POST /api/auth-register
 * Body: { username, password, role }
 * Creates a new Supabase Auth user + profile row.
 */
import { supabaseAdmin, corsHeaders, respond } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return respond(400, { error: 'Invalid JSON body' });
  }

  const { username, password, role = 'Candidate' } = body;

  if (!username || !password) {
    return respond(400, { error: 'Username and password are required' });
  }

  if (password.length < 8) {
    return respond(400, { error: 'Password must be at least 8 characters' });
  }

  const normalizedUsername = username.trim().toLowerCase();

  // Check username uniqueness
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('username', normalizedUsername)
    .single();

  if (existing) {
    return respond(409, { error: 'Username already taken' });
  }

  // Create the auth user using email-as-username pattern
  const syntheticEmail = `${normalizedUsername}@camplawton.internal`;

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: syntheticEmail,
    password,
    email_confirm: true,  // Skip email confirmation
    user_metadata: {
      username: username.trim(),
      role
    }
  });

  if (authError) {
    console.error('Auth create error:', authError);
    return respond(500, { error: authError.message });
  }

  // Sign in immediately to get session tokens
  const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
    email: syntheticEmail,
    password
  });

  if (signInError) {
    return respond(500, { error: 'Account created but sign-in failed. Please log in manually.' });
  }

  const profile = {
    id: authData.user.id,
    username: username.trim(),
    role
  };

  return respond(201, {
    user: profile,
    session: {
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
      expires_at: signInData.session.expires_at
    }
  });
};
