-- 1. Helper Functions (SECURITY DEFINER to bypass RLS recursion)
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_auth_tenant_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid();
$$;

-- 2. Refix Study Materials Table Policies
DROP POLICY IF EXISTS "Users and SuperAdmins view study_materials" ON study_materials;
DROP POLICY IF EXISTS "Admins/Managers/SuperAdmins insert study_materials" ON study_materials;
DROP POLICY IF EXISTS "Admins/Managers/SuperAdmins manage study_materials" ON study_materials;
-- Drop old ones just in case
DROP POLICY IF EXISTS "Users can view tenant study_materials" ON study_materials;
DROP POLICY IF EXISTS "Admins/Managers can insert study_materials" ON study_materials;
DROP POLICY IF EXISTS "Admins/Managers can update study_materials" ON study_materials;
DROP POLICY IF EXISTS "Admins/Managers can delete study_materials" ON study_materials;


-- SELECT: Users see their tenant, Super Admins see all
CREATE POLICY "Library_Select_Policy" ON study_materials
    FOR SELECT
    USING (
        tenant_id = get_auth_tenant_id()
        OR
        get_auth_role() = 'super_admin'
    );

-- INSERT: Admins/Managers (own tenant) + Super Admin (any)
CREATE POLICY "Library_Insert_Policy" ON study_materials
    FOR INSERT
    WITH CHECK (
        (
            tenant_id = get_auth_tenant_id()
            AND
            get_auth_role() IN ('admin', 'manager')
        )
        OR
        get_auth_role() = 'super_admin'
    );

-- UPDATE/DELETE: Admins/Managers (own tenant) + Super Admin (any)
CREATE POLICY "Library_Modify_Policy" ON study_materials
    FOR ALL
    USING (
        (
            tenant_id = get_auth_tenant_id()
            AND
            get_auth_role() IN ('admin', 'manager')
        )
        OR
        get_auth_role() = 'super_admin'
    );

-- 3. Storage Policies (CRITICAL FIX FOR UPLOAD)
DROP POLICY IF EXISTS "Admins/Managers can upload study materials" ON storage.objects;
DROP POLICY IF EXISTS "Admins/Managers can delete study materials" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view study materials" ON storage.objects;

-- Storage View (Public/Auth)
CREATE POLICY "Library_Storage_Select" ON storage.objects
    FOR SELECT
    USING ( bucket_id = 'study-materials' );

-- Storage Upload (Admins/Managers/SuperAdmins)
CREATE POLICY "Library_Storage_Insert" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'study-materials'
        AND
        get_auth_role() IN ('super_admin', 'admin', 'manager')
    );

-- Storage Delete (Admins/Managers/SuperAdmins)
CREATE POLICY "Library_Storage_Delete" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'study-materials'
        AND
        get_auth_role() IN ('super_admin', 'admin', 'manager')
    );
