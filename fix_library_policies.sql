-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view tenant study_materials" ON study_materials;
DROP POLICY IF EXISTS "Admins/Managers can insert study_materials" ON study_materials;
DROP POLICY IF EXISTS "Admins/Managers can update study_materials" ON study_materials;
DROP POLICY IF EXISTS "Admins/Managers can delete study_materials" ON study_materials;

-- 1. SELECT Policy:
-- Ordinary users see their own tenant.
-- Super Admins see EVERYTHING.
CREATE POLICY "Users and SuperAdmins view study_materials" ON study_materials
    FOR SELECT
    USING (
        (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()))
        OR
        (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'))
    );

-- 2. INSERT Policy:
-- Admins/Managers insert into their own tenant.
-- Super Admins can insert (logic handles tenant assignment).
CREATE POLICY "Admins/Managers/SuperAdmins insert study_materials" ON study_materials
    FOR INSERT
    WITH CHECK (
        (
            tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
            AND
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
        )
        OR
        (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'))
    );

-- 3. UPDATE/DELETE Policy:
-- Admins/Managers manage their own tenant's items.
-- Super Admins manage everything.
CREATE POLICY "Admins/Managers/SuperAdmins manage study_materials" ON study_materials
    FOR ALL
    USING (
        (
            tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
            AND
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
        )
        OR
        (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'))
    );
