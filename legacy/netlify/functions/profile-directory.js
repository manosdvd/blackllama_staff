import { supabaseAdmin, verifyAuth, isAdmin, corsHeaders, respond } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const profile = await verifyAuth(event);
  if (!profile) return respond(401, { error: 'Unauthorized' });

  const isUserAdmin = isAdmin(profile);
  const isUserStaff = profile.role !== 'Candidate';

  // ── GET: List all staff profiles (Staff & Admin only) ────────────────────
  if (event.httpMethod === 'GET') {
    if (!isUserAdmin && !isUserStaff) {
      return respond(403, { error: 'Forbidden: staff directory is limited to staff and admins' });
    }

    // Fetch all profiles
    const { data: profiles, error: pErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .neq('role', 'Candidate') // Exclude Candidates from staff directory
      .order('username', { ascending: true });

    if (pErr) return respond(500, { error: pErr.message });

    // Fetch all applications to determine age eligibility (minor status)
    const { data: apps, error: aErr } = await supabaseAdmin
      .from('applications')
      .select('user_id, form_data');

    if (aErr) return respond(500, { error: aErr.message });

    const appMap = new Map();
    apps.forEach(app => {
      if (app.user_id) {
        appMap.set(app.user_id, app.form_data);
      }
    });

    // Process and filter details based on privacy rules
    const filteredProfiles = profiles.map(p => {
      const formData = appMap.get(p.id) || {};
      const ageEligibility = formData.ageEligibility || '';
      
      // Determine minor status (14-15 and 16-17 are under 18)
      const isMinor = ageEligibility === '14' || ageEligibility === '16';
      
      const shouldLimitInfo = !isUserAdmin && (isMinor || p.share_details === false);

      // Extract display name (First name or nickname)
      let displayName = p.username;
      if (formData.firstName) {
        displayName = formData.nickname ? formData.nickname : formData.firstName;
      }

      if (shouldLimitInfo) {
        // Redact details for minors or opted out staff
        return {
          id: p.id,
          username: displayName,
          role: p.role,
          avatar_color: p.avatar_color || '#1F4D3A',
          is_limited: true,
          is_minor: isMinor
        };
      }

      // Return full profile details
      return {
        id: p.id,
        username: p.username,
        display_name: displayName,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        role: p.role,
        bio: p.bio || '',
        fav_song: p.fav_song || '',
        hometown: p.hometown || '',
        avatar_color: p.avatar_color || '#1F4D3A',
        share_details: p.share_details !== false,
        onboarding_confirmed: p.onboarding_confirmed || false,
        is_limited: false,
        is_minor: isMinor
      };
    });

    return respond(200, { profiles: filteredProfiles });
  }

  // ── PATCH: Update a profile (Own profile or Admin updating anyone) ───────
  if (event.httpMethod === 'PATCH') {
    const params = new URLSearchParams(event.rawQuery || '');
    const targetUserId = params.get('id') || profile.id; // Default to self

    // Check permissions
    if (targetUserId !== profile.id && !isUserAdmin) {
      return respond(403, { error: 'Forbidden: you cannot edit this profile' });
    }

    let body;
    try { body = JSON.parse(event.body); } catch { return respond(400, { error: 'Invalid JSON' }); }

    const updates = {};
    if (body.bio !== undefined) updates.bio = body.bio;
    if (body.fav_song !== undefined) updates.fav_song = body.fav_song;
    if (body.hometown !== undefined) updates.hometown = body.hometown;
    if (body.avatar_color !== undefined) updates.avatar_color = body.avatar_color;
    if (body.share_details !== undefined) updates.share_details = !!body.share_details;

    // Admin-only updates (onboarding confirmation)
    if (isUserAdmin) {
      if (body.onboarding_confirmed !== undefined) {
        updates.onboarding_confirmed = !!body.onboarding_confirmed;
        updates.onboarding_confirmed_by = body.onboarding_confirmed ? profile.username : null;
        updates.onboarding_confirmed_at = body.onboarding_confirmed ? new Date().toISOString() : null;
      }
    }

    if (Object.keys(updates).length === 0) {
      return respond(400, { error: 'No fields to update' });
    }

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', targetUserId)
      .select()
      .single();

    if (error) return respond(500, { error: error.message });
    return respond(200, { user: updatedProfile });
  }

  return respond(405, { error: 'Method not allowed' });
};
