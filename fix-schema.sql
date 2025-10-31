-- Fix database schema to allow same filename in different folders
-- Run this in Supabase SQL Editor

-- Drop the unique constraint on file_name
ALTER TABLE code_files DROP CONSTRAINT IF EXISTS code_files_file_name_key;

-- Add unique constraint on file_path instead (full path should be unique)
ALTER TABLE code_files ADD CONSTRAINT code_files_file_path_key UNIQUE (file_path);

-- Disable RLS for code_file_history table if it exists
ALTER TABLE IF EXISTS code_file_history DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'code_files'::regclass;
