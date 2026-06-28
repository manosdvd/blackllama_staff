-- Camp Lawton Staff Portal — Wiki Phase 3 Schema Upgrade

-- Add missing metadata columns to content_items to support offline sync, aliases, and safe admin editing overrides.

ALTER TABLE public.content_items 
ADD COLUMN IF NOT EXISTS section TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS source_key TEXT,
ADD COLUMN IF NOT EXISTS admin_edited_at TIMESTAMPTZ;

-- Add a unique constraint to content_categories to ensure idempotent upserts by name
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'content_categories_name_key'
  ) THEN
    ALTER TABLE public.content_categories ADD CONSTRAINT content_categories_name_key UNIQUE (name);
  END IF;
END $$;
