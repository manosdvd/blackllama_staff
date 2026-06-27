import { supabaseAdmin, verifyAuth, isAdmin, corsHeaders, respond } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const params = new URLSearchParams(event.rawQuery || '');
  const slug = params.get('slug');

  // ── GET: Fetch wiki pages ───────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    if (slug) {
      // Get single page
      const { data: page, error: pageError } = await supabaseAdmin
        .from('wiki_pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (pageError) {
        return respond(404, { error: 'Wiki page not found' });
      }

      // Fetch revisions for this page
      const { data: revisions, error: revError } = await supabaseAdmin
        .from('wiki_revisions')
        .select('*')
        .eq('slug', slug)
        .order('revision_no', { ascending: false });

      return respond(200, { page, revisions: revisions || [] });
    } else {
      // Get all pages (with basic fields for directory list)
      const { data: pages, error: pagesError } = await supabaseAdmin
        .from('wiki_pages')
        .select('slug, title, category, tags, updated_at, updated_by, revision_no')
        .order('title', { ascending: true });

      if (pagesError) {
        return respond(500, { error: pagesError.message });
      }
      return respond(200, { pages });
    }
  }

  // ── POST: Create/Update wiki page (Staff and Admin only) ─────────────
  if (event.httpMethod === 'POST') {
    const profile = await verifyAuth(event);
    if (!profile) return respond(401, { error: 'Unauthorized' });
    
    // Candidates cannot write/edit wiki pages
    const isCandidate = profile.role === 'Candidate';
    if (isCandidate) return respond(403, { error: 'Permission denied. Candidates cannot edit the handbook.' });

    let body;
    try {
      body = JSON.parse(event.body);
    } catch {
      return respond(400, { error: 'Invalid JSON' });
    }

    const pageSlug = body.slug || slug;
    const { title, content, category, tags } = body;

    if (!pageSlug || !title || !content || !category) {
      return respond(400, { error: 'Missing required fields: slug, title, content, category' });
    }

    // Check if page already exists to handle revisions
    const { data: existingPage } = await supabaseAdmin
      .from('wiki_pages')
      .select('*')
      .eq('slug', pageSlug)
      .maybeSingle();

    let newRevisionNo = 1;
    if (existingPage) {
      newRevisionNo = (existingPage.revision_no || 1) + 1;
    }

    // Upsert the page
    const { data: savedPage, error: saveError } = await supabaseAdmin
      .from('wiki_pages')
      .upsert({
        slug: pageSlug,
        title,
        content,
        category,
        tags: tags || [],
        updated_at: new Date().toISOString(),
        updated_by: profile.username,
        revision_no: newRevisionNo
      })
      .select()
      .single();

    if (saveError) {
      return respond(500, { error: saveError.message });
    }

    // Create a revision record
    const { error: revError } = await supabaseAdmin
      .from('wiki_revisions')
      .insert({
        slug: pageSlug,
        title,
        content,
        updated_at: new Date().toISOString(),
        updated_by: profile.username,
        revision_no: newRevisionNo
      });

    if (revError) {
      console.error('Failed to create wiki revision log:', revError);
    }

    return respond(200, savedPage);
  }

  // ── DELETE: Delete wiki page (Admin only) ───────────────────────────
  if (event.httpMethod === 'DELETE') {
    const profile = await verifyAuth(event);
    if (!profile) return respond(401, { error: 'Unauthorized' });
    if (!isAdmin(profile)) return respond(403, { error: 'Admin access required to delete pages.' });

    if (!slug) {
      return respond(400, { error: 'Slug parameter is required' });
    }

    const { error } = await supabaseAdmin
      .from('wiki_pages')
      .delete()
      .eq('slug', slug);

    if (error) {
      return respond(500, { error: error.message });
    }

    return respond(200, { success: true, message: `Page '${slug}' deleted.` });
  }

  return respond(405, { error: 'Method not allowed' });
};
