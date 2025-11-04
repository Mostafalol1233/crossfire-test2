-- SQL Script to Create All Tables for KataBump Backend
-- Run this in your Neon SQL Editor

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  author TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  reading_time INTEGER NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  post_id VARCHAR NOT NULL,
  parent_comment_id VARCHAR,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  title TEXT NOT NULL,
  title_ar TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT ''
);

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  title TEXT NOT NULL,
  title_ar TEXT NOT NULL DEFAULT '',
  date_range TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  content_ar TEXT NOT NULL DEFAULT '',
  html_content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  category TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Ticket Replies Table
CREATE TABLE IF NOT EXISTS ticket_replies (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  ticket_id VARCHAR NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON ticket_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- Insert initial data (optional - you can modify this based on your needs)
-- Example: Insert a default admin user (password should be hashed in real application)
-- INSERT INTO admins (username, password, role) VALUES ('admin', '$2a$10$...hashed_password...', 'admin');

COMMIT;
