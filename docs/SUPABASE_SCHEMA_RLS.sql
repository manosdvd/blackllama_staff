-- Camp Lawton Staff Portal - Supabase Schema & RLS Policies
-- Execute this in the Supabase SQL Editor

-----------------------------------------
-- 1. Forum Threads Table
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

-- Enable RLS
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read threads they are allowed to see
-- (Leadership Chamber is restricted to Admins)
CREATE POLICY "Staff can read permitted threads" 
ON public.forum_threads FOR SELECT 
USING (
    (category != 'Leadership Chamber' AND category != 'Adult Staff Room') 
    OR 
    (auth.jwt() ->> 'role' = 'Admin' AND category = 'Leadership Chamber')
    OR
    ((auth.jwt() ->> 'age_classification') = 'adult' AND category = 'Adult Staff Room')
);

-- Policy: Authenticated staff can create threads in permitted categories
CREATE POLICY "Staff can create permitted threads" 
ON public.forum_threads FOR INSERT 
WITH CHECK (
    auth.role() = 'authenticated' 
    AND 
    (
        (category != 'Leadership Chamber' AND category != 'Adult Staff Room') 
        OR 
        (auth.jwt() ->> 'role' = 'Admin' AND category = 'Leadership Chamber')
        OR
        ((auth.jwt() ->> 'age_classification') = 'adult' AND category = 'Adult Staff Room')
    )
);

-----------------------------------------
-- 2. Forum Replies Table
-----------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Policy: If you can see the thread, you can see its replies
CREATE POLICY "Staff can read permitted replies" 
ON public.forum_replies FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.forum_threads 
        WHERE id = forum_replies.thread_id
    )
);

-- Policy: If you can see the thread, you can reply to it
CREATE POLICY "Staff can create permitted replies" 
ON public.forum_replies FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.forum_threads 
        WHERE id = forum_replies.thread_id
    )
);

-----------------------------------------
-- 3. Block Direct Messaging entirely
-----------------------------------------
-- To enforce Scouting America YPT, there is NO private messages table.
-- Any attempt to create a one-on-one communication feature must be rejected.
