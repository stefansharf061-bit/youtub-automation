import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Search,
  Youtube,
  RotateCcw,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Sparkles,
  FileText,
} from 'lucide-react';
import { VideoItem, GeneratedMetadata } from '../types';
import { MetadataPreviewModal } from './MetadataPreviewModal';

interface HistoryPageProps {
  videos: VideoItem[];
  onRetryVideo: (videoId: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ videos, onRetryVideo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMetadata, setSelectedMetadata] = useState<GeneratedMetadata | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.topic && v.topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenMetadata = (video: VideoItem) => {
    if (video.metadata) {
      setSelectedMetadata(video.metadata);
      setSelectedVideoTitle(video.title);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HistoryIcon className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Publishing History & Logs
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track status of all uploaded videos, YouTube links, Gemini metadata packages, and retry failed uploads
          </p>
        </div>
      </div>

      {/* Filters & Search bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or topic..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'published', 'publishing', 'processing', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Video Project</th>
                <th className="p-4">Visibility</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4">YouTube URL</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-800 dark:text-slate-200">
              {filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No videos found matching search filter.
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video) => {
                  let statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Published</span>
                    </span>
                  );

                  if (video.status === 'publishing') {
                    statusBadge = (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 inline-flex items-center space-x-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Publishing...</span>
                      </span>
                    );
                  } else if (video.status === 'processing') {
                    statusBadge = (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 inline-flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Processing</span>
                      </span>
                    );
                  } else if (video.status === 'failed') {
                    statusBadge = (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 inline-flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Failed</span>
                      </span>
                    );
                  }

                  return (
                    <tr key={video.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              video.thumbnailUrl ||
                              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
                            }
                            alt={video.title}
                            className="w-12 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                              {video.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                              Topic: {video.topic || 'General'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="uppercase text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {video.visibility}
                        </span>
                      </td>

                      <td className="p-4">{statusBadge}</td>

                      <td className="p-4 text-slate-500 text-[11px]">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        {video.youtubeUrl ? (
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 dark:text-red-400 font-bold hover:underline inline-flex items-center space-x-1"
                          >
                            <Youtube className="w-3.5 h-3.5" />
                            <span>Watch</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">
                            Pending Upload
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {video.metadata && (
                            <button
                              onClick={() => handleOpenMetadata(video)}
                              className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-colors"
                              title="Inspect Gemini Metadata"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          )}

                          {video.status === 'failed' && (
                            <button
                              onClick={() => onRetryVideo(video.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px] flex items-center space-x-1 hover:bg-red-500 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Retry</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metadata Modal */}
      <MetadataPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        metadata={selectedMetadata}
        videoTitle={selectedVideoTitle}
      />
    </div>
  );
};
