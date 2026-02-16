-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    target_roles TEXT[],
    target_tenant_ids TEXT[]
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active announcements"
    ON public.announcements
    FOR SELECT
    USING (true);

CREATE POLICY "Admins and Managers can manage announcements"
    ON public.announcements
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'manager', 'super_admin')
        )
    );

-- Grant access
GRANT ALL ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
