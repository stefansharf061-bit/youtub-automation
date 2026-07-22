# ChannelOS - AI-Powered YouTube Publishing Platform

ChannelOS is a production-ready SaaS application designed to automate YouTube video uploading, SEO metadata generation, analytics tracking, and content performance insights using **Google Gemini 3.6 Flash** and **YouTube Data API v3**.

---

## 🚀 Key Features

1. **Automated AI Upload Studio:**
   - Drag-and-drop video & thumbnail uploading
   - Topic prompt input
   - Visibility status (Public, Private, Unlisted) & Release Scheduler
   - **Gemini Auto-Generation:** SEO Optimized Title, Long Description, Tags, Hashtags, Category, Playlist Suggestion, Video Chapters, Keywords, Call To Action, Pinned Comment, End Screen, and Cards.

2. **YouTube Data API v3 Auto-Publishing:**
   - Resumable video upload pipeline
   - Automated thumbnail setting & metadata sync
   - Live YouTube URL generation and database persistence

3. **Analytics Studio:**
   - Realtime performance tracking for Views, Subscribers Gained, CTR (Click-Through Rate), Watch Time Hours, Average View Duration, Likes, Comments, Shares, and Impressions.
   - Future-ready Partner Program Revenue estimator.
   - Timeframe filters: 7 Days, 30 Days, 90 Days, and Lifetime.
   - Interactive Recharts visualizers.

4. **Gemini AI Insights & Video Diagnostics:**
   - Performance Score (0-100), SEO Score, CTR Score, and Retention Score.
   - Thumbnail and Title effectiveness diagnostics.
   - Strengths & Weaknesses evaluation.
   - **Follow-up Video Ideas Generator:** 3 high-potency video concepts with target keywords.
   - Optimal Upload Time window & publishing strategy.

5. **Publishing History & Logs:**
   - Complete project history table with filterable status badges (*Processing*, *Publishing*, *Published*, *Failed*).
   - Retry trigger engine for failed video uploads.
   - Metadata Viewer modal with 1-click copy buttons for all 12 generated fields.

6. **Account & Settings Panel:**
   - Google & YouTube OAuth connection state.
   - Gemini API Key verification badge.
   - Notification preferences, Timezone, and Language setup.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Node.js, Express, ESBuild, TSX
- **AI Engine:** Google GenAI SDK (`@google/genai`) with `gemini-3.6-flash`
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Deployment:** Vercel / Cloud Run / GitHub

---

## ⚙️ Quick Start Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   Copy `.env.example` to `.env`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🗄️ Database Setup (Supabase SQL)

Copy and execute the DDL script located in `/supabase/schema.sql` in your Supabase SQL Editor. It provisions all required tables (`profiles`, `youtube_accounts`, `videos`, `analytics`, `ai_reports`, `publish_logs`, `settings`) and Storage buckets (`videos`, `thumbnails`, `logs`).
