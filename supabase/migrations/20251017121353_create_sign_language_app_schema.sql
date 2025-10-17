/*
  # Sign Language Learning App Schema

  ## Overview
  Creates the complete database schema for the deaf children sign language learning app,
  including user profiles, progress tracking, games, community features, and parent resources.

  ## New Tables

  ### `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `display_name` (text) - Child's display name
  - `age` (integer) - Child's age (3-5)
  - `avatar_url` (text) - Profile picture URL
  - `total_stars` (integer) - Total stars earned
  - `current_streak` (integer) - Current learning streak in days
  - `created_at` (timestamptz) - Account creation date
  - `updated_at` (timestamptz) - Last profile update

  ### `progress_milestones`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `milestone_type` (text) - Type of milestone (e.g., 'first_sign', 'week_streak')
  - `achievement_name` (text) - Name of achievement
  - `badge_icon` (text) - Icon identifier for badge
  - `earned_at` (timestamptz) - When milestone was earned

  ### `game_sessions`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `game_type` (text) - Type of game played
  - `score` (integer) - Score achieved
  - `stars_earned` (integer) - Stars awarded
  - `completed_at` (timestamptz) - Session completion time

  ### `sign_practice_sessions`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `sign_name` (text) - Name of sign practiced
  - `accuracy_score` (float) - AI recognition accuracy (0-1)
  - `attempts` (integer) - Number of attempts
  - `successful` (boolean) - Whether practice was successful
  - `practiced_at` (timestamptz) - Practice timestamp

  ### `community_posts`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `content_type` (text) - Type of post (image, achievement)
  - `content_url` (text) - URL to content
  - `caption` (text) - Post caption
  - `high_fives` (integer) - Number of high-fives received
  - `created_at` (timestamptz) - Post creation time

  ### `friendships`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `friend_id` (uuid) - References profiles
  - `status` (text) - Connection status (pending, connected)
  - `created_at` (timestamptz) - Friendship creation time

  ### `parent_resources`
  - `id` (uuid, primary key)
  - `title` (text) - Resource title
  - `description` (text) - Resource description
  - `video_url` (text) - Video tutorial URL
  - `thumbnail_url` (text) - Thumbnail image URL
  - `duration_minutes` (integer) - Video duration
  - `category` (text) - Resource category
  - `created_at` (timestamptz) - Resource creation time

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Community posts are readable by all authenticated users
  - Parent resources are readable by all authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  age integer CHECK (age >= 3 AND age <= 5),
  avatar_url text,
  total_stars integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create progress_milestones table
CREATE TABLE IF NOT EXISTS progress_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  milestone_type text NOT NULL,
  achievement_name text NOT NULL,
  badge_icon text,
  earned_at timestamptz DEFAULT now()
);

ALTER TABLE progress_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own milestones"
  ON progress_milestones FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones"
  ON progress_milestones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_type text NOT NULL,
  score integer DEFAULT 0,
  stars_earned integer DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game sessions"
  ON game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game sessions"
  ON game_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create sign_practice_sessions table
CREATE TABLE IF NOT EXISTS sign_practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sign_name text NOT NULL,
  accuracy_score float CHECK (accuracy_score >= 0 AND accuracy_score <= 1),
  attempts integer DEFAULT 1,
  successful boolean DEFAULT false,
  practiced_at timestamptz DEFAULT now()
);

ALTER TABLE sign_practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice sessions"
  ON sign_practice_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice sessions"
  ON sign_practice_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL,
  content_url text,
  caption text,
  high_fives integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'connected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friendships"
  ON friendships FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert own friendships"
  ON friendships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own friendships"
  ON friendships FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

-- Create parent_resources table
CREATE TABLE IF NOT EXISTS parent_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text,
  thumbnail_url text,
  duration_minutes integer,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE parent_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view parent resources"
  ON parent_resources FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_progress_milestones_user_id ON progress_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sign_practice_sessions_user_id ON sign_practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);