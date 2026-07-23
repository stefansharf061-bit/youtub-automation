-- ChannelOS Supabase PostgreSQL Production Database Schema
-- Author: ChannelOS Engineering
-- Date: 2026-07-22
-- Standard PostgreSQL DDL with Row Level Security (RLS) policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 2. YOUTUBE ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.youtube_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    channel_handle TEXT,
    avatar_url TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    subscriber_count INT DEFAULT 0,
    video_count INT DEFAULT 0,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, channel_id)
);

ALTER TABLE public.youtube_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own youtube accounts" 
    ON public.youtube_accounts FOR ALL 
    USING (auth.uid() = user_id);

-- 3. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    gemini_api_key_configured BOOLEAN DEFAULT true,
    notifications_enabled BOOLEAN DEFAULT true,
    email_alerts_on_publish BOOLEAN DEFAULT true,
    timezone TEXT DEFAULT 'America/Los_Angeles',
    language TEXT DEFAULT 'en-US',
    auto_generate_metadata BOOLEAN DEFAULT true,
    default_visibility TEXT DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own settings" 
    ON public.settings FOR ALL 
    USING (auth.uid() = user_id);

-- 4. VIDEOS TABLE
CREATE TYPE video_visibility AS ENUM ('public', 'private', 'unlisted');
CREATE TYPE video_status AS ENUM ('draft', 'processing', 'publishing', 'published', 'failed');

CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    youtube_account_id UUID REFERENCES public.youtube_accounts(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    topic TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    visibility video_visibility DEFAULT 'public',
    status video_status DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    youtube_id TEXT,
    youtube_url TEXT,
    generated_metadata JSONB,
    retry_count INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can perform all actions on own videos" 
    ON public.videos FOR ALL 
    USING (auth.uid() = user_id);

-- 5. ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id TEXT NOT NULL,
    timeframe TEXT NOT NULL DEFAULT '30d',
    total_views BIGINT DEFAULT 0,
    views_change NUMERIC DEFAULT 0,
    subscribers_gained INT DEFAULT 0,
    subscribers_change NUMERIC DEFAULT 0,
    average_ctr NUMERIC DEFAULT 0,
    ctr_change NUMERIC DEFAULT 0,
    avg_view_duration TEXT DEFAULT '0m 0s',
    watch_time_hours NUMERIC DEFAULT 0,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    shares INT DEFAULT 0,
    impressions BIGINT DEFAULT 0,
    estimated_revenue NUMERIC DEFAULT 0,
    time_series_data JSONB,
    traffic_sources JSONB,
    demographics JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, timeframe)
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" 
    ON public.analytics FOR SELECT 
    USING (auth.uid() = user_id);

-- 6. AI REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.ai_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    video_title TEXT NOT NULL,
    overall_score INT DEFAULT 85,
    seo_score INT DEFAULT 90,
    ctr_score INT DEFAULT 85,
    retention_score INT DEFAULT 80,
    thumbnail_effectiveness TEXT,
    title_effectiveness TEXT,
    description_quality TEXT,
    strengths JSONB,
    weaknesses JSONB,
    improvement_suggestions JSONB,
    next_video_ideas JSONB,
    best_upload_time TEXT,
    best_keywords JSONB,
    publishing_strategy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_reports_video_id ON public.ai_reports(video_id);

ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own AI reports" 
    ON public.ai_reports FOR ALL 
    USING (auth.uid() = user_id);

-- 7. PUBLISH LOGS TABLE
CREATE TABLE IF NOT EXISTS public.publish_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    video_title TEXT,
    action TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('info', 'success', 'warning', 'error')),
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.publish_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own publish logs" 
    ON public.publish_logs FOR ALL 
    USING (auth.uid() = user_id);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'info',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own notifications" 
    ON public.notifications FOR ALL 
    USING (auth.uid() = user_id);

-- 9. SUPABASE STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('videos', 'videos', true),
    ('thumbnails', 'thumbnails', true),
    ('generated_metadata', 'generated_metadata', false),
    ('logs', 'logs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Videos Bucket Access" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Authenticated Users Upload Videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Public Thumbnails Bucket Access" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
CREATE POLICY "Authenticated Users Upload Thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
