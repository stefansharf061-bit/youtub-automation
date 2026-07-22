import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Youtube, Tag, ListFilter, Share2, Layers, Bookmark, ThumbsUp, MessageSquare } from 'lucide-react';
import { GeneratedMetadata } from '../types';

interface MetadataPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: GeneratedMetadata | null;
  videoTitle?: string;
  thumbnailUrl?: string;
}

export const MetadataPreviewModal: React.FC<MetadataPreviewModalProps> = ({
  isOpen,
  onClose,
  metadata,
  videoTitle,
  thumbnailUrl,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !metadata) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                Gemini AI Generated Publishing Package
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auto-optimized SEO metadata ready for YouTube API publication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* YouTube Live Card Mockup */}
          <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-3 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1.5 text-red-500 font-semibold">
                <Youtube className="w-4 h-4" />
                <span>YouTube Preview Mockup</span>
              </span>
              <span>Category: {metadata.category}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden relative group">
                <img
                  src={thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  12:45
                </span>
              </div>

              <div className="md:col-span-2 space-y-2">
                <h4 className="font-bold text-sm sm:text-base text-white leading-snug line-clamp-2">
                  {metadata.title}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">TechVision AI Lab</span>
                  <span>•</span>
                  <span>142K views</span>
                  <span>•</span>
                  <span>Just now</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {metadata.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {metadata.hashtags.map((h, i) => (
                    <span key={i} className="text-[10px] font-semibold text-blue-400">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. SEO Title */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>1. SEO Optimized Title</span>
                </span>
                <button
                  onClick={() => handleCopy(metadata.title, 'title')}
                  className="text-xs text-slate-500 hover:text-red-500 flex items-center space-x-1 font-semibold"
                >
                  {copiedField === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'title' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {metadata.title}
              </p>
            </div>

            {/* 2. Playlist & Category */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <ListFilter className="w-3.5 h-3.5 text-purple-500" />
                  <span>2. Category & Playlist</span>
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{metadata.category}</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Suggested Playlist:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{metadata.playlistSuggestion}</span>
                </div>
              </div>
            </div>

            {/* 3. Description */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  3. Long Description
                </span>
                <button
                  onClick={() => handleCopy(metadata.description, 'description')}
                  className="text-xs text-slate-500 hover:text-red-500 flex items-center space-x-1 font-semibold"
                >
                  {copiedField === 'description' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'description' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {metadata.description}
              </pre>
            </div>

            {/* 4. Tags & Hashtags */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-500" />
                  <span>4. Search Tags ({metadata.tags.length})</span>
                </span>
                <button
                  onClick={() => handleCopy(metadata.tags.join(', '), 'tags')}
                  className="text-xs text-slate-500 hover:text-red-500 flex items-center space-x-1 font-semibold"
                >
                  {copiedField === 'tags' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy CSV</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                {metadata.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Video Chapters */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  <span>5. Video Chapters ({metadata.chapters?.length || 0})</span>
                </span>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                {metadata.chapters?.map((ch, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-1.5 py-0.5 rounded">
                      {ch.timestamp}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                      {ch.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Call To Action & Pinned Comment */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>6. Pinned Comment Suggestion</span>
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed italic">
                "{metadata.pinnedCommentSuggestion}"
              </p>
            </div>

            {/* 7. End Screen & Cards */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>7. End Screen & In-Video Cards</span>
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-semibold block">End Screen:</span>
                  <span className="text-slate-800 dark:text-slate-200">{metadata.endScreenSuggestion}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-semibold block">In-Video Cards:</span>
                  <span className="text-slate-800 dark:text-slate-200">{metadata.cardsSuggestion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
