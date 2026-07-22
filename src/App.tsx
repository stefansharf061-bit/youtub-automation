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

  const handleToggleYouTubeConnect = () => {
    setYoutubeAccount((prev) => ({
      ...prev,
      connected: !prev.connected,
    }));
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
