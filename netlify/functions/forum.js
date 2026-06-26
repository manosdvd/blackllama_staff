import { supabaseAdmin, verifyAuth, isAdmin, corsHeaders, respond } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // Verify auth
  const profile = await verifyAuth(event);
  if (!profile) return respond(401, { error: 'Unauthorized' });

  // Gating: Only Staff and Admins can access the forum
  const isUserAdmin = isAdmin(profile);
  const isUserStaff = profile.role !== 'Candidate';
  if (!isUserAdmin && !isUserStaff) {
    return respond(403, { error: 'Forbidden: forum access is limited to staff and admins' });
  }

  const params = new URLSearchParams(event.rawQuery || '');
  const postId = params.get('post_id');
  const commentId = params.get('comment_id');

  // ── GET: Fetch posts or comments ─────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    if (postId) {
      // Get single post with all its comments
      const { data: post, error: postErr } = await supabaseAdmin
        .from('forum_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (postErr) return respond(404, { error: 'Post not found' });

      const { data: comments, error: commErr } = await supabaseAdmin
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commErr) return respond(500, { error: commErr.message });
      return respond(200, { post, comments });
    } else {
      // Get list of all posts
      const { data: posts, error: postsErr } = await supabaseAdmin
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsErr) return respond(500, { error: postsErr.message });

      // Fetch comment counts for each post in parallel
      const postsWithCounts = await Promise.all(posts.map(async (post) => {
        const { count, error } = await supabaseAdmin
          .from('forum_comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        return {
          ...post,
          commentCount: error ? 0 : count
        };
      }));

      return respond(200, { posts: postsWithCounts });
    }
  }

  // ── POST: Create post or comment ────────────────────────────────────────
  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body); } catch { return respond(400, { error: 'Invalid JSON' }); }

    if (postId) {
      // Creating a COMMENT on a post
      if (!body.content?.trim()) {
        return respond(400, { error: 'Comment content cannot be empty' });
      }

      const { data: comment, error } = await supabaseAdmin
        .from('forum_comments')
        .insert({
          post_id: postId,
          content: body.content.trim(),
          user_id: profile.id,
          username: profile.username
        })
        .select()
        .single();

      if (error) return respond(500, { error: error.message });
      return respond(201, { comment });
    } else {
      // Creating a POST
      if (!body.title?.trim() || !body.content?.trim()) {
        return respond(400, { error: 'Title and content are required' });
      }

      const { data: post, error } = await supabaseAdmin
        .from('forum_posts')
        .insert({
          title: body.title.trim(),
          content: body.content.trim(),
          user_id: profile.id,
          username: profile.username
        })
        .select()
        .single();

      if (error) return respond(500, { error: error.message });
      return respond(201, { post });
    }
  }

  // ── DELETE: Delete post or comment (Owner or Admin only) ────────────────
  if (event.httpMethod === 'DELETE') {
    if (commentId) {
      // Delete comment
      const { data: comment, error: fetchErr } = await supabaseAdmin
        .from('forum_comments')
        .select('user_id')
        .eq('id', commentId)
        .single();

      if (fetchErr) return respond(404, { error: 'Comment not found' });

      // Check permissions: creator of comment OR admin
      if (comment.user_id !== profile.id && !isUserAdmin) {
        return respond(403, { error: 'Forbidden: you cannot delete this comment' });
      }

      const { error: delErr } = await supabaseAdmin
        .from('forum_comments')
        .delete()
        .eq('id', commentId);

      if (delErr) return respond(500, { error: delErr.message });
      return respond(200, { message: 'Comment deleted successfully' });
    } else {
      // Delete post
      const targetPostId = params.get('id');
      if (!targetPostId) return respond(400, { error: 'Missing ?id= or ?comment_id= parameter' });

      const { data: post, error: fetchErr } = await supabaseAdmin
        .from('forum_posts')
        .select('user_id')
        .eq('id', targetPostId)
        .single();

      if (fetchErr) return respond(404, { error: 'Post not found' });

      // Check permissions: creator of post OR admin
      if (post.user_id !== profile.id && !isUserAdmin) {
        return respond(403, { error: 'Forbidden: you cannot delete this post' });
      }

      const { error: delErr } = await supabaseAdmin
        .from('forum_posts')
        .delete()
        .eq('id', targetPostId);

      if (delErr) return respond(500, { error: delErr.message });
      return respond(200, { message: 'Post deleted successfully' });
    }
  }

  return respond(405, { error: 'Method not allowed' });
};
