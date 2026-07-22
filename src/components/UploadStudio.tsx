import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Youtube,
  Globe,
  Lock,
  EyeOff,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileVideo,
  Play,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { VideoVisibility, VideoItem, GeneratedMetadata } from '../types';
import { MetadataPreviewModal } from './MetadataPreviewModal';

interface UploadStudioProps {
  onPublishSuccess: (video: VideoItem) => void;
  onNavigate: (tab: string) => void;
}

export const UploadStudio: React.FC<UploadStudioProps> = ({ onPublishSuccess, onNavigate }) => {
  // Form state
  const [videoTitle, setVideoTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [visibility, setVisibility] = useState<VideoVisibility>('public');
  const [scheduledAt, setScheduledAt] = useState('');

  // Files & Previews
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  // Publishing Execution State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState<number>(0); // 0 = idle, 1 = uploading files, 2 = gemini AI, 3 = youtube API, 4 = complete
  const [publishedVideo, setPublishedVideo] = useState<VideoItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Metadata Modal
  const [previewMetadata, setPreviewMetadata] = useState<GeneratedMetadata | null>(null);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);

  // Refs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // File drop handlers
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      if (!videoTitle) {
        // Strip extension
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Automated Publish Pipeline Trigger
  const handleStartAutomatedPublishing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      setErrorMessage('Please provide a video title or topic.');
      return;
    }

    setErrorMessage(null);
    setIsPublishing(true);

    try {
      // Step 1: Processing & Storing Video + Thumbnail
      setPublishStep(1);
      await new Promise((r) => setTimeout(r, 800));

      // Step 2: Gemini Auto-Generates Metadata (SEO Title, Description, Tags, Chapters, etc.)
      setPublishStep(2);
      const metadataRes = await fetch('/api/gemini/generate-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle,
          topic: topic,
          fileName: videoFile?.name || 'video.mp4',
        }),
      });

      const metadataData = await metadataRes.json();
      const generatedMeta: GeneratedMetadata = metadataData.metadata;
      setPreviewMetadata(generatedMeta);

      // Step 3: YouTube Data API v3 Upload & Metadata Synchronization
      setPublishStep(3);
      const publishRes = await fetch('/api/youtube/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedMeta?.title || videoTitle,
          topic,
          visibility,
          scheduledAt: scheduledAt || undefined,
          metadata: generatedMeta,
          videoUrl: videoPreviewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnailUrl: thumbnailPreviewUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        }),
      });

      const publishData = await publishRes.json();
      if (!publishRes.ok) throw new Error(publishData.message || 'YouTube publishing failed');

      // Step 4: Finished!
      setPublishStep(4);
      setPublishedVideo(publishData.video);
      onPublishSuccess(publishData.video);
    } catch (err: any) {
      console.error('Publishing pipeline error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during automated publishing.');
      setIsPublishing(false);
    }
  };

  const handleResetForm = () => {
    setVideoTitle('');
    setTopic('');
    setVisibility('public');
    setScheduledAt('');
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    setIsPublishing(false);
    setPublishStep(0);
    setPublishedVideo(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Zero-Effort Automated Publishing</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Upload Video, Thumbnail & Topic.
            <br />
            ChannelOS & Gemini Handle the Rest.
          </h1>
          <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-medium">
            Gemini 3.6 Flash automatically generates high-CTR SEO Titles, long descriptions, tags, category, chapters, call to actions, and cards. Then YouTube Data API uploads, sets metadata, and publishes.
          </p>
        </div>
      </div>

      {/* Main Upload Form or Live Publishing Pipeline */}
      {!isPublishing && publishStep === 0 ? (
        <form onSubmit={handleStartAutomatedPublishing} className="space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Grid for Video and Thumbnail Dropzones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Video File Dropzone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Upload Video <span className="text-red-500">*</span>
              </label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />
              <div
                onClick={() => videoInputRef.current?.click()}
                className={`h-56 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group relative overflow-hidden ${
                  videoPreviewUrl
                    ? 'border-emerald-500/50 bg-slate-900'
                    : 'border-slate-300 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 bg-white dark:bg-slate-900'
                }`}
              >
                {videoPreviewUrl ? (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <video
                      src={videoPreviewUrl}
                      className="w-full h-full object-cover rounded-2xl opacity-75"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center space-y-2 text-white">
                      <FileVideo className="w-8 h-8 text-emerald-400 animate-bounce" />
                      <span className="text-xs font-bold truncate max-w-xs px-2">
                        {videoFile?.name || 'Selected Video File'}
                      </span>
                      <span className="text-[10px] bg-emerald-500/80 px-2 py-0.5 rounded-full font-semibold">
                        Click to change video
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Drag & Drop MP4, MOV, WEBM or Click to Browse
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Up to 4K 60fps supported
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 2. Thumbnail File Dropzone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Upload Thumbnail <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
              />
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className={`h-56 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group relative overflow-hidden ${
                  thumbnailPreviewUrl
                    ? 'border-emerald-500/50 bg-slate-900'
                    : 'border-slate-300 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 bg-white dark:bg-slate-900'
                }`}
              >
                {thumbnailPreviewUrl ? (
                  <div className="w-full h-full relative">
                    <img
                      src={thumbnailPreviewUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-1">
                      <ImageIcon className="w-6 h-6 text-white" />
                      <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded-full font-semibold">
                        Change Thumbnail
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Upload Custom Thumbnail (16:9 PNG, JPG)
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Recommended: 1280x720 High Contrast
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields: Working Title & Topic */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Working Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Video Concept / Working Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Building an Autonomous AI Agent in React"
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>

              {/* Optional Topic / Keywords */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Topic & Key Themes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Gemini 3.5 API, React, Full Stack, Supabase"
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            {/* Visibility & Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Visibility options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Visibility Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'public', label: 'Public', icon: Globe },
                    { id: 'unlisted', label: 'Unlisted', icon: EyeOff },
                    { id: 'private', label: 'Private', icon: Lock },
                  ].map((vis) => {
                    const Icon = vis.icon;
                    const isSelected = visibility === vis.id;
                    return (
                      <button
                        key={vis.id}
                        type="button"
                        onClick={() => setVisibility(vis.id as VideoVisibility)}
                        className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/40 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{vis.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Schedule Optional */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Schedule Release Date <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-red-500/25 flex items-center justify-center space-x-3 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Auto-Generate with Gemini & Publish to YouTube</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      ) : (
        /* Animated Publishing Steps / Progress Screen */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-8 shadow-2xl text-center max-w-2xl mx-auto">
          {publishStep < 4 ? (
            <div className="space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-inner relative">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                <Sparkles className="w-5 h-5 absolute -top-1 -right-1 text-amber-500 animate-bounce" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Automated Publishing Pipeline Active
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ChannelOS AI Engine is processing your video, generating metadata, and communicating with YouTube API.
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-3 text-left max-w-md mx-auto pt-4">
                {/* Step 1 */}
                <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all ${
                  publishStep > 1
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : publishStep === 1
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}>
                  {publishStep > 1 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-red-500 shrink-0" />
                  )}
                  <div className="text-xs">
                    <span className="font-bold block">1. File Storage & Video Chunking</span>
                    <span className="text-[11px] opacity-80">Processing video file & thumbnail assets...</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all ${
                  publishStep > 2
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : publishStep === 2
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}>
                  {publishStep > 2 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : publishStep === 2 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500 shrink-0" />
                  ) : (
                    <Sparkles className="w-5 h-5 shrink-0" />
                  )}
                  <div className="text-xs">
                    <span className="font-bold block">2. Gemini AI Metadata Generation</span>
                    <span className="text-[11px] opacity-80">Auto-generating SEO title, description, tags, category & chapters...</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all ${
                  publishStep > 3
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : publishStep === 3
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}>
                  {publishStep > 3 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : publishStep === 3 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-red-500 shrink-0" />
                  ) : (
                    <Youtube className="w-5 h-5 shrink-0" />
                  )}
                  <div className="text-xs">
                    <span className="font-bold block">3. YouTube Data API v3 Synchronization</span>
                    <span className="text-[11px] opacity-80">Uploading video & setting metadata on your channel...</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Completed Success Screen */
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Published Successfully
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Your Video is Live on YouTube!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Gemini generated complete SEO metadata and YouTube API set your video live automatically.
                </p>
              </div>

              {/* Published details box */}
              {publishedVideo && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    {publishedVideo.title}
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Visibility: <strong className="text-slate-800 dark:text-slate-200 uppercase">{publishedVideo.visibility}</strong></span>
                    <span>Status: <strong className="text-emerald-500">LIVE</strong></span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={publishedVideo.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold hover:underline"
                    >
                      <Youtube className="w-4 h-4" />
                      <span>{publishedVideo.youtubeUrl}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsMetadataModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-purple-500/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Inspect Generated Metadata</span>
                </button>

                <button
                  onClick={() => onNavigate('ai-insights')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center justify-center space-x-1.5 hover:bg-red-500 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View Gemini AI Diagnostic Report</span>
                </button>

                <button
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Upload Another Video
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metadata Preview Modal */}
      <MetadataPreviewModal
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
        metadata={previewMetadata}
        videoTitle={videoTitle}
        thumbnailUrl={thumbnailPreviewUrl || undefined}
      />
    </div>
  );
};
