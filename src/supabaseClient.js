import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database helper functions
export const db = {
  /**
   * Fetch clicks for a specific syncId
   * @param {string} syncId 
   * @returns {Promise<Array>}
   */
  async getClicks(syncId) {
    if (!isSupabaseConfigured || !syncId) return [];
    
    try {
      const { data, error } = await supabase
        .from('pattern_clicks')
        .select('level, pattern_num, clicks')
        .eq('sync_id', syncId);
        
      if (error) {
        console.error('Error fetching from Supabase:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Supabase getClicks exception:', err);
      return [];
    }
  },

  /**
   * Upsert click count to Supabase
   * @param {string} syncId 
   * @param {number} level 
   * @param {number} patternNum 
   * @param {number} clicks 
   * @returns {Promise<boolean>}
   */
  async upsertClick(syncId, level, patternNum, clicks) {
    if (!isSupabaseConfigured || !syncId) return false;
    
    try {
      const { error } = await supabase
        .from('pattern_clicks')
        .upsert(
          { sync_id: syncId, level, pattern_num: patternNum, clicks, updated_at: new Date().toISOString() },
          { onConflict: 'sync_id,level,pattern_num' }
        );
        
      if (error) {
        console.error('Error upserting to Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase upsertClick exception:', err);
      return false;
    }
  }
};
