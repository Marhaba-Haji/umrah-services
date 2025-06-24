import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Running scheduled backup...');
    
    const supabaseUrl = 'https://rjyhoikoqhephrkjgebo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeWhvaWtvcWhlcGhya2pnZWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDMxNjQsImV4cCI6MjA2NjE3OTE2NH0.Fjc89LevH6lXllWRjZSt-iNGBCzBgrACGt5nWKTPtlI';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call the backup function
    const { data, error } = await supabase.functions.invoke('create-database-backup', {
      body: { backupType: 'full' }
    });

    if (error) {
      console.error('Scheduled backup failed:', error);
      throw error;
    }

    // Clean up old backups (keep last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error: cleanupError } = await supabase
      .from('database_backups')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (cleanupError) {
      console.warn('Error cleaning up old backups:', cleanupError);
    } else {
      console.log('Old backups cleaned up successfully');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Scheduled backup completed successfully',
        data 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in schedule-backups function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
