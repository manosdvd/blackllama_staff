-- Migration: 007_camp_alerts.sql

-- PostgreSQL does not support CREATE TYPE IF NOT EXISTS for enum types.
-- This keeps the migration safe to rerun when the enum already exists.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'alert_severity'
          AND n.nspname = 'public'
    ) THEN
        CREATE TYPE public.alert_severity AS ENUM ('Info', 'Warning', 'Severe');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.camp_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    severity public.alert_severity DEFAULT 'Info'::public.alert_severity,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.camp_alerts ENABLE ROW LEVEL SECURITY;

-- Policies: drop first so this migration is safe to rerun.
DROP POLICY IF EXISTS "camp_alerts_public_read" ON public.camp_alerts;
CREATE POLICY "camp_alerts_public_read"
    ON public.camp_alerts
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "camp_alerts_admin_insert" ON public.camp_alerts;
CREATE POLICY "camp_alerts_admin_insert"
    ON public.camp_alerts
    FOR INSERT
    WITH CHECK (is_admin());

DROP POLICY IF EXISTS "camp_alerts_admin_update" ON public.camp_alerts;
CREATE POLICY "camp_alerts_admin_update"
    ON public.camp_alerts
    FOR UPDATE
    USING (is_admin());

DROP POLICY IF EXISTS "camp_alerts_admin_delete" ON public.camp_alerts;
CREATE POLICY "camp_alerts_admin_delete"
    ON public.camp_alerts
    FOR DELETE
    USING (is_admin());
