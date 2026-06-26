/**
 * GET /api/auth-me
 * Header: Authorization: Bearer <access_token>
 * Validates the session and returns the current user profile.
 * Used on every page load to validate stored tokens.
 */
import { verifyAuth, corsHeaders, respond } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return respond(405, { error: 'Method not allowed' });
  }

  const profile = await verifyAuth(event);

  if (!profile) {
    return respond(401, { error: 'Unauthorized' });
  }

  return respond(200, {
    user: profile
  });
};
