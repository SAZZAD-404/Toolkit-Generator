-- Add all project files to code_files table

-- Components
INSERT INTO code_files (file_name, file_path, file_content, file_type) VALUES
('App.jsx', 'src/App.jsx', '// Load from GitHub', 'javascript'),
('Button.jsx', 'src/components/Button.jsx', '// Load from GitHub', 'javascript'),
('Card.jsx', 'src/components/Card.jsx', '// Load from GitHub', 'javascript'),
('Footer.jsx', 'src/components/Footer.jsx', '// Load from GitHub', 'javascript'),
('GmailGenerator.jsx', 'src/components/GmailGenerator.jsx', '// Load from GitHub', 'javascript'),
('IpFinder.jsx', 'src/components/IpFinder.jsx', '// Load from GitHub', 'javascript'),
('NumberGenerator.jsx', 'src/components/NumberGenerator.jsx', '// Load from GitHub', 'javascript'),
('Select.jsx', 'src/components/Select.jsx', '// Load from GitHub', 'javascript'),
('UserAgentGenerator.jsx', 'src/components/UserAgentGenerator.jsx', '// Load from GitHub', 'javascript');

-- Root files
INSERT INTO code_files (file_name, file_path, file_content, file_type) VALUES
('index.html', 'index.html', '// Load from GitHub', 'html'),
('main.jsx', 'src/main.jsx', '// Load from GitHub', 'javascript'),
('index.css', 'src/index.css', '// Load from GitHub', 'css'),
('vite.config.js', 'vite.config.js', '// Load from GitHub', 'javascript'),
('tailwind.config.js', 'tailwind.config.js', '// Load from GitHub', 'javascript'),
('postcss.config.js', 'postcss.config.js', '// Load from GitHub', 'javascript'),
('package.json', 'package.json', '// Load from GitHub', 'json');

-- Public files
INSERT INTO code_files (file_name, file_path, file_content, file_type) VALUES
('manifest.json', 'public/manifest.json', '// Load from GitHub', 'json');

-- Lib files (if any)
INSERT INTO code_files (file_name, file_path, file_content, file_type) VALUES
('supabase.js', 'src/lib/supabase.js', '// Load from GitHub', 'javascript');
