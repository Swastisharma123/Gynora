
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age INTEGER,
  weight DECIMAL,
  height DECIMAL,
  menstruation_age INTEGER,
  cycle_length TEXT,
  symptoms TEXT,
  goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scans table
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  acne_score DECIMAL NOT NULL,
  facial_hair_score DECIMAL NOT NULL,
  pigmentation_score DECIMAL NOT NULL,
  overall_improvement DECIMAL DEFAULT 0,
  scan_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample profile data with proper UUID
INSERT INTO profiles (id, age, weight, height, menstruation_age, cycle_length, symptoms, goals) VALUES
('550e8400-e29b-41d4-a716-446655440000', 25, 58.5, 165, 13, '28-30', 'Irregular periods, mild acne, occasional mood swings', 'Regulate menstrual cycle, improve skin health, maintain healthy weight');

-- Insert sample scan data with proper UUID references
INSERT INTO scans (id, user_id, acne_score, facial_hair_score, pigmentation_score, overall_improvement, recommendations) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 35, 25, 40, 15, ARRAY['Increase water intake', 'Consider zinc supplements', 'Use gentle skincare routine']),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 42, 30, 38, 8, ARRAY['Monitor stress levels', 'Include omega-3 in diet', 'Regular exercise routine']),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 28, 22, 35, 22, ARRAY['Continue current skincare', 'Maintain balanced diet', 'Get adequate sleep']);

-- Create chat_messages table for AI coach
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  response TEXT,
  message_type TEXT CHECK (message_type IN ('user', 'ai')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for demo purposes (allow all operations)
CREATE POLICY "Allow all operations" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON scans FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON chat_messages FOR ALL USING (true);
