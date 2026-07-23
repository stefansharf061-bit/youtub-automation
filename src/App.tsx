/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeOverview } from './components/HomeOverview';
import { UploadStudio } from './components/UploadStudio';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AIInsightsDashboard } from './components/AIInsightsDashboard';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import {
  initialVideos,
  initialAIReports,
  initialNotifications,
  initialYouTubeAccount,
  initialSettings,
  initialPublishLogs,
} from './lib/mockData';
import { VideoItem, AIReport, NotificationItem, YouTubeAccount, UserSettings, PublishLog } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // App Stores
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [reports, setReports] = useState<AIReport[]>(initialAIReports);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [youtubeAccount, setYoutubeAccount] = useState<YouTubeAccount>(initialYouTubeAccount);
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [logs, setLogs] = useState<PublishLog[]>(initialPublishLogs);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync initial state from server & Supabase on mount
  useEffect(() => {
    const fetchServerState = async () => {
      try {
        const [statusRes, videosRes, settingsRes] = await Promise.all([
          fetch('/api/youtube/status'),
          fetch('/api/videos'),
          fetch('/api/settings'),
        ]);

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.account) {
            setYoutubeAccount(statusData.account);
          }
        }

        if (videosRes.ok) {
          const videosData = await videosRes.json();
          if (videosData.videos && videosData.videos.length > 0) {
            setVideos(videosData.videos);
          }
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.settings) {
            setSettings(settingsData.settings);
          }
        }
      } catch (err) {
        console.warn('Initial server state fetch warning:', err);
      }
    };

    fetchServerState();

    // Listen for OAuth success message from popup callback window
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'YOUTUBE_OAUTH_SUCCESS') {
        console.log('[OAuth Listener] Google YouTube OAuth connection successful!');
        if (event.data.account) {
          setYoutubeAccount(event.data.account);
        } else {
          fetch('/api/youtube/status')
            .then((r) => r.json())
            .then((d) => d.account && setYoutubeAccount(d.account));
        }
        setSettings((prev) => ({ ...prev, youtubeConnected: true }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handlers
  const handlePublishSuccess = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev.filter((v) => v.id !== newVideo.id)]);

    // Create log
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        videoId: newVideo.id,
        videoTitle: newVideo.title,
        action: 'Automated YouTube Upload',
        status: 'success',
        details: `Published video to YouTube API. URL: ${newVideo.youtubeUrl}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      },
      ...prev,
    ]);

    // Create notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'success',
        title: 'Video Published Live!',
        message: `"${newVideo.title}" has been published to YouTube.`,
        timestamp: 'Just now',
        read: false,
        link: newVideo.youtubeUrl,
      },
      ...prev,
    ]);
  };

  const handleRetryVideo = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              status: 'published',
              youtubeUrl: `https://youtube.com/watch?v=retry_${videoId.substring(0, 6)}`,
            }
          : v
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleYouTubeConnect = async () => {
    if (youtubeAccount.connected) {
      try {
        await fetch('/api/youtube/disconnect', { method: 'POST' });
        setYoutubeAccount((prev) => ({ ...prev, connected: false }));
        setSettings((prev) => ({ ...prev, youtubeConnected: false }));
      } catch (err) {
        console.error('Disconnect error:', err);
      }
    } else {
      // Synchronously open popup to prevent browser popup blockers
      const popup = window.open('about:blank', 'YouTubeAuthPopup', 'width=600,height=720,scrollbars=yes');
      try {
        const res = await fetch('/api/youtube/auth-url');
        const data = await res.json();
        if (data.authUrl) {
          if (popup && !popup.closed) {
            popup.location.href = data.authUrl;
          } else {
            // If popup was blocked by browser, redirect current window directly
            window.location.href = data.authUrl;
          }
        } else {
          if (popup) popup.close();
          alert('Google OAuth credentials (GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET) are missing in environment variables.');
        }
      } catch (err) {
        console.error('OAuth initiation error:', err);
        if (popup) popup.close();
        // Fallback to direct backend redirect route
        window.location.href = '/api/youtube/auth';
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        youtubeAccount={youtubeAccount}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNavigate={(tab) => setActiveTab(tab)}
        onToggleYouTubeConnect={handleToggleYouTubeConnect}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Navigation Sidebar */}
        <Sidebar activeTab={activeTab} onNavigate={(tab) => setActiveTab(tab)} youtubeAccount={youtubeAccount} />

        {/* Main Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'home' && (
            <HomeOverview
              youtubeAccount={youtubeAccount}
              videos={videos}
              logs={logs}
              reports={reports}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'uploads' && (
            <UploadStudio
              onPublishSuccess={handlePublishSuccess}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {activeTab === 'ai-insights' && <AIInsightsDashboard />}

          {activeTab === 'history' && (
            <HistoryPage videos={videos} onRetryVideo={handleRetryVideo} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              youtubeAccount={youtubeAccount}
              onUpdateSettings={(newSt) => setSettings((prev) => ({ ...prev, ...newSt }))}
              onToggleYouTubeConnect={handleToggleYouTubeConnect}
            />
          )}

          {activeTab === 'guide' && <DeploymentGuideModal />}
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
}
