-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING ( auth.uid() = id );

-- Allow users to view other profiles (needed for Leaderboard/Team)
-- This might be too broad for strict privacy but necessary for the app features
CREATE POLICY "Users can view all profiles" 
ON profiles FOR SELECT 
USING ( true );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Allow users to insert their own profile (usually handled by triggers but good to have)
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK ( auth.uid() = id );
