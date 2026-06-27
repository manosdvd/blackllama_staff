-- Camp Lawton Staff Portal — RLS Cleanup Preflight
-- Keeps preview/re-applied Supabase SQL runs from failing when policies/triggers already exist.

DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT * FROM (VALUES
      -- 001_setup.sql
      ('public.profiles', 'Users can read own profile'),
      ('public.profiles', 'Users can update own profile'),
      ('public.applications', 'Users can read own application'),
      ('public.applications', 'Users can submit own application'),

      -- 002_extended_features.sql
      ('public.site_content', 'Allow public select for site content'),
      ('public.blog_posts', 'Allow public select for blog posts'),
      ('public.forum_posts', 'Allow select for forum posts'),
      ('public.forum_comments', 'Allow select for forum comments'),

      -- 003_wiki_pages.sql
      ('public.wiki_pages', 'Allow public select for wiki pages'),
      ('public.wiki_revisions', 'Allow public select for wiki revisions'),

      -- 004_target_data_model.sql: public/authenticated reads
      ('public.seasons', 'Public Read for Seasons'),
      ('public.content_categories', 'Public Read for Content Categories'),
      ('public.content_items', 'Public Read for Content Items'),
      ('public.content_versions', 'Public Read for Content Versions'),
      ('public.content_files', 'Public Read for Content Files'),
      ('public.leadership_contacts', 'Public Read for Leadership Contacts'),
      ('public.camp_contact_info', 'Public Read for Camp Contact Info'),
      ('public.emergency_references', 'Public Read for Emergency References'),
      ('public.training_modules', 'Public Read for Training Modules'),
      ('public.songbook_items', 'Public Read for Songbook Items'),
      ('public.audio_tracks', 'Public Read for Audio Tracks'),
      ('public.weather_alert_cache', 'Public Read for Weather Alert Cache'),

      -- 004_target_data_model.sql: user/candidate/staff policies
      ('public.profiles', 'Users can edit own profile details'),
      ('public.applications', 'Candidates can read own application'),
      ('public.applications', 'Candidates can submit applications'),
      ('public.applications', 'Candidates can edit own draft application'),
      ('public.applications', 'Parents can read linked child application'),
      ('public.forum_categories', 'Staff read categories'),
      ('public.forum_threads', 'Staff read threads'),
      ('public.forum_threads', 'Staff write threads'),
      ('public.forum_posts', 'Staff read posts'),
      ('public.forum_posts', 'Staff write posts'),
      ('public.checklist_progress', 'Users read own checklists progress'),
      ('public.checklist_progress', 'Users update own checklists progress'),
      ('public.checklist_progress', 'Users insert own checklists progress'),
      ('public.training_progress', 'Users read own training progress'),
      ('public.training_progress', 'Users insert own training progress'),

      -- 004_target_data_model.sql: admin policies
      ('public.seasons', 'Admins manage seasons'),
      ('public.season_memberships', 'Admins manage memberships'),
      ('public.applications', 'Admins manage applications'),
      ('public.content_categories', 'Admins manage content categories'),
      ('public.content_items', 'Admins manage content items'),
      ('public.content_versions', 'Admins manage content versions'),
      ('public.content_files', 'Admins manage content files'),
      ('public.emergency_references', 'Admins manage emergency references'),
      ('public.training_modules', 'Admins manage training modules'),
      ('public.songbook_items', 'Admins manage songbook items'),
      ('public.audio_tracks', 'Admins manage audio tracks'),
      ('public.forum_categories', 'Admins manage forum categories'),
      ('public.app_settings', 'Admins manage app settings')
    ) AS policies(table_name, policy_name)
  LOOP
    IF to_regclass(item.table_name) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON %s', item.policy_name, item.table_name);
    END IF;
  END LOOP;
END $$;

DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT * FROM (VALUES
      ('public.profiles', 'set_profiles_updated_at'),
      ('auth.users', 'on_auth_user_created'),
      ('public.seasons', 'audit_seasons_changes'),
      ('public.app_settings', 'audit_app_settings_changes'),
      ('public.forum_categories', 'audit_forum_categories_changes')
    ) AS triggers(table_name, trigger_name)
  LOOP
    IF to_regclass(item.table_name) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS %I ON %s', item.trigger_name, item.table_name);
    END IF;
  END LOOP;
END $$;
