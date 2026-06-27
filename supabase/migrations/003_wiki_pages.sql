-- Camp Lawton Staff Portal — Wiki Pages and Revisions Migration
-- Run this in the Supabase Dashboard > SQL Editor

-- ============================================================
-- 1. WIKI PAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wiki_pages (
  slug          TEXT PRIMARY KEY,
  title         TEXT NOT NULL UNIQUE,
  content       TEXT NOT NULL,
  category      TEXT NOT NULL,
  tags          TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  created_by    TEXT DEFAULT 'System',
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_by    TEXT DEFAULT 'System',
  revision_no   INTEGER DEFAULT 1
);

-- ============================================================
-- 2. WIKI REVISIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wiki_revisions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT REFERENCES public.wiki_pages(slug) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_by    TEXT DEFAULT 'System',
  revision_no   INTEGER NOT NULL
);

-- ============================================================
-- 3. ROW-LEVEL SECURITY
-- ============================================================
ALTER TABLE public.wiki_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_revisions ENABLE ROW LEVEL SECURITY;

-- Read Access: Open to all authenticated/public users
CREATE POLICY "Allow public select for wiki pages" ON public.wiki_pages FOR SELECT USING (true);
CREATE POLICY "Allow public select for wiki revisions" ON public.wiki_revisions FOR SELECT USING (true);
