-- Quick fix for Row-Level Security issue
-- Run this in Supabase SQL Editor

-- Disable RLS for code_files table (allows all operations)
ALTER TABLE code_files DISABLE ROW LEVEL SECURITY;

-- Also disable for code_backups table
ALTER TABLE code_backups DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('code_files', 'code_backups');
