-- Drop existing table if it exists (clean slate)
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table for multi-role user management
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'PARENT', 'TEACHER')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Student-specific fields
  grade_level INTEGER CHECK (grade_level BETWEEN 6 AND 9),
  home_county TEXT,
  home_sub_county TEXT,
  gender TEXT CHECK (gender IN ('MALE', 'FEMALE')),
  achievement_level INTEGER CHECK (achievement_level BETWEEN 1 AND 9),
  
  -- Parent-specific fields
  phone_number TEXT,
  
  -- Teacher-specific fields
  subject_specialization TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create indexes for faster lookups
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert comment for documentation
COMMENT ON TABLE profiles IS 'User profiles with role-based fields for Students, Parents, and Teachers';
