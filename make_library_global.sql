-- 1. Make tenant_id optional (Global Documents)
ALTER TABLE study_materials ALTER COLUMN tenant_id DROP NOT NULL;

-- 2. Update SELECT Policy to include Global items
DROP POLICY IF EXISTS "Library_Select_Policy" ON study_materials;

CREATE POLICY "Library_Select_Policy" ON study_materials
    FOR SELECT
    USING (
        tenant_id = get_auth_tenant_id()    -- Own Tenant
        OR
        tenant_id IS NULL                   -- Global Items
        OR
        get_auth_role() = 'super_admin'     -- Super Admin sees all
    );

-- 3. Update INSERT Policy (Allow NULL tenant_id)
DROP POLICY IF EXISTS "Library_Insert_Policy" ON study_materials;

CREATE POLICY "Library_Insert_Policy" ON study_materials
    FOR INSERT
    WITH CHECK (
        (
            -- Admin/Manager must use their own tenant
            tenant_id = get_auth_tenant_id()
            AND
            get_auth_role() IN ('admin', 'manager')
        )
        OR
        (
            -- Super Admin can insert anything (NULL or valid tenant)
            get_auth_role() = 'super_admin'
        )
    );

-- 4. Update UPDATE/DELETE Policy
DROP POLICY IF EXISTS "Library_Modify_Policy" ON study_materials;

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
