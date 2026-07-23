import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  Youtube,
  Search,
  CheckCircle2,
  Moon,
  Sun,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { YouTubeAccount, NotificationItem } from '../types';

interface NavbarProps {
  youtubeAccount: YouTubeAccount;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNavigate: (tab: string) => void;
  onToggleYouTubeConnect?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  youtubeAccount,
  notifications,
  onOpenNotifications,
  darkMode,
  setDarkMode,
  onNavigate,
  onToggleYouTubeConnect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left branding & channel badge */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
            <Youtube className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                ChannelOS
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                AI Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              YouTube AI Publishing Platform
            </p>
          </div>
        </div>

        {/* Channel connection pill */}
        {youtubeAccount.connected ? (
          <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200 dark:border-slate-800">
            <img
              src={youtubeAccount.avatarUrl}
              alt={youtubeAccount.channelName}
              className="w-7 h-7 rounded-full object-cover border border-red-500/30"
            />
            <div className="text-left">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {youtubeAccount.channelName}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {(youtubeAccount.subscriberCount || 0).toLocaleString()} Subscribers
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => (onToggleYouTubeConnect ? onToggleYouTubeConnect() : onNavigate('settings'))}
            className="hidden md:flex items-center space-x-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 border border-red-500/20 px-3 py-1.5 rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Youtube className="w-4 h-4 text-white" />
            <span>Connect YouTube Channel</span>
          </button>
        )}
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center w-80 relative">
        <Search className="w-4 h-4 absolute left-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos, AI insights, tags..."
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Upload CTA */}
        <button
          onClick={() => onNavigate('uploads')}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-sm shadow-red-500/25 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">New AI Upload</span>
          <span className="sm:hidden">Upload</span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* User avatar / status */}
        <div
          onClick={() => onNavigate('settings')}
          className="flex items-center space-x-2 cursor-pointer p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-red-500/20">
            TV
          </div>
        </div>
      </div>
    </header>
  );
};
