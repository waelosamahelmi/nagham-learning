-- NaghamOS Database Schema
-- Run this against your Supabase project: npx supabase db push

-- Users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('learner', 'mentor')) DEFAULT 'learner',
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'Europe/Helsinki',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- XP & Leveling
CREATE TABLE IF NOT EXISTS xp_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  source_id UUID,
  skill_track TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_levels (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skill Tracks
CREATE TABLE IF NOT EXISTS skill_tracks (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Modules
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT REFERENCES skill_tracks(id),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  sort_order INTEGER DEFAULT 0,
  unlock_after UUID REFERENCES modules(id),
  xp_reward INTEGER DEFAULT 100
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  lesson_type TEXT CHECK (lesson_type IN (
    'ai_interactive', 'video_reference', 'challenge', 'quiz', 'exploration'
  )),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_minutes INTEGER DEFAULT 20,
  xp_reward INTEGER DEFAULT 25,
  sort_order INTEGER DEFAULT 0,
  ai_system_prompt TEXT,
  ai_context JSONB,
  video_url TEXT,
  video_platform TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  ai_conversation JSONB,
  ai_feedback TEXT,
  score INTEGER,
  notes TEXT,
  UNIQUE(user_id, lesson_id)
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  skill_tracks TEXT[],
  status TEXT CHECK (status IN ('assigned', 'in_progress', 'submitted', 'reviewed')),
  assigned_by UUID REFERENCES profiles(id),
  brief TEXT,
  submission_url TEXT,
  submission_notes TEXT,
  mentor_feedback TEXT,
  xp_reward INTEGER DEFAULT 200,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  icon TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  category TEXT CHECK (category IN ('milestone', 'streak', 'skill', 'social', 'hidden')),
  condition JSONB
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Mentor Messages
CREATE TABLE IF NOT EXISTS mentor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('encouragement', 'feedback', 'assignment', 'milestone')),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily Activity Log
CREATE TABLE IF NOT EXISTS daily_activity (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  minutes_spent INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, activity_date)
);

-- Inspiration Feed
CREATE TABLE IF NOT EXISTS inspiration_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  source TEXT,
  tags TEXT[],
  skill_tracks TEXT[],
  added_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Row Level Security ─────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- Learners can read own data; mentors can read all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mentor'
  ));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own XP" ON xp_ledger
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mentor'
  ));

CREATE POLICY "Users can read own levels" ON user_levels
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mentor'
  ));

CREATE POLICY "Users can read own lesson progress" ON lesson_progress
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mentor'
  ));

CREATE POLICY "Users can manage own lesson progress" ON lesson_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can read own projects" ON projects
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mentor'
  ));

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can read own achievements" ON user_achievements
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mentor'
  ));

CREATE POLICY "Users can read own messages" ON mentor_messages
  FOR SELECT USING (to_user_id = auth.uid() OR from_user_id = auth.uid());

CREATE POLICY "Mentors can send messages" ON mentor_messages
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mentor'
  ));

CREATE POLICY "Users can read own activity" ON daily_activity
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mentor'
  ));

CREATE POLICY "Users can manage own activity" ON daily_activity
  FOR ALL USING (user_id = auth.uid());

-- Public read for reference tables
CREATE POLICY "Anyone can read skill tracks" ON skill_tracks FOR SELECT USING (true);
CREATE POLICY "Anyone can read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can read inspiration" ON inspiration_items FOR SELECT USING (true);
