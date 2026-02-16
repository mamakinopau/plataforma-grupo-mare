-- Reset Policies on 'categories' table
DROP POLICY IF EXISTS "Everyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 1. VIEW: Everyone can view categories
CREATE POLICY "Everyone can view categories" 
ON categories FOR SELECT 
USING ( true );

-- 2. MANAGE: Admins/Super Admins can create/update/delete categories
CREATE POLICY "Admins can manage categories" 
ON categories FOR ALL 
USING ( 
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);
