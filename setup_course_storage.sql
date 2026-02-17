-- Create 'course-content' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-content', 
  'course-content', 
  true, 
  52428800, -- 50MB limit (adjust if needed for videos)
  '{image/*, video/*, application/pdf}'
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = '{image/*, video/*, application/pdf}';

-- Enable RLS on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. VIEW: Everyone can view course content
CREATE POLICY "Public can view course content"
ON storage.objects FOR SELECT
USING ( bucket_id = 'course-content' );

-- 2. UPLOAD: Admins/Managers can upload course content
CREATE POLICY "Admins can upload course content"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-content' AND
  auth.uid() IN (
    SELECT id FROM profile_roles WHERE role IN ('admin', 'super_admin', 'manager') 
    -- Note: using 'profiles' table directly if 'profile_roles' view doesn't exist
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin', 'manager'))
  )
);

-- 3. UPDATE/DELETE: Admins/Managers can update/delete course content
CREATE POLICY "Admins can update delete course content"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-content' AND
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin', 'manager'))
);

CREATE POLICY "Admins can delete course content"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-content' AND
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin', 'manager'))
);
