-- Camp Lawton Staff Portal - Supabase Schema & RLS Policies
-- Execute this in the Supabase SQL Editor

-----------------------------------------
-- Phase 2: Database & Row-Level Security Optimization
-----------------------------------------

-- 1. Security Definer Helper for Forum Thread Access (O(1) lookups instead of correlated subqueries)
CREATE OR REPLACE FUNCTION public.can_read_thread(thread_category text) 
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  IF thread_category NOT IN ('Leadership Chamber', 'Adult Staff Room', 'Staff Only') THEN
    RETURN true;
  END IF;
  
  IF thread_category = 'Leadership Chamber' AND auth.jwt() ->> 'role' = 'Admin' THEN
    RETURN true;
  END IF;

  IF thread_category = 'Adult Staff Room' AND auth.jwt() ->> 'age_classification' = 'adult' THEN
    RETURN true;
  END IF;

  IF thread_category = 'Staff Only' AND auth.jwt() ->> 'role' IN ('Staff', 'Admin') THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- 2. DDL Event Trigger for Auto-Enabling RLS on all future tables
CREATE OR REPLACE FUNCTION public.enable_rls_on_new_table()
RETURNS event_trigger 
LANGUAGE plpgsql
AS $$
DECLARE
    obj record;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag = 'CREATE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY;', obj.object_identity);
    END LOOP;
END;
$$;

-- Drop trigger if exists (idempotency)
DROP EVENT TRIGGER IF EXISTS enforce_rls_on_all_tables;

CREATE EVENT TRIGGER enforce_rls_on_all_tables
ON ddl_command_end
WHEN TAG IN ('CREATE TABLE')
EXECUTE FUNCTION public.enable_rls_on_new_table();

-----------------------------------------
-- Phase 3: YPT Compliance & Content Safety
-----------------------------------------

-- 3. Youth-Parent Association (Strict CC Linkage)
CREATE TABLE IF NOT EXISTS public.parent_youth_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    youth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    guardian_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(youth_id, guardian_id)
);

ALTER TABLE public.parent_youth_associations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own guardian associations" 
ON public.parent_youth_associations FOR SELECT 
USING (
    auth.uid() = youth_id OR auth.uid() = guardian_id OR auth.jwt() ->> 'role' = 'Admin'
);

-- 4. Incident Reports (OpenAI Moderation Rejections)
CREATE TABLE IF NOT EXISTS public.incident_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    content TEXT,
    flagged_categories JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- 5. Safety Trainings (NCAP CS95)
CREATE TABLE IF NOT EXISTS public.safety_trainings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL, -- e.g. 'CS95'
    completed_at DATE NOT NULL,
    expires_at DATE NOT NULL
);
ALTER TABLE public.safety_trainings ENABLE ROW LEVEL SECURITY;

-----------------------------------------
-- Phase 4: Workflow & Telemetry
-----------------------------------------

-- 6. Onboarding Instances (Phase Gates)
CREATE TABLE IF NOT EXISTS public.onboarding_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    phase TEXT NOT NULL DEFAULT 'Background Check', -- Background Check -> Tax Forms -> Training
    status TEXT NOT NULL DEFAULT 'Pending',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.onboarding_instances ENABLE ROW LEVEL SECURITY;


-----------------------------------------
-- Existing Forum Tables (Optimized with helper functions)
-----------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff and Alumni can read permitted threads" 
ON public.forum_threads FOR SELECT 
USING (public.can_read_thread(category));

CREATE POLICY "Users can create permitted threads" 
ON public.forum_threads FOR INSERT 
WITH CHECK (
    auth.role() = 'authenticated' AND public.can_read_thread(category)
);

CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Optimizing the replies RLS with a security definer
CREATE OR REPLACE FUNCTION public.can_read_thread_by_id(t_id UUID) 
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  t_cat text;
BEGIN
  SELECT category INTO t_cat FROM public.forum_threads WHERE id = t_id;
  RETURN public.can_read_thread(t_cat);
END;
$$;

CREATE POLICY "Staff can read permitted replies" 
ON public.forum_replies FOR SELECT 
USING (public.can_read_thread_by_id(thread_id));

CREATE POLICY "Staff can create permitted replies" 
ON public.forum_replies FOR INSERT 
WITH CHECK (public.can_read_thread_by_id(thread_id));

-- Block Direct Messaging entirely (YPT Rules)
-- No tables for private 1-on-1 messages exist.
