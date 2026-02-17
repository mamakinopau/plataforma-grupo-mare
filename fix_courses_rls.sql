-- Reset Policies on 'courses' table
DROP POLICY IF EXISTS "Public can view courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 1. VIEW: Everyone can view courses
CREATE POLICY "Public can view courses" 
ON courses FOR SELECT 
USING ( true );

-- 2. MANAGE: Admins/Managers can create/update/delete courses
CREATE POLICY "Admins can manage courses" 
ON courses FOR ALL 
USING ( 
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin', 'manager')
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin', 'manager')
  )
);
