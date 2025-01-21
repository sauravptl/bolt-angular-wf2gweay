/*
  # Update database schema for chat application
  
  1. Tables
    - Ensures tables exist: sessions, messages, attachments
    - Each table has appropriate timestamps and relationships
  
  2. Security
    - Enables RLS on all tables
    - Adds policies for user data access
  
  3. Performance
    - Adds indexes for foreign keys
    - Adds trigger for updating timestamps
*/

-- Create tables if they don't exist
DO $$ 
BEGIN
  -- Create sessions table if it doesn't exist
  CREATE TABLE IF NOT EXISTS sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    title text NOT NULL DEFAULT 'New Chat',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    settings jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT valid_settings CHECK (jsonb_typeof(settings) = 'object')
  );

  -- Create messages table if it doesn't exist
  CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid REFERENCES sessions ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    created_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT valid_metadata CHECK (jsonb_typeof(metadata) = 'object')
  );

  -- Create attachments table if it doesn't exist
  CREATE TABLE IF NOT EXISTS attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id uuid REFERENCES messages ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    size bigint NOT NULL,
    mime_type text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
END $$;

-- Enable RLS
DO $$ 
BEGIN
  ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Sessions policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can CRUD their own sessions'
  ) THEN
    CREATE POLICY "Users can CRUD their own sessions"
      ON sessions
      USING (auth.uid() = user_id);
  END IF;

  -- Messages policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can read messages from their sessions'
  ) THEN
    CREATE POLICY "Users can read messages from their sessions"
      ON messages
      USING (
        EXISTS (
          SELECT 1 FROM sessions 
          WHERE sessions.id = messages.session_id 
          AND sessions.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can create messages in their sessions'
  ) THEN
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
  END IF;

  -- Attachments policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'attachments' AND policyname = 'Users can read attachments from their messages'
  ) THEN
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
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'sessions_user_id_idx') THEN
    CREATE INDEX sessions_user_id_idx ON sessions(user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'messages_session_id_idx') THEN
    CREATE INDEX messages_session_id_idx ON messages(session_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'attachments_message_id_idx') THEN
    CREATE INDEX attachments_message_id_idx ON attachments(message_id);
  END IF;
END $$;

-- Create or replace function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();