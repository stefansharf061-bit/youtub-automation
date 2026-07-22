import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  BarChart3,
  Sparkles,
  History,
  Settings,
  BookOpen,
  Youtube,
  Database,
  CheckCircle,
} from 'lucide-react';
import { YouTubeAccount } from '../types';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  youtubeAccount: YouTubeAccount;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, youtubeAccount }) => {
  const menuItems = [
    { id: 'home', label: 'Home Overview', icon: LayoutDashboard },
    { id: 'uploads', label: 'Upload Studio', icon: UploadCloud, badge: 'AI Auto' },
    { id: 'analytics', label: 'Analytics Studio', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights & Audit', icon: Sparkles, badge: 'Gemini 3.6' },
    { id: 'history', label: 'Upload History & Logs', icon: History },
    { id: 'settings', label: 'Account & API Settings', icon: Settings },
    { id: 'guide', label: 'Docs & Supabase SQL', icon: BookOpen },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between shrink-0 transition-colors hidden md:flex">
      {/* Top Navigation Links */}
      <div className="p-4 space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Publishing Platform
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            ChannelOS Active Engine
          </span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Gemini AI Engine:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 inline mr-1" />
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>YouTube Data API:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {youtubeAccount.connected ? 'v3 Auth Active' : 'Disconnected'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Supabase DB:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              PostgreSQL RLS
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('guide')}
          className="w-full mt-2 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-center space-x-1.5"
        >
          <Database className="w-3 h-3 text-red-500" />
          <span>View SQL Schema</span>
        </button>
      </div>
    </aside>
  );
};
