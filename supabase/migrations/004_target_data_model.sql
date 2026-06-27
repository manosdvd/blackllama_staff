-- Camp Lawton Staff Portal — Target Data Model & RLS Migration
-- Run this in the Supabase Dashboard > SQL Editor

-- Clean up older prototype forum tables to make room for structured forums
DROP TABLE IF EXISTS public.forum_comments CASCADE;
DROP TABLE IF EXISTS public.forum_posts CASCADE;

-- ============================================================
-- 1. UTILITY SECURITY FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'Admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('Staff', 'Admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 2. SEASONS & MEMBERSHIPS TABLES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.seasons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year        INTEGER UNIQUE NOT NULL,
  active      BOOLEAN DEFAULT false,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.season_memberships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  season_id   UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('CIT', 'Junior Staff', 'Adult Staff', 'Admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, season_id)
);

-- ============================================================
-- 3. AUDITABLE STATUS & PARENT LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.application_status_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  status          TEXT NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.parent_guardian_links (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship  TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

-- ============================================================
-- 4. CHECKLIST SYSTEM
-- ============================================================
CREATE TABLE IF NOT EXISTS public.checklist_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  season_id   UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.checklist_template_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  UUID REFERENCES public.checklist_templates(id) ON DELETE CASCADE,
  task_text    TEXT NOT NULL,
  order_no     INTEGER NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.checklist_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id     UUID REFERENCES public.checklist_template_items(id) ON DELETE CASCADE,
  completed   BOOLEAN DEFAULT false,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- ============================================================
-- 5. CONTENT CATEGORIES & WIKI PAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.content_categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT UNIQUE NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id       UUID REFERENCES public.content_categories(id) ON DELETE SET NULL,
  slug              TEXT UNIQUE NOT NULL,
  title             TEXT NOT NULL,
  is_published      BOOLEAN DEFAULT true,
  offline_priority  INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_versions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id     UUID REFERENCES public.content_items(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  version_no  INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  created_by  UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.content_files (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id     UUID REFERENCES public.content_items(id) ON DELETE CASCADE,
  file_url    TEXT NOT NULL,
  file_type   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. SAFETY, EMERGENCY & CONTACT INFO
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leadership_contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  role        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.camp_contact_info (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label        TEXT NOT NULL,
  address      TEXT,
  phone        TEXT,
  coordinates  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emergency_references (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  steps        TEXT[] NOT NULL,
  priority     INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. TRAINING MODULES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.training_modules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  min_score    INTEGER DEFAULT 80,
  questions    JSONB NOT NULL DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.training_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id     UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
  score         INTEGER NOT NULL,
  passed        BOOLEAN NOT NULL,
  completed_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- ============================================================
-- 8. SONGBOOK ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.songbook_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  lyrics      TEXT NOT NULL,
  bpm         INTEGER DEFAULT 120,
  category    TEXT DEFAULT 'Campfire',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audio_tracks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id     UUID REFERENCES public.songbook_items(id) ON DELETE CASCADE,
  track_url   TEXT NOT NULL,
  track_type  TEXT NOT NULL DEFAULT 'mp3',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. STRUCTURED FORUMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT UNIQUE NOT NULL,
  description    TEXT,
  is_restricted  BOOLEAN DEFAULT false, -- Restricted to Adult Staff / Leadership
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_threads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  user_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id   UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_moderation_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  event_type    TEXT NOT NULL, -- 'flagged' | 'hidden' | 'approved'
  reason        TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  performed_by  UUID REFERENCES public.profiles(id)
);

-- ============================================================
-- 10. EXTRA PROFILES & SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id                          UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  certifications              TEXT[] DEFAULT '{}',
  medical_form_submitted      BOOLEAN DEFAULT false,
  youth_protection_certified  BOOLEAN DEFAULT false,
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_settings (
  user_id       UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  enable_push   BOOLEAN DEFAULT true,
  enable_email  BOOLEAN DEFAULT true,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  sent_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.weather_alert_cache (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_title  TEXT NOT NULL,
  description  TEXT,
  severity     TEXT,
  expires_at   TIMESTAMPTZ,
  cached_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action        TEXT NOT NULL,
  target_table  TEXT,
  target_id     UUID,
  payload       JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all newly created tables
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_guardian_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songbook_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_moderation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alert_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 11.1 General Public / Authenticated Reads
CREATE POLICY "Public Read for Seasons" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Public Read for Content Categories" ON public.content_categories FOR SELECT USING (true);
CREATE POLICY "Public Read for Content Items" ON public.content_items FOR SELECT USING (true);
CREATE POLICY "Public Read for Content Versions" ON public.content_versions FOR SELECT USING (true);
CREATE POLICY "Public Read for Content Files" ON public.content_files FOR SELECT USING (true);
CREATE POLICY "Public Read for Leadership Contacts" ON public.leadership_contacts FOR SELECT USING (true);
CREATE POLICY "Public Read for Camp Contact Info" ON public.camp_contact_info FOR SELECT USING (true);
CREATE POLICY "Public Read for Emergency References" ON public.emergency_references FOR SELECT USING (true);
CREATE POLICY "Public Read for Training Modules" ON public.training_modules FOR SELECT USING (true);
CREATE POLICY "Public Read for Songbook Items" ON public.songbook_items FOR SELECT USING (true);
CREATE POLICY "Public Read for Audio Tracks" ON public.audio_tracks FOR SELECT USING (true);
CREATE POLICY "Public Read for Weather Alert Cache" ON public.weather_alert_cache FOR SELECT USING (true);

-- 11.2 Profiles & Onboarding Access
-- Allow updates to users own profiles
CREATE POLICY "Users can edit own profile details" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 11.3 Applications: Strict Candidate-level constraints
-- Candidates can only view their own applications
CREATE POLICY "Candidates can read own application" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

-- Candidates can submit applications
CREATE POLICY "Candidates can submit applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Candidates can update their own draft applications
CREATE POLICY "Candidates can edit own draft application" ON public.applications
  FOR UPDATE USING (auth.uid() = user_id AND status = 'Pending');

-- 11.4 Parent/Guardian linked relationships
-- Parents can read linked child applications
CREATE POLICY "Parents can read linked child application" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_guardian_links
      WHERE parent_id = auth.uid() AND child_id = user_id
    )
  );

-- 11.5 Forums: Database-level Staff Authorization Gating
-- Forum categories: Staff can select all categories. Restricted categories hidden from non-adults
CREATE POLICY "Staff read categories" ON public.forum_categories
  FOR SELECT USING (
    public.is_staff() AND (NOT is_restricted OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Adult Staff', 'Admin')
    ))
  );

CREATE POLICY "Staff read threads" ON public.forum_threads
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff write threads" ON public.forum_threads
  FOR INSERT WITH CHECK (public.is_staff() AND auth.uid() = user_id);

CREATE POLICY "Staff read posts" ON public.forum_posts
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff write posts" ON public.forum_posts
  FOR INSERT WITH CHECK (public.is_staff() AND auth.uid() = user_id);

-- 11.6 User progress tracking (Checklists & Training)
CREATE POLICY "Users read own checklists progress" ON public.checklist_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own checklists progress" ON public.checklist_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users insert own checklists progress" ON public.checklist_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own training progress" ON public.training_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own training progress" ON public.training_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 11.7 Admin & System Configurations
CREATE POLICY "Admins manage seasons" ON public.seasons FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage memberships" ON public.season_memberships FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage applications" ON public.applications FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage content categories" ON public.content_categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage content items" ON public.content_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage content versions" ON public.content_versions FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage content files" ON public.content_files FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage emergency references" ON public.emergency_references FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage training modules" ON public.training_modules FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage songbook items" ON public.songbook_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage audio tracks" ON public.audio_tracks FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage forum categories" ON public.forum_categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage app settings" ON public.app_settings FOR ALL USING (public.is_admin());

-- ============================================================
-- 12. AUDIT LOGGING TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  IF public.is_admin() THEN
    INSERT INTO public.audit_log (user_id, action, target_table, target_id, payload)
    VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      row_to_json(COALESCE(NEW, OLD))::jsonb
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger audit logs for sensitive tables
CREATE TRIGGER audit_seasons_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.seasons
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

CREATE TRIGGER audit_app_settings_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

CREATE TRIGGER audit_forum_categories_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.forum_categories
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();
