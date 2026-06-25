/**
 * Admin-only endpoint for user management.
 *
 * GET    /api/admin-users              — List all users (with optional ?search= and ?role= filters)
 * PATCH  /api/admin-users?id=<uuid>   — Update role or status for a user
 * DELETE /api/admin-users?id=<uuid>   — Deactivate (soft-delete) a user
 */
import { supabaseAdmin, verifyAuth, isAdmin, corsHeaders, respond } from './_supabase.js';

const VALID_ROLES = [
  'Candidate', 'Staff', 'Scoutcraft', 'Nature', 'Shooting Sports',
  'Handicraft', 'CIT', 'Ranger', 'Medic', 'Program Director', 'Camp Director', 'Admin'
];

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // Verify admin auth
  const profile = await verifyAuth(event);
  if (!profile) return respond(401, { error: 'Unauthorized' });
  if (!isAdmin(profile)) return respond(403, { error: 'Forbidden: admin access required' });

  // ── GET: List all users ───────────────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    const params = new URLSearchParams(event.rawQuery || '');
    const search = params.get('search')?.toLowerCase() || '';
    const roleFilter = params.get('role') || '';
    const statusFilter = params.get('status') || '';
    const page = parseInt(params.get('page') || '1');
    const pageSize = 50;

    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (roleFilter) query = query.eq('role', roleFilter);
    if (statusFilter) query = query.eq('status', statusFilter);
    if (search) query = query.ilike('username', `%${search}%`);

    const { data, error, count } = await query;
    if (error) return respond(500, { error: error.message });

    return respond(200, { users: data, total: count, page, pageSize });
  }

  // ── PATCH: Update user role or status ─────────────────────────────────────
  if (event.httpMethod === 'PATCH') {
    const params = new URLSearchParams(event.rawQuery || '');
    const userId = params.get('id');
    if (!userId) return respond(400, { error: 'Missing ?id= parameter' });

    let body;
    try { body = JSON.parse(event.body); } catch { return respond(400, { error: 'Invalid JSON' }); }

    const updates = {};
    if (body.role !== undefined) {
      if (!VALID_ROLES.includes(body.role)) {
        return respond(400, { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` });
      }
      updates.role = body.role;
    }
    if (body.status !== undefined) {
      if (!['active', 'inactive'].includes(body.status)) {
        return respond(400, { error: 'status must be "active" or "inactive"' });
      }
      updates.status = body.status;
    }

    if (Object.keys(updates).length === 0) {
      return respond(400, { error: 'No valid fields to update (role, status)' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) return respond(500, { error: error.message });

    return respond(200, { user: data });
  }

  // ── DELETE: Deactivate a user ─────────────────────────────────────────────
  if (event.httpMethod === 'DELETE') {
    const params = new URLSearchParams(event.rawQuery || '');
    const userId = params.get('id');
    if (!userId) return respond(400, { error: 'Missing ?id= parameter' });

    // Soft delete: set status to inactive
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ status: 'inactive' })
      .eq('id', userId)
      .select()
      .single();

    if (error) return respond(500, { error: error.message });

    return respond(200, { user: data, message: 'User deactivated' });
  }

  return respond(405, { error: 'Method not allowed' });
};
