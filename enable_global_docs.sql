-- 1. Permitir que o tenant_id seja vazio (para documentos Globais)
ALTER TABLE study_materials ALTER COLUMN tenant_id DROP NOT NULL;

-- 2. Atualizar permissões de VISUALIZAÇÃO (SELECT)
DROP POLICY IF EXISTS "Library_Select_Policy" ON study_materials;
CREATE POLICY "Library_Select_Policy" ON study_materials
    FOR SELECT
    USING (
        tenant_id = get_auth_tenant_id()    -- Ver documentos da minha empresa
        OR
        tenant_id IS NULL                   -- Ver documentos Globais
        OR
        get_auth_role() = 'super_admin'     -- Super Admin vê tudo
    );

-- 3. Atualizar permissões de CRIAÇÃO (INSERT)
DROP POLICY IF EXISTS "Library_Insert_Policy" ON study_materials;
CREATE POLICY "Library_Insert_Policy" ON study_materials
    FOR INSERT
    WITH CHECK (
        (
            -- Admin/Manager: só na sua empresa
            tenant_id = get_auth_tenant_id()
            AND
            get_auth_role() IN ('admin', 'manager')
        )
        OR
        (
            -- Super Admin: em qualquer empresa ou Global (NULL)
            get_auth_role() = 'super_admin'
        )
    );

-- 4. Atualizar permissões de EDIÇÃO/APAGAR
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
