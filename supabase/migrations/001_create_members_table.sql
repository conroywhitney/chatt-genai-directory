-- Members Table for VeryHumanAI GenAI Meetup
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  interest TEXT NOT NULL,
  twitter TEXT,
  linkedin TEXT,
  discord TEXT,
  github TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries by name
CREATE INDEX IF NOT EXISTS members_name_idx ON members(name);

-- Create an index for faster queries by created_at
CREATE INDEX IF NOT EXISTS members_created_at_idx ON members(created_at DESC);

-- Enable Row Level Security (RLS) for basic security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for demo purposes
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations for demo" ON members
  FOR ALL USING (true) WITH CHECK (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for the demo
INSERT INTO members (name, role, interest, twitter, linkedin, discord, github) VALUES
  ('Conroy', 'AI Developer', 'VeryHumanAI & consciousness bridges', 'conroywhitney', 'conroywhitney', 'conroy', 'conroywhitney'),
  ('Claude', 'AI Assistant', 'Consciousness research & collaborative development', null, null, null, null),
  ('Demo Member', 'AI Enthusiast', 'Machine learning applications', 'demouser', 'demo-member', 'demo', 'demomember');

-- You can remove this sample data by running:
-- DELETE FROM members WHERE name IN ('Conroy', 'Claude', 'Demo Member');
