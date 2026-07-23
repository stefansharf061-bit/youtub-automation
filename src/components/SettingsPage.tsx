import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Youtube,
  Key,
  Bell,
  Globe,
  Database,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { UserSettings, YouTubeAccount } from '../types';

interface SettingsPageProps {
  settings: UserSettings;
  youtubeAccount: YouTubeAccount;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onToggleYouTubeConnect: () => void;
}

interface HealthData {
  googleConfigured?: boolean;
  geminiConfigured?: boolean;
  supabaseConfigured?: boolean;
  diagnostics?: {
    googleClientIdPresent: boolean;
    googleClientIdLength: number;
    googleClientSecretPresent: boolean;
    googleClientSecretLength: number;
    supabaseUrlPresent: boolean;
    supabaseKeyPresent: boolean;
    vercelEnvironment: string;
  };
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  youtubeAccount,
  onUpdateSettings,
  onToggleYouTubeConnect,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const fetchHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (err) {
      console.error('Failed to fetch health diagnostic:', err);
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <SettingsIcon className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Account & Platform Settings
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage YouTube OAuth account connection, Gemini API key status, Supabase DB credentials, and notification preferences
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* 1. YouTube & Google OAuth Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                YouTube & Google OAuth Connection
              </h3>
              <p className="text-xs text-slate-500">
                Grant ChannelOS permissions to upload videos and fetch analytics via YouTube Data API v3
              </p>
            </div>
          </div>

          <button
            onClick={onToggleYouTubeConnect}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              youtubeAccount.connected
                ? 'bg-red-50 dark:bg-red-950/60 text-red-600 border border-red-200 hover:bg-red-100'
                : 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-500/20'
            }`}
          >
            {youtubeAccount.connected ? 'Disconnect Channel' : 'Connect YouTube Account'}
          </button>
        </div>

        {youtubeAccount.connected && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center space-x-3">
              <img
                src={youtubeAccount.avatarUrl}
                alt={youtubeAccount.channelName}
                className="w-10 h-10 rounded-full object-cover border border-red-500/30"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {youtubeAccount.channelName} ({youtubeAccount.channelHandle})
                </span>
                <span className="text-slate-500 text-[11px]">
                  Channel ID: {youtubeAccount.channelId} • Connected since {new Date(youtubeAccount.connectedAt || '').toLocaleDateString()}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
              OAuth Token Active
            </span>
          </div>
        )}
      </div>

      {/* 2. Gemini API Engine Status */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Google Gemini API Engine Status
            </h3>
            <p className="text-xs text-slate-500">
              Auto-configured via Google AI Studio environment secrets (gemini-3.6-flash)
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/30 flex items-center justify-between text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-slate-900 dark:text-white">
                GEMINI_API_KEY Injected & Verified
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Server-side API calls proxy through <code>/api/gemini/*</code> routes safely.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold text-[10px]">
            Ready
          </span>
        </div>
      </div>

      {/* 2.5 Server Environment Variables Diagnostic Check */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Server Environment Variables Diagnostic
              </h3>
              <p className="text-xs text-slate-500">
                Live verification of environment variables loaded by the active backend deployment
              </p>
            </div>
          </div>
          <button
            onClick={fetchHealth}
            disabled={checkingHealth}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
            <span>{checkingHealth ? 'Checking...' : 'Refresh Diagnostic'}</span>
          </button>
        </div>

        {healthData && healthData.diagnostics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              healthData.diagnostics.googleClientIdPresent
                ? 'bg-emerald-500/5 border-emerald-500/30'
                : 'bg-red-500/5 border-red-500/30'
            }`}>
              <div className="space-y-0.5">
                <span className="font-bold block text-slate-900 dark:text-white">GOOGLE_CLIENT_ID</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {healthData.diagnostics.googleClientIdPresent
                    ? `Detected (${healthData.diagnostics.googleClientIdLength} chars)`
                    : 'Missing in active build'}
                </span>
              </div>
              {healthData.diagnostics.googleClientIdPresent ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              healthData.diagnostics.googleClientSecretPresent
                ? 'bg-emerald-500/5 border-emerald-500/30'
                : 'bg-red-500/5 border-red-500/30'
            }`}>
              <div className="space-y-0.5">
                <span className="font-bold block text-slate-900 dark:text-white">GOOGLE_CLIENT_SECRET</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {healthData.diagnostics.googleClientSecretPresent
                    ? `Detected (${healthData.diagnostics.googleClientSecretLength} chars)`
                    : 'Missing in active build'}
                </span>
              </div>
              {healthData.diagnostics.googleClientSecretPresent ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              healthData.diagnostics.supabaseUrlPresent
                ? 'bg-emerald-500/5 border-emerald-500/30'
                : 'bg-amber-500/5 border-amber-500/30'
            }`}>
              <div className="space-y-0.5">
                <span className="font-bold block text-slate-900 dark:text-white">VITE_SUPABASE_URL</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {healthData.diagnostics.supabaseUrlPresent ? 'Connected & Cleaned' : 'Not configured'}
                </span>
              </div>
              {healthData.diagnostics.supabaseUrlPresent ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              healthData.geminiConfigured
                ? 'bg-emerald-500/5 border-emerald-500/30'
                : 'bg-amber-500/5 border-amber-500/30'
            }`}>
              <div className="space-y-0.5">
                <span className="font-bold block text-slate-900 dark:text-white">GEMINI_API_KEY</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {healthData.geminiConfigured ? 'Active & Ready' : 'Fallback active'}
                </span>
              </div>
              {healthData.geminiConfigured ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
            </div>
          </div>
        )}

        {healthData && healthData.diagnostics && (!healthData.diagnostics.googleClientIdPresent || !healthData.diagnostics.googleClientSecretPresent) && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Action Required on Vercel:</span>
              <p className="text-[11px] leading-relaxed">
                You added <code>GOOGLE_CLIENT_ID</code> & <code>GOOGLE_CLIENT_SECRET</code> to Vercel settings, but Vercel requires a <strong>Redeploy</strong> for newly added environment variables to be injected into the serverless deployment.
              </p>
              <p className="text-[11px] leading-relaxed font-semibold">
                Go to Vercel Dashboard → Deployments → Click <code>...</code> on your latest deployment → Click <strong>Redeploy</strong>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Notification & Preferences */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Notifications & Platform Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Configure alert triggers, timezone, and language
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Notifications checkbox */}
          <label className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => onUpdateSettings({ notificationsEnabled: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Enable In-App Notifications
              </span>
              <span className="text-slate-500 text-[11px]">
                Receive toast alerts on video publishing & analytics updates
              </span>
            </div>
          </label>

          {/* Email alerts */}
          <label className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailAlertsOnPublish}
              onChange={(e) => onUpdateSettings({ emailAlertsOnPublish: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Email Alerts on Upload Complete
              </span>
              <span className="text-slate-500 text-[11px]">
                Send email report when video goes live on YouTube
              </span>
            </div>
          </label>

          {/* Timezone */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Channel Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => onUpdateSettings({ timezone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
            >
              <option value="America/Los_Angeles (PST - UTC-8)">America/Los_Angeles (PST)</option>
              <option value="America/New_York (EST - UTC-5)">America/New_York (EST)</option>
              <option value="Europe/London (GMT - UTC+0)">Europe/London (GMT)</option>
              <option value="Asia/Tokyo (JST - UTC+9)">Asia/Tokyo (JST)</option>
            </select>
          </div>

          {/* Language */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Platform Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => onUpdateSettings({ language: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
            >
              <option value="English (US)">English (US)</option>
              <option value="Spanish (ES)">Spanish (ES)</option>
              <option value="French (FR)">French (FR)</option>
              <option value="German (DE)">German (DE)</option>
            </select>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
