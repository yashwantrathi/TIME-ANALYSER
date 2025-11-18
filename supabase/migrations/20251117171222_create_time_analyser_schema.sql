/*
  # Time Analyser Database Schema

  ## Overview
  Creates the complete database structure for the Time Analyser application with secure authentication and time tracking capabilities.

  ## New Tables
  
  ### `profiles`
  Stores user profile information linked to Supabase auth
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### `time_entries`
  Stores daily time allocation data for each user
  - `id` (uuid, primary key) - Unique entry identifier
  - `user_id` (uuid, foreign key) - Links to profiles
  - `entry_date` (date) - The date of the time entry
  - `study` (numeric) - Hours spent studying
  - `sleep` (numeric) - Hours spent sleeping
  - `social_media` (numeric) - Hours on social media
  - `eating` (numeric) - Hours eating
  - `college` (numeric) - Hours at college
  - `commute` (numeric) - Hours commuting
  - `leisure` (numeric) - Hours in leisure activities
  - `other` (numeric) - Other time usage
  - `created_at` (timestamptz) - Entry creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own data
  - Authenticated users required for all operations
  
  ### Policies
  - **profiles**: Users can read and update only their own profile
  - **time_entries**: Users can perform all operations only on their own entries
  
  ## Indexes
  - Index on `time_entries(user_id, entry_date)` for fast queries
  - Unique constraint on `time_entries(user_id, entry_date)` to prevent duplicate entries for the same day

  ## Important Notes
  1. All time values are stored as numeric (hours with decimals allowed)
  2. Date is stored separately from time for easy querying
  3. One entry per user per day (enforced by unique constraint)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create time_entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  study numeric(4,2) DEFAULT 0 NOT NULL CHECK (study >= 0 AND study <= 24),
  sleep numeric(4,2) DEFAULT 0 NOT NULL CHECK (sleep >= 0 AND sleep <= 24),
  social_media numeric(4,2) DEFAULT 0 NOT NULL CHECK (social_media >= 0 AND social_media <= 24),
  eating numeric(4,2) DEFAULT 0 NOT NULL CHECK (eating >= 0 AND eating <= 24),
  college numeric(4,2) DEFAULT 0 NOT NULL CHECK (college >= 0 AND college <= 24),
  commute numeric(4,2) DEFAULT 0 NOT NULL CHECK (commute >= 0 AND commute <= 24),
  leisure numeric(4,2) DEFAULT 0 NOT NULL CHECK (leisure >= 0 AND leisure <= 24),
  other numeric(4,2) DEFAULT 0 NOT NULL CHECK (other >= 0 AND other <= 24),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, entry_date),
  CONSTRAINT total_hours_check CHECK (
    study + sleep + social_media + eating + college + commute + leisure + other <= 24
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_user_date ON time_entries(user_id, entry_date DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Time entries policies
CREATE POLICY "Users can view own time entries"
  ON time_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own time entries"
  ON time_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time entries"
  ON time_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own time entries"
  ON time_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();