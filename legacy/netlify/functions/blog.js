import { supabaseAdmin, verifyAuth, isAdmin, corsHeaders, respond } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // ── GET: List blog posts filtered by user role visibility ────────────────
  if (event.httpMethod === 'GET') {
    // Determine user role
    const profile = await verifyAuth(event);
    const userRole = profile?.role?.toLowerCase() || 'guest';
    const isUserAdmin = profile ? isAdmin(profile) : false;

    let query = supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: posts, error } = await query;
    if (error) return respond(500, { error: error.message });

    // Filter posts in JS based on visibility tags (handles flexible array matching safely)
    const filteredPosts = posts.filter(post => {
      if (isUserAdmin) return true; // Admins see all posts
      const vis = post.visibility || [];
      const visLower = vis.map(v => v.toLowerCase());
      
      if (visLower.includes('everyone')) return true;
      if (userRole !== 'guest') {
        if (visLower.includes(userRole)) return true;
        // Staff role wildcard matches specialized staff roles (e.g. Nature, Scoutcraft etc.)
        if (visLower.includes('staff') && userRole !== 'candidate') return true;
      }
      return false;
    });

    return respond(200, { posts: filteredPosts });
  }

  // ── POST: Create a blog post (Admin only) ───────────────────────────────
  if (event.httpMethod === 'POST') {
    const profile = await verifyAuth(event);
    if (!profile) return respond(401, { error: 'Unauthorized' });
    if (!isAdmin(profile)) return respond(403, { error: 'Admin access required' });

    let body;
    try { body = JSON.parse(event.body); } catch { return respond(400, { error: 'Invalid JSON' }); }

    if (!body.title || !body.content) {
      return respond(400, { error: 'Title and content are required' });
    }

    const visibility = Array.isArray(body.visibility) ? body.visibility : ['everyone'];

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        title: body.title,
        content: body.content,
        visibility,
        created_by: profile.username
      })
      .select()
      .single();

    if (error) return respond(500, { error: error.message });
    return respond(201, { post });
  }

  return respond(405, { error: 'Method not allowed' });
};
