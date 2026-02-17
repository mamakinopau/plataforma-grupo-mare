-- Add 'updated_at' column to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Optional: Create a trigger to automatically update 'updated_at' (good practice but not strictly required for the immediate fix as app handles it)
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--    NEW.updated_at = NOW();
--    RETURN NEW;
-- END;
-- $$ language 'plpgsql';
--
-- CREATE TRIGGER update_courses_updated_at BEFORE UPDATE
-- ON courses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
