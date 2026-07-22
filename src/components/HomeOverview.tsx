import React from 'react';
import {
  Youtube,
  Sparkles,
  ArrowUpRight,
  Eye,
  Users,
  Video,
  Clock,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ListFilter,
} from 'lucide-react';
import { YouTubeAccount, VideoItem, PublishLog, AIReport } from '../types';

interface HomeOverviewProps {
  youtubeAccount: YouTubeAccount;
  videos: VideoItem[];
  logs: PublishLog[];
  reports: AIReport[];
  onNavigate: (tab: string) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  youtubeAccount,
  videos,
  logs,
  reports,
  onNavigate,
}) => {
  const latestReport = reports[0];
  const recentVideos = videos.slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                ChannelOS Automated Publishing Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {youtubeAccount.channelName || 'Creator'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Your channel is running on Gemini 3.6 Flash automated SEO metadata generation and YouTube Data API v3 publishing.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigate('uploads')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-500/25 flex items-center space-x-2 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Start New AI Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Subscribers</span>
            <Users className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {(youtubeAccount.subscriberCount || 128400).toLocaleString()}
          </div>
          <span className="text-[11px] font-bold text-emerald-500 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +1,420 this week
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>30D Views</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">194,800</div>
          <span className="text-[11px] font-bold text-emerald-500 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +32.5% vs prior month
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Videos Published</span>
            <Video className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {videos.length} Projects
          </div>
          <span className="text-[11px] font-bold text-slate-400">100% Gemini Auto-SEO</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Avg Channel CTR</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">8.9%</div>
          <span className="text-[11px] font-bold text-emerald-500 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> High impressions conversion
          </span>
        </div>
      </div>

      {/* Main Row: Recent Uploads & AI Quick Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Videos list */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Recent Video Projects
              </h3>
              <p className="text-xs text-slate-500">Latest uploads and publishing statuses</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentVideos.map((video) => (
              <div
                key={video.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={
                      video.thumbnailUrl ||
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={video.title}
                    className="w-14 h-9 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {video.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="uppercase font-semibold">{video.visibility}</span>
                      <span>•</span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {video.youtubeUrl && (
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Watch</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900 via-slate-900 to-purple-950 text-white border border-purple-800/50 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-purple-300">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider">
                Gemini Channel Strategy Insight
              </h3>
            </div>

            {latestReport ? (
              <div className="mt-4 space-y-3">
                <div className="text-2xl font-black">
                  Score: {latestReport.overallScore}/100
                </div>
                <p className="text-xs text-purple-200 leading-relaxed">
                  "{latestReport.titleEffectiveness}"
                </p>
                <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/80 text-[11px] space-y-1">
                  <span className="font-bold text-amber-400 block">Recommended Next Topic:</span>
                  <span className="font-semibold text-white">
                    {latestReport.nextVideoIdeas?.[0]?.title}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-purple-200 mt-2">
                Upload your first video to unlock deep Gemini channel recommendations.
              </p>
            )}
          </div>

          <button
            onClick={() => onNavigate('ai-insights')}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white shadow-md transition-colors"
          >
            Open AI Insights Studio &rarr;
          </button>
        </div>
      </div>

      {/* Live System Activity Logs */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Publishing Engine Logs
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Server Side Live Feed</span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          {logs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between space-x-3"
            >
              <div className="flex items-start space-x-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    [{log.action}] - {log.videoTitle}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5">
                    {log.details}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
