import { GoogleGenAI, Type } from '@google/genai';
import { GeneratedMetadata, AIReport } from '../types';

// Helper to get initialized GoogleGenAI instance
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment secrets.');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Generate complete YouTube SEO & Publishing Metadata using Gemini 3.6 Flash
 */
export async function generateYouTubeMetadata(
  videoTitle: string,
  topic?: string,
  videoFileName?: string
): Promise<GeneratedMetadata> {
  const ai = getGeminiClient();

  const prompt = `You are a world-class YouTube Growth Strategist & SEO Expert.
Generate high-converting, SEO-optimized YouTube publishing metadata for a video with the following inputs:
- Working Title: "${videoTitle}"
- Topic / Keywords: "${topic || 'General Tech / Software / AI'}"
- File Name: "${videoFileName || 'video.mp4'}"

Your response MUST follow the strict JSON schema provided and include:
1. High-CTR SEO Title (incorporate curiosity, keywords, or bracketed hooks like [2026 Tutorial])
2. Long, rich description with hook, bullet points, key takeaways, social links placeholders, and hashtags
3. Relevant YouTube tags (12-20 tags)
4. Top 3-5 hashtags
5. YouTube Category name (e.g. Science & Technology, Education, Howto & Style)
6. Playlist suggestion name
7. Video Chapters (timestamps like 00:00 Intro, 02:15, etc.)
8. High-value search keywords
9. Engaging Call To Action (subscribe/like)
10. High-converting Pinned Comment suggestion
11. End Screen suggestion
12. Cards suggestion`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are an expert YouTube SEO optimizer. Output pristine JSON matching the schema.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'High-CTR SEO optimized YouTube title' },
          description: { type: Type.STRING, description: 'Comprehensive YouTube description with chapters and links' },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Array of 12-20 search tags',
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Array of 3-5 YouTube hashtags starting with #',
          },
          category: { type: Type.STRING, description: 'YouTube Category' },
          playlistSuggestion: { type: Type.STRING, description: 'Suggested YouTube playlist name' },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING, description: 'Timestamp e.g. 00:00' },
                title: { type: Type.STRING, description: 'Chapter title' },
              },
              required: ['timestamp', 'title'],
            },
            description: 'Video chapter timestamps',
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Core target SEO search phrases',
          },
          callToAction: { type: Type.STRING, description: 'Direct call to action prompt' },
          pinnedCommentSuggestion: { type: Type.STRING, description: 'Engaging pinned comment prompt' },
          endScreenSuggestion: { type: Type.STRING, description: 'Recommended end screen elements' },
          cardsSuggestion: { type: Type.STRING, description: 'Recommended in-video info cards' },
        },
        required: [
          'title',
          'description',
          'tags',
          'hashtags',
          'category',
          'playlistSuggestion',
          'chapters',
          'keywords',
          'callToAction',
          'pinnedCommentSuggestion',
          'endScreenSuggestion',
          'cardsSuggestion',
        ],
      },
    },
  });

  const rawText = response.text || '{}';
  return JSON.parse(rawText) as GeneratedMetadata;
}

/**
 * Generate Comprehensive AI Video Report & Performance Scorecard using Gemini
 */
export async function generateAIVideoReport(
  videoId: string,
  videoTitle: string,
  topic?: string,
  metadata?: GeneratedMetadata
): Promise<AIReport> {
  const ai = getGeminiClient();

  const prompt = `You are YouTube Analytics & Content Strategy AI.
Analyze the following YouTube video project and provide a deep performance, CTR, SEO, and retention diagnostic report:
- Video ID: "${videoId}"
- Title: "${videoTitle}"
- Topic: "${topic || 'General Technology'}"
- Current SEO Title: "${metadata?.title || videoTitle}"
- Tags: "${metadata?.tags?.join(', ') || 'N/A'}"

Provide a detailed evaluation JSON containing score metrics (0-100), visual effectiveness feedback, weaknesses, strengths, 3 high-potential next video ideas with target keywords, best upload time window, and publishing strategy.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are YouTube Channel Strategy AI. Return actionable diagnostics in strict JSON format.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.INTEGER, description: 'Overall score 0-100' },
          seoScore: { type: Type.INTEGER, description: 'SEO optimization score 0-100' },
          ctrScore: { type: Type.INTEGER, description: 'Estimated CTR score 0-100' },
          retentionScore: { type: Type.INTEGER, description: 'Audience retention score 0-100' },
          thumbnailEffectiveness: { type: Type.STRING, description: 'Critique & suggestions for thumbnail' },
          titleEffectiveness: { type: Type.STRING, description: 'Critique & power word score for title' },
          descriptionQuality: { type: Type.STRING, description: 'Evaluation of description completeness' },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of 3-5 key strengths',
          },
          weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of 2-4 potential weaknesses',
          },
          improvementSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Actionable steps to improve performance',
          },
          nextVideoIdeas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                rationale: { type: Type.STRING },
                targetKeyword: { type: Type.STRING },
              },
              required: ['title', 'rationale', 'targetKeyword'],
            },
            description: '3 recommended follow-up video ideas',
          },
          bestUploadTime: { type: Type.STRING, description: 'Optimal posting day and time' },
          bestKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Top recommended keywords to target',
          },
          publishingStrategy: { type: Type.STRING, description: 'Promotional & social distribution playbook' },
        },
        required: [
          'overallScore',
          'seoScore',
          'ctrScore',
          'retentionScore',
          'thumbnailEffectiveness',
          'titleEffectiveness',
          'descriptionQuality',
          'strengths',
          'weaknesses',
          'improvementSuggestions',
          'nextVideoIdeas',
          'bestUploadTime',
          'bestKeywords',
          'publishingStrategy',
        ],
      },
    },
  });

  const rawText = response.text || '{}';
  const parsed = JSON.parse(rawText);

  return {
    videoId,
    videoTitle,
    overallScore: parsed.overallScore ?? 88,
    seoScore: parsed.seoScore ?? 92,
    ctrScore: parsed.ctrScore ?? 86,
    retentionScore: parsed.retentionScore ?? 84,
    thumbnailEffectiveness: parsed.thumbnailEffectiveness || 'High contrast thumbnail with strong focal element.',
    titleEffectiveness: parsed.titleEffectiveness || 'Strong keyword placement and engagement trigger.',
    descriptionQuality: parsed.descriptionQuality || 'Comprehensive description with timestamps and links.',
    strengths: parsed.strengths || ['Great SEO keyword density', 'Clear video structure'],
    weaknesses: parsed.weaknesses || ['First 15 seconds intro could be tighter'],
    improvementSuggestions: parsed.improvementSuggestions || ['Add a teaser hook at the start of the video'],
    nextVideoIdeas: parsed.nextVideoIdeas || [
      {
        title: 'Deep Dive into Autonomous AI Agents',
        rationale: 'High search volume in developer AI vertical.',
        targetKeyword: 'autonomous AI agent tutorial',
      },
    ],
    bestUploadTime: parsed.bestUploadTime || 'Tuesdays at 11:00 AM PST',
    bestKeywords: parsed.bestKeywords || ['AI YouTube Automation', 'ChannelOS', 'Gemini AI API'],
    publishingStrategy: parsed.publishingStrategy || 'Publish on Tuesday morning, cross-post clip to YouTube Shorts.',
    createdAt: new Date().toISOString(),
  };
}
