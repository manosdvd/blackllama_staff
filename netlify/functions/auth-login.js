/**
 * POST /api/auth-login
 * Body: { username, password }
 * Authenticates a user and returns session tokens.
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

  const { username, password } = body;

  if (!username || !password) {
    return respond(400, { error: 'Username and password are required' });
  }

  const normalizedUsername = username.trim().toLowerCase();
  const syntheticEmail = `${normalizedUsername}@camplawton.internal`;

  // Sign in via Supabase Auth
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: syntheticEmail,
    password
  });

  if (error) {
    // Generic message to avoid username enumeration
    return respond(401, { error: 'Invalid username or password' });
  }

  // Fetch profile to check status and role
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    return respond(500, { error: 'Failed to load user profile' });
  }

  if (profile.status === 'inactive') {
    return respond(403, { error: 'Your account has been deactivated. Contact an administrator.' });
  }

  return respond(200, {
    user: {
      id: profile.id,
      username: profile.username,
      role: profile.role,
      status: profile.status
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
    }
  });
};
