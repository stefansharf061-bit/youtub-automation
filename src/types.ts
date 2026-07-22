export type VideoVisibility = 'public' | 'private' | 'unlisted';

export type VideoStatus = 'draft' | 'processing' | 'publishing' | 'published' | 'failed';

export interface VideoChapter {
  timestamp: string;
  title: string;
}

export interface GeneratedMetadata {
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
  category: string;
  playlistSuggestion: string;
  chapters: VideoChapter[];
  keywords: string[];
  callToAction: string;
  pinnedCommentSuggestion: string;
  endScreenSuggestion: string;
  cardsSuggestion: string;
}

export interface VideoItem {
  id: string;
  title: string;
  topic?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  visibility: VideoVisibility;
  scheduledAt?: string;
  status: VideoStatus;
  youtubeId?: string;
  youtubeUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: GeneratedMetadata;
  retryCount?: number;
  errorMessage?: string;
}

export interface AIReport {
  videoId: string;
  videoTitle: string;
  overallScore: number; // 0 - 100
  seoScore: number; // 0 - 100
  ctrScore: number; // 0 - 100
  retentionScore: number; // 0 - 100
  thumbnailEffectiveness: string;
  titleEffectiveness: string;
  descriptionQuality: string;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  nextVideoIdeas: {
    title: string;
    rationale: string;
    targetKeyword: string;
  }[];
  bestUploadTime: string;
  bestKeywords: string[];
  publishingStrategy: string;
  createdAt: string;
}

export interface ChannelAnalytics {
  timeframe: '7d' | '30d' | '90d' | 'lifetime';
  totalViews: number;
  viewsChange: number; // percentage
  subscribersGained: number;
  subscribersChange: number;
  averageCTR: number; // e.g., 8.4%
  ctrChange: number;
  avgViewDuration: string; // e.g., "6m 42s"
  watchTimeHours: number;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  estimatedRevenue: number;
  viewsOverTime: { date: string; views: number; watchTime: number; subscribers: number }[];
  trafficSources: { name: string; value: number }[];
  topDemographics: { ageGroup: string; percentage: number }[];
}

export interface YouTubeAccount {
  connected: boolean;
  channelId?: string;
  channelName?: string;
  channelHandle?: string;
  avatarUrl?: string;
  subscriberCount?: number;
  videoCount?: number;
  connectedAt?: string;
}

export interface UserSettings {
  geminiApiKeyConfigured: boolean;
  supabaseConfigured: boolean;
  youtubeConnected: boolean;
  notificationsEnabled: boolean;
  emailAlertsOnPublish: boolean;
  timezone: string;
  language: string;
  autoGenerateMetadata: boolean;
  defaultVisibility: VideoVisibility;
}

export interface NotificationItem {
  id: string;
  type: 'publishing' | 'success' | 'failure' | 'analytics';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface PublishLog {
  id: string;
  videoId: string;
  videoTitle: string;
  action: string;
  status: 'info' | 'success' | 'warning' | 'error';
  details: string;
  timestamp: string;
}
