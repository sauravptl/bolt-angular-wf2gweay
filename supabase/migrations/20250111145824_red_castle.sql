/*
  # Initial Schema Setup for ChatGPT Clone

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `settings` (jsonb)
    
    - `messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references sessions)
      - `content` (text)
      - `role` (text)
      - `created_at` (timestamptz)
      - `metadata` (jsonb)
    
    - `attachments`
      - `id` (uuid, primary key)
      - `message_id` (uuid, references messages)
      - `name` (text)
      - `url` (text)
      - `size` (bigint)
      - `mime_type` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create sessions table
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_settings CHECK (jsonb_typeof(settings) = 'object')
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_metadata CHECK (jsonb_typeof(metadata) = 'object')
);

-- Create attachments table
CREATE TABLE attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  size bigint NOT NULL,
  mime_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can CRUD their own sessions"
  ON sessions
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read messages from their sessions"
  ON messages
  USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = messages.session_id 
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their sessions"
  ON messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = messages.session_id 
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read attachments from their messages"
  ON attachments
  USING (
    EXISTS (
      SELECT 1 FROM messages 
      JOIN sessions ON sessions.id = messages.session_id 
      WHERE messages.id = attachments.message_id 
      AND sessions.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX messages_session_id_idx ON messages(session_id);
CREATE INDEX attachments_message_id_idx ON attachments(message_id);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sessions
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();