-- Code Files Table for storing utils files
CREATE TABLE code_files (
  id BIGSERIAL PRIMARY KEY,
  file_name VARCHAR(100) NOT NULL UNIQUE,
  file_path VARCHAR(200) NOT NULL,
  file_content TEXT NOT NULL,
  file_type VARCHAR(20) DEFAULT 'javascript',
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(100)
);

-- Code File History for backups
CREATE TABLE code_file_history (
  id BIGSERIAL PRIMARY KEY,
  file_id BIGINT REFERENCES code_files(id) ON DELETE CASCADE,
  file_content TEXT NOT NULL,
  version INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(100),
  change_note TEXT
);

-- Insert current utils files (empty initially - will be loaded from GitHub)
INSERT INTO code_files (file_name, file_path, file_content, file_type) VALUES
('userAgentGenerator.js', 'src/utils/userAgentGenerator.js', '// Load from GitHub', 'javascript'),
('numberGenerator.js', 'src/utils/numberGenerator.js', '// Load from GitHub', 'javascript'),
('gmailGenerator.js', 'src/utils/gmailGenerator.js', '// Load from GitHub', 'javascript'),
('ipGenerator.js', 'src/utils/ipGenerator.js', '// Load from GitHub', 'javascript');

-- Enable Row Level Security
ALTER TABLE code_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_file_history ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access on code_files" ON code_files FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on code_file_history" ON code_file_history FOR SELECT USING (true);

-- Authenticated write access (admin only)
CREATE POLICY "Allow authenticated insert on code_files" ON code_files FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on code_files" ON code_files FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on code_files" ON code_files FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on code_file_history" ON code_file_history FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Function to auto-backup before update
CREATE OR REPLACE FUNCTION backup_code_file()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO code_file_history (file_id, file_content, version, created_by, change_note)
  VALUES (OLD.id, OLD.file_content, OLD.version, NEW.updated_by, 'Auto backup before update');
  
  NEW.version = OLD.version + 1;
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-backup
CREATE TRIGGER backup_before_update
BEFORE UPDATE ON code_files
FOR EACH ROW
WHEN (OLD.file_content IS DISTINCT FROM NEW.file_content)
EXECUTE FUNCTION backup_code_file();
