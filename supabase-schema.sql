-- User Agents Table
CREATE TABLE user_agents (
  id BIGSERIAL PRIMARY KEY,
  browser VARCHAR(50) NOT NULL,
  version VARCHAR(20) NOT NULL,
  os VARCHAR(50) NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Domains Table
CREATE TABLE email_domains (
  id BIGSERIAL PRIMARY KEY,
  domain VARCHAR(100) NOT NULL UNIQUE,
  provider VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phone Area Codes Table
CREATE TABLE phone_area_codes (
  id BIGSERIAL PRIMARY KEY,
  country VARCHAR(50) NOT NULL,
  country_code VARCHAR(10) NOT NULL,
  area_code VARCHAR(20) NOT NULL,
  location VARCHAR(200),
  type VARCHAR(20) DEFAULT 'landline', -- mobile, landline, tollfree
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for User Agents
INSERT INTO user_agents (browser, version, os, user_agent) VALUES
('Chrome', '120.0', 'Windows 10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
('Firefox', '121.0', 'Windows 10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'),
('Safari', '17.2', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'),
('Edge', '120.0', 'Windows 10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0');

-- Insert sample data for Email Domains
INSERT INTO email_domains (domain, provider) VALUES
('gmail.com', 'Google'),
('yahoo.com', 'Yahoo'),
('outlook.com', 'Microsoft'),
('hotmail.com', 'Microsoft'),
('protonmail.com', 'Proton');

-- Insert sample data for Phone Area Codes (USA examples)
INSERT INTO phone_area_codes (country, country_code, area_code, location, type) VALUES
('USA', '1', '212', 'New York City, NY', 'landline'),
('USA', '1', '310', 'Los Angeles, CA', 'landline'),
('USA', '1', '312', 'Chicago, IL', 'landline'),
('USA', '1', '415', 'San Francisco, CA', 'landline'),
('USA', '1', '800', 'Toll-Free', 'tollfree');

-- Enable Row Level Security (RLS)
ALTER TABLE user_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_area_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on user_agents" ON user_agents FOR SELECT USING (true);
CREATE POLICY "Allow public read access on email_domains" ON email_domains FOR SELECT USING (true);
CREATE POLICY "Allow public read access on phone_area_codes" ON phone_area_codes FOR SELECT USING (true);

-- Create policies for authenticated write access (admin only)
CREATE POLICY "Allow authenticated insert on user_agents" ON user_agents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on user_agents" ON user_agents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on user_agents" ON user_agents FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on email_domains" ON email_domains FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on email_domains" ON email_domains FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on email_domains" ON email_domains FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on phone_area_codes" ON phone_area_codes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on phone_area_codes" ON phone_area_codes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on phone_area_codes" ON phone_area_codes FOR DELETE USING (auth.role() = 'authenticated');
