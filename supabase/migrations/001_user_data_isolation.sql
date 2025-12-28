-- Migration: User Data Isolation
-- Description: Creates tables and RLS policies for user-specific data isolation
-- Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: generated_data
-- Purpose: Stores all types of generated data with user association
-- ============================================================================

CREATE TABLE IF NOT EXISTS generated_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type VARCHAR(50) NOT NULL CHECK (data_type IN ('email', 'phone', 'user_agent', 'ip')),
  data_value TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_generated_data_user_id ON generated_data(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_data_type ON generated_data(data_type);
CREATE INDEX IF NOT EXISTS idx_generated_data_created_at ON generated_data(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_data_user_type ON generated_data(user_id, data_type);

-- ============================================================================
-- Table: email_history
-- Purpose: Dedicated table for tracking generated emails to prevent duplicates
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  country VARCHAR(50),
  style VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_email UNIQUE(user_id, email)
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_email_history_user_id ON email_history(user_id);
CREATE INDEX IF NOT EXISTS idx_email_history_email ON email_history(email);
CREATE INDEX IF NOT EXISTS idx_email_history_created_at ON email_history(created_at DESC);

-- ============================================================================
-- Row Level Security Policies for generated_data
-- ============================================================================

-- Enable RLS on generated_data table
ALTER TABLE generated_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only insert their own data
CREATE POLICY "Users can insert own data"
  ON generated_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only view their own data
CREATE POLICY "Users can view own data"
  ON generated_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only update their own data
CREATE POLICY "Users can update own data"
  ON generated_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own data
CREATE POLICY "Users can delete own data"
  ON generated_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- Row Level Security Policies for email_history
-- ============================================================================

-- Enable RLS on email_history table
ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only insert their own emails
CREATE POLICY "Users can insert own emails"
  ON email_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only view their own emails
CREATE POLICY "Users can view own emails"
  ON email_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only update their own emails
CREATE POLICY "Users can update own emails"
  ON email_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own emails
CREATE POLICY "Users can delete own emails"
  ON email_history
  FOR DELETE
  USING (auth.uid() = user_id);
