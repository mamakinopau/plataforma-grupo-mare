-- Create study_materials table
CREATE TABLE IF NOT EXISTS study_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL, -- 'pdf', 'video', 'link', etc.
    category TEXT, -- 'Onboarding', 'Menu', 'Procedures', etc.
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view materials from their tenant
CREATE POLICY "Users can view tenant study_materials" ON study_materials
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Policy: Admins/Managers can insert
CREATE POLICY "Admins/Managers can insert study_materials" ON study_materials
    FOR INSERT
    WITH CHECK (
        tenant_id IN (
            SELECT tenant_id FROM profiles WHERE id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin', 'manager')
        )
    );

-- Policy: Admins/Managers can update
CREATE POLICY "Admins/Managers can update study_materials" ON study_materials
    FOR UPDATE
    USING (
        tenant_id IN (
            SELECT tenant_id FROM profiles WHERE id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin', 'manager')
        )
    );

-- Policy: Admins/Managers can delete
CREATE POLICY "Admins/Managers can delete study_materials" ON study_materials
    FOR DELETE
    USING (
        tenant_id IN (
            SELECT tenant_id FROM profiles WHERE id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin', 'manager')
        )
    );

-- Storage Bucket: study-materials
INSERT INTO storage.buckets (id, name, public) 
VALUES ('study-materials', 'study-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: View (Public/Auth)
CREATE POLICY "Anyone can view study materials" ON storage.objects
    FOR SELECT
    USING ( bucket_id = 'study-materials' );

-- Storage Policy: Upload (Admins/Managers)
CREATE POLICY "Admins/Managers can upload study materials" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'study-materials'
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin', 'manager')
        )
    );

-- Storage Policy: Delete (Admins/Managers)
CREATE POLICY "Admins/Managers can delete study materials" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'study-materials'
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin', 'manager')
        )
    );
