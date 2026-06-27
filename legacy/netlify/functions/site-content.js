import { supabaseAdmin, verifyAuth, isAdmin, corsHeaders, respond } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const params = new URLSearchParams(event.rawQuery || '');
  const key = params.get('key');

  // ── GET: Retrieve content block(s) (Publicly accessible) ────────────────
  if (event.httpMethod === 'GET') {
    if (key) {
      const { data, error } = await supabaseAdmin
        .from('site_content')
        .select('*')
        .eq('key', key)
        .single();

      if (error) {
        // Return 404 or empty success so frontend knows to use fallbacks
        return respond(200, { key, content: null });
      }
      return respond(200, data);
    } else {
      const { data, error } = await supabaseAdmin
        .from('site_content')
        .select('*');

      if (error) return respond(500, { error: error.message });
      return respond(200, { contentBlocks: data });
    }
  }

  // ── POST/PUT: Update/Insert custom content block (Admin only) ─────────────
  if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
    const profile = await verifyAuth(event);
    if (!profile) return respond(401, { error: 'Unauthorized' });
    if (!isAdmin(profile)) return respond(403, { error: 'Admin access required' });

    let body;
    try { body = JSON.parse(event.body); } catch { return respond(400, { error: 'Invalid JSON' }); }

    const blockKey = body.key || key;
    if (!blockKey || !body.content) {
      return respond(400, { error: 'Key and content are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('site_content')
      .upsert({
        key: blockKey,
        content: body.content,
        updated_at: new Date().toISOString(),
        updated_by: profile.username
      })
      .select()
      .single();

    if (error) return respond(500, { error: error.message });
    return respond(200, data);
  }

  return respond(405, { error: 'Method not allowed' });
};
