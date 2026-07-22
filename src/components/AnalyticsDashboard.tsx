import React, { useState } from 'react';
import {
  BarChart3,
  Eye,
  Users,
  MousePointer,
  Clock,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Share2,
  DollarSign,
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { initialAnalytics } from '../lib/mockData';
import { ChannelAnalytics } from '../types';

export const AnalyticsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'lifetime'>('30d');
  const data: ChannelAnalytics = initialAnalytics[timeframe] || initialAnalytics['30d'];

  const COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              YouTube Analytics Studio
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Realtime channel growth, engagement, audience retention, and revenue estimates
          </p>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 self-start">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: 'lifetime', label: 'Lifetime' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === tf.id
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm border border-slate-200 dark:border-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Total Views */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Views</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {data.totalViews.toLocaleString()}
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-500 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{data.viewsChange}% vs prior period</span>
            </div>
          </div>
        </div>

        {/* 2. Subscribers Gained */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Subscribers Gained</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              +{data.subscribersGained.toLocaleString()}
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-500 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{data.subscribersChange}% growth</span>
            </div>
          </div>
        </div>

        {/* 3. Impressions CTR */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Average CTR</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <MousePointer className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {data.averageCTR}%
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-500 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{data.ctrChange}% CTR boost</span>
            </div>
          </div>
        </div>

        {/* 4. Watch Time Hours */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Watch Time (Hours)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {data.watchTimeHours.toLocaleString()}h
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Avg Duration: <span className="font-bold text-slate-700 dark:text-slate-300">{data.avgViewDuration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Chart: Views & Watch Time over Time */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Channel Views & Watch Time Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily performance breakdown for the selected timeframe ({timeframe.toUpperCase()})
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
            Realtime Analytics v3
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.viewsOverTime}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="watchTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#ef4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#viewsGradient)"
                name="Views"
              />
              <Area
                type="monotone"
                dataKey="watchTime"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#watchTimeGradient)"
                name="Watch Hours"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Row: Engagement, Revenue, Traffic Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engagement Stats Box */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Audience Engagement
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Likes</span>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {data.likes.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Comments</span>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {data.comments.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Shares</span>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {data.shares.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Impressions</span>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {(data.impressions / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
        </div>

        {/* Future-Ready Revenue Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Partner Program Revenue
              </span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black mt-3 text-white">
              ${data.estimatedRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Estimated AdSense RPM: $7.98 per 1,000 views in Tech/Software niche.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Sponsorship Inquiries:</span>
              <span className="text-emerald-400">3 Pending</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Affiliate Conversions:</span>
              <span className="text-white">$420.00</span>
            </div>
          </div>
        </div>

        {/* Traffic Sources Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <PieIcon className="w-4 h-4 text-red-500" />
            <span>Traffic Sources</span>
          </h3>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.trafficSources.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {data.trafficSources.map((ts, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-slate-600 dark:text-slate-300">{ts.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{ts.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
