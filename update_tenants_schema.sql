-- Add logo_url column to tenants table if it doesn't exist
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Verify theme column is JSONB (just in case)
ALTER TABLE tenants 
ALTER COLUMN theme TYPE JSONB USING theme::JSONB;

-- Ensure RLS allows updates (Updating specific columns might be restricted if policy is too strict)
-- Check existing policies (optional, but good to know)
-- SELECT * FROM pg_policies WHERE tablename = 'tenants';
