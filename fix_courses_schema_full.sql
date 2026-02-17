-- Comprehensive fix for 'courses' table schema
-- Adds all potentially missing columns to avoid further errors

ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS validity_months INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS tenant_ids TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_roles TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_mandatory BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Ensure correct types if they exist (optional safety)
-- ALTER TABLE courses ALTER COLUMN sections SET DEFAULT '[]'::jsonb;
