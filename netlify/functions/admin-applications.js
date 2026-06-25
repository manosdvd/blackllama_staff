/**
 * Admin-only endpoint for application management.
 *
 * GET    /api/admin-applications                 — List all applications
 * PATCH  /api/admin-applications?id=<uuid>       — Update application status (Approved/Rejected)
 *
 * Users submit their own applications via a separate endpoint or
 * via the Supabase client with RLS (user can INSERT their own row).
 */
import { supabaseAdmin, verifyAuth, isAdmin, corsHeaders, respond } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // ── GET with user token: return only the current user's application ────────
  // ── Admin GET: return all applications ────────────────────────────────────
  if (event.httpMethod === 'GET') {
    const profile = await verifyAuth(event);
    if (!profile) return respond(401, { error: 'Unauthorized' });

    if (isAdmin(profile)) {
      // Admin: return all
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) return respond(500, { error: error.message });
      return respond(200, { applications: data });
    } else {
      // Regular user: return only their own
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*')
        .eq('user_id', profile.id)
        .order('submitted_at', { ascending: false });

      if (error) return respond(500, { error: error.message });
      return respond(200, { applications: data });
    }
  }

  // ── POST: Submit a new application (any authenticated user) ───────────────
  if (event.httpMethod === 'POST') {
    const profile = await verifyAuth(event);
    if (!profile) return respond(401, { error: 'Unauthorized' });

    let body;
    try { body = JSON.parse(event.body); } catch { return respond(400, { error: 'Invalid JSON' }); }

    // Check for existing application
    const { data: existing } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('user_id', profile.id)
      .single();

    if (existing) {
      return respond(409, { error: 'You already have a submitted application.' });
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert({
        user_id: profile.id,
        username: profile.username,
        status: 'Pending',
        form_data: body.formData || {}
      })
      .select()
      .single();

    if (error) return respond(500, { error: error.message });
    return respond(201, { application: data });
  }

  // ── PATCH: Admin updates application status ───────────────────────────────
  if (event.httpMethod === 'PATCH') {
    const profile = await verifyAuth(event);
    if (!profile) return respond(401, { error: 'Unauthorized' });
    if (!isAdmin(profile)) return respond(403, { error: 'Admin access required' });

    const params = new URLSearchParams(event.rawQuery || '');
    const appId = params.get('id');
    if (!appId) return respond(400, { error: 'Missing ?id= parameter' });

    let body;
    try { body = JSON.parse(event.body); } catch { return respond(400, { error: 'Invalid JSON' }); }

    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(body.status)) {
      return respond(400, { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({
        status: body.status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: profile.username
      })
      .eq('id', appId)
      .select()
      .single();

    if (error) return respond(500, { error: error.message });
    return respond(200, { application: data });
  }

  return respond(405, { error: 'Method not allowed' });
};
