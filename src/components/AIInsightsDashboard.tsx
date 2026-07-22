import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Key,
  Target,
  Image as ImageIcon,
  Type,
  TrendingUp,
  RotateCw,
  Zap,
} from 'lucide-react';
import { initialAIReports } from '../lib/mockData';
import { AIReport } from '../types';

export const AIInsightsDashboard: React.FC = () => {
  const [reports, setReports] = useState<AIReport[]>(initialAIReports);
  const [selectedReportIndex, setSelectedReportIndex] = useState(0);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  const activeReport = reports[selectedReportIndex] || reports[0];

  const handleRunReanalysis = async () => {
    if (!activeReport) return;
    setIsReanalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: activeReport.videoId,
          title: activeReport.videoTitle,
        }),
      });
      const data = await res.json();
      if (data.report) {
        const updated = [...reports];
        updated[selectedReportIndex] = data.report;
        setReports(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReanalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Gemini AI Video Insights & Diagnostics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated performance evaluation, SEO diagnostics, CTR scoring, and next video ideas
          </p>
        </div>

        <button
          onClick={handleRunReanalysis}
          disabled={isReanalyzing}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
          <span>{isReanalyzing ? 'Gemini Re-analyzing...' : 'Run Gemini Diagnostic'}</span>
        </button>
      </div>

      {/* Video Switcher Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {reports.map((rep, idx) => (
          <button
            key={rep.videoId}
            onClick={() => setSelectedReportIndex(idx)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
              selectedReportIndex === idx
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="truncate max-w-xs">{rep.videoTitle}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px]">
                {rep.overallScore}/100
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeReport && (
        <div className="space-y-6">
          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. Overall Performance Score */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-slate-900 text-white shadow-xl space-y-2 relative overflow-hidden">
              <Sparkles className="w-16 h-16 absolute -right-2 -bottom-2 opacity-10 text-white" />
              <div className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Overall Score
              </div>
              <div className="text-4xl font-black">{activeReport.overallScore}/100</div>
              <div className="text-[11px] text-purple-200">
                Top 5% in Software & Tech category
              </div>
            </div>

            {/* 2. SEO Score */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>SEO Score</span>
                <Target className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {activeReport.seoScore}/100
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold">
                High search index placement
              </div>
            </div>

            {/* 3. CTR Score */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Estimated CTR Score</span>
                <ImageIcon className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {activeReport.ctrScore}/100
              </div>
              <div className="text-[11px] text-blue-500 font-semibold">
                Estimated 11.2% - 14.5% CTR
              </div>
            </div>

            {/* 4. Audience Retention */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Audience Retention</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {activeReport.retentionScore}/100
              </div>
              <div className="text-[11px] text-amber-500 font-semibold">
                Strong 50%+ retention benchmark
              </div>
            </div>
          </div>

          {/* Diagnostic Breakdown: Thumbnail & Title Effectiveness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Effectiveness */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Thumbnail Effectiveness
                </h3>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 font-medium">
                {activeReport.thumbnailEffectiveness}
              </p>
            </div>

            {/* Title & Description Effectiveness */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <Type className="w-5 h-5 text-purple-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Title & Description Diagnostics
                </h3>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 font-medium">
                {activeReport.titleEffectiveness}
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-6 rounded-3xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Key Competitive Strengths
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200 font-medium">
                {activeReport.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses & Fixes */}
            <div className="p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 space-y-4">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Areas for Growth & Fixes
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200 font-medium">
                {activeReport.weaknesses?.map((wk, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gemini Next Video Ideas Generator */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <Lightbulb className="w-5 h-5" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">
                Gemini Recommended Follow-Up Video Concepts
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeReport.nextVideoIdeas?.map((idea, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                    Idea #{idx + 1}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                    {idea.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {idea.rationale}
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-purple-600 dark:text-purple-400">
                    Target Keyword: <strong>"{idea.targetKeyword}"</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimal Strategy & Best Upload Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-amber-500">
                <Clock className="w-5 h-5" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Best Upload Time Window
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {activeReport.bestUploadTime}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-blue-500">
                <Key className="w-5 h-5" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Top Recommended Keywords
                </h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {activeReport.bestKeywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-emerald-500">
                <Zap className="w-5 h-5" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Publishing Strategy
                </h3>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {activeReport.publishingStrategy}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
