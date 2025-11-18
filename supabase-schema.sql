-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Image data
  original_image_url TEXT NOT NULL,
  processed_image_url TEXT,

  -- Post customization
  has_white_background BOOLEAN DEFAULT true,
  company_logo_url TEXT,
  company_logo_position JSONB DEFAULT '{"x": 20, "y": 20, "width": 100, "height": 100}'::jsonb,

  -- Price badge
  price DECIMAL(10, 2),
  price_badge_position JSONB DEFAULT '{"x": -20, "y": -20, "width": 120, "height": 60}'::jsonb,
  price_badge_style JSONB DEFAULT '{"backgroundColor": "#FF6B6B", "textColor": "#FFFFFF", "fontSize": 20}'::jsonb,

  -- Border customization
  border_enabled BOOLEAN DEFAULT false,
  border_width INTEGER DEFAULT 2,
  border_color VARCHAR(7) DEFAULT '#000000',
  border_style VARCHAR(20) DEFAULT 'solid',

  -- Metadata
  title TEXT,
  description TEXT,
  tags TEXT[],

  -- User reference (if you add authentication later)
  user_id UUID,

  -- Status
  is_published BOOLEAN DEFAULT false
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_is_published_idx ON posts(is_published);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
-- For now, allow all operations (you can restrict later with auth)
CREATE POLICY "Enable read access for all users" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON posts
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON posts
  FOR DELETE USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'post-images' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'post-images' );

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'post-images' );

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'post-images' );
