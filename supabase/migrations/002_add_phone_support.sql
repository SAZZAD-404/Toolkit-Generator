-- Migration: Add Phone Number Support
-- Description: Updates the data_type constraint to include 'phone'

-- Update the constraint to include 'phone' data type
ALTER TABLE generated_data 
DROP CONSTRAINT IF EXISTS generated_data_data_type_check;

ALTER TABLE generated_data 
ADD CONSTRAINT generated_data_data_type_check 
CHECK (data_type IN ('email', 'phone', 'user_agent', 'ip'));