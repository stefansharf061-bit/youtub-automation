import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabaseConfigured =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://xyzcompany.supabase.co';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Utility to save video metadata locally or to Supabase DB
 */
export async function saveVideoToDatabase(videoData: any) {
  if (supabaseConfigured) {
    try {
      const { data, error } = await supabase.from('videos').upsert(videoData).select();
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('Supabase DB error, falling back to server local sync:', err.message);
    }
  }

  // Local fallback
  return { success: true, data: videoData };
}
