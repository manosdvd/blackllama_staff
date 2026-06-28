-- Migration: 007_camp_alerts.sql

CREATE TYPE alert_severity AS ENUM ('Info', 'Warning', 'Severe');

CREATE TABLE IF NOT EXISTS public.camp_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    severity alert_severity DEFAULT 'Info'::alert_severity,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.camp_alerts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "camp_alerts_public_read" 
    ON public.camp_alerts 
    FOR SELECT 
    USING (true);

CREATE POLICY "camp_alerts_admin_insert" 
    ON public.camp_alerts 
    FOR INSERT 
    WITH CHECK (is_admin());

CREATE POLICY "camp_alerts_admin_update" 
    ON public.camp_alerts 
    FOR UPDATE 
    USING (is_admin());

CREATE POLICY "camp_alerts_admin_delete" 
    ON public.camp_alerts 
    FOR DELETE 
    USING (is_admin());
