-- Camp Lawton Staff Portal — Extended Features Migration
-- Run this in the Supabase Dashboard > SQL Editor

-- ============================================================
-- 1. EXTEND PROFILES TABLE
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_confirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_confirmed_by TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_confirmed_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fav_song TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hometown TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_color TEXT DEFAULT '#1F4D3A';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS share_details BOOLEAN DEFAULT TRUE;

-- ============================================================
-- 2. EXTEND APPLICATIONS TABLE
-- ============================================================
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- ============================================================
-- 3. SITE CONTENT TABLE (For Admin WYSIWYG content edits)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_content (
  key         TEXT PRIMARY KEY,
  content     TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  TEXT
);

-- ============================================================
-- 4. BLOG POSTS TABLE (For dashboard news updates)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  visibility  TEXT[] NOT NULL DEFAULT '{everyone}', -- e.g., {'everyone'}, {'candidate', 'staff', 'admin'}
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  created_by  TEXT
);

-- ============================================================
-- 5. FORUM POSTS TABLE (Discussion chat board)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. FORUM COMMENTS TABLE (Discussion replies)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. ENABLE ROW-LEVEL SECURITY
-- ============================================================
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

-- Note: Netlify functions use the Supabase Service Role Key, 
-- which bypasses RLS entirely. We will define simple policies 
-- just in case direct access is ever configured in the future.

CREATE POLICY "Allow public select for site content" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Allow public select for blog posts" ON public.blog_posts
  FOR SELECT USING (true);

CREATE POLICY "Allow select for forum posts" ON public.forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Allow select for forum comments" ON public.forum_comments
  FOR SELECT USING (true);
