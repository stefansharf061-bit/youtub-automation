import React, { useState } from 'react';
import {
  BookOpen,
  Database,
  Copy,
  Check,
  Terminal,
  Server,
  Key,
  Youtube,
  Github,
  Globe,
  Sparkles,
  Download,
} from 'lucide-react';

export const DeploymentGuideModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'env' | 'vercel' | 'supabase' | 'oauth' | 'readme'>('sql');
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- ChannelOS Supabase PostgreSQL Production Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. VIDEOS TABLE
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ANALYTICS TABLE
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
    avg_view_duration TEXT DEFAULT '0m 0s',
    watch_time_hours NUMERIC DEFAULT 0,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    shares INT DEFAULT 0,
    impressions BIGINT DEFAULT 0,
    estimated_revenue NUMERIC DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own videos" ON public.videos FOR ALL USING (auth.uid() = user_id);
`;

  const envExample = `# ChannelOS Production Environment Variables
GEMINI_API_KEY="your_google_ai_studio_gemini_api_key"
GOOGLE_CLIENT_ID="your_google_oauth_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
APP_URL="https://your-app.vercel.app"

# Supabase DB Configuration
VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_public_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_secret"
`;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Production Deployment & Architecture Docs
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Complete Supabase PostgreSQL schema, environment variables, GitHub, Vercel, and Google OAuth setup instructions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'sql', label: 'Supabase SQL Schema', icon: Database },
          { id: 'env', label: '.env.example', icon: Key },
          { id: 'vercel', label: 'Vercel & GitHub Guide', icon: Globe },
          { id: 'supabase', label: 'Supabase Guide', icon: Server },
          { id: 'oauth', label: 'Google OAuth & YouTube API', icon: Youtube },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                activeTab === t.id
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: SQL Schema */}
      {activeTab === 'sql' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>PostgreSQL / Supabase DDL Script</span>
            </h3>
            <button
              onClick={() => handleCopyText(sqlSchema)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center space-x-1.5 hover:bg-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
            {sqlSchema}
          </pre>
        </div>
      )}

      {/* Tab 2: Environment Variables */}
      {activeTab === 'env' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Key className="w-4 h-4 text-purple-500" />
              <span>Environment Variables (.env.example)</span>
            </h3>
            <button
              onClick={() => handleCopyText(envExample)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center space-x-1.5 hover:bg-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Env File'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            {envExample}
          </pre>
        </div>
      )}

      {/* Tab 3: Vercel & GitHub Guide */}
      {activeTab === 'vercel' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <span>Deploying ChannelOS to GitHub & Vercel</span>
          </h3>
          <ol className="list-decimal list-inside space-y-3 leading-relaxed font-medium">
            <li>
              <strong>Push Code to GitHub:</strong> Create a new repository on GitHub named <code>channel-os</code> and push your branch:
              <pre className="mt-1 p-2 rounded-xl bg-slate-950 text-white font-mono text-[11px]">
                git remote add origin git@github.com:yourname/channel-os.git
                <br />
                git push -u origin main
              </pre>
            </li>
            <li>
              <strong>Import to Vercel:</strong> Connect your GitHub repository to Vercel, select Next.js / Node Vite framework.
            </li>
            <li>
              <strong>Configure Environment Variables:</strong> Add <code>GEMINI_API_KEY</code>, <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>, and <code>VITE_SUPABASE_URL</code> in Vercel project settings.
            </li>
            <li>
              <strong>Deploy:</strong> Click Deploy! Vercel builds the production assets via <code>npm run build</code>.
            </li>
          </ol>
        </div>
      )}

      {/* Tab 4: Supabase Setup Guide */}
      {activeTab === 'supabase' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Server className="w-5 h-5 text-emerald-500" />
            <span>Supabase Setup Instructions</span>
          </h3>
          <ol className="list-decimal list-inside space-y-3 leading-relaxed font-medium">
            <li>Create a new project in Supabase Dashboard (https://database.new).</li>
            <li>Open the <strong>SQL Editor</strong> in Supabase.</li>
            <li>Paste the DDL script from the "Supabase SQL Schema" tab and click <strong>Run</strong>.</li>
            <li>Go to <strong>Storage</strong> and verify the buckets <code>videos</code>, <code>thumbnails</code>, and <code>logs</code> are created.</li>
            <li>Copy your Project URL and Anon Key into <code>.env</code> file as <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</li>
          </ol>
        </div>
      )}

      {/* Tab 5: Google OAuth & YouTube API Setup */}
      {activeTab === 'oauth' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Youtube className="w-5 h-5 text-red-500" />
            <span>Google OAuth 2.0 & YouTube Data API v3 Setup</span>
          </h3>
          <ol className="list-decimal list-inside space-y-3 leading-relaxed font-medium">
            <li>Go to Google Cloud Console (https://console.cloud.google.com).</li>
            <li>Enable <strong>YouTube Data API v3</strong> and <strong>YouTube Analytics API</strong>.</li>
            <li>Create an OAuth 2.0 Client ID for Web Applications.</li>
            <li>
              Add Authorized Redirect URI: <code>https://your-domain.vercel.app/api/youtube/callback</code>.
            </li>
            <li>Add scopes: <code>https://www.googleapis.com/auth/youtube.upload</code>, <code>https://www.googleapis.com/auth/youtube.readonly</code>.</li>
          </ol>
        </div>
      )}
    </div>
  );
};
