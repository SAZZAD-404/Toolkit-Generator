-- Create code_backups table for activity logging
CREATE TABLE IF NOT EXISTS code_backups (
  id BIGSERIAL PRIMARY KEY,
  file_id BIGINT REFERENCES code_files(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  file_content TEXT NOT NULL,
  updated_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_code_backups_file_id ON code_backups(file_id);
CREATE INDEX IF NOT EXISTS idx_code_backups_created_at ON code_backups(created_at DESC);

-- Disable RLS
ALTER TABLE code_backups DISABLE ROW LEVEL SECURITY;

-- Create trigger to auto-create backup on file update
CREATE OR REPLACE FUNCTION create_backup_on_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the next version number
  INSERT INTO code_backups (file_id, version, file_content, updated_by)
  SELECT 
    NEW.id,
    COALESCE(MAX(version), 0) + 1,
    NEW.file_content,
    NEW.updated_by
  FROM code_backups
  WHERE file_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS backup_on_update ON code_files;
CREATE TRIGGER backup_on_update
  AFTER INSERT OR UPDATE ON code_files
  FOR EACH ROW
  EXECUTE FUNCTION create_backup_on_update();

-- Verify
SELECT 'Table created successfully!' as status;
