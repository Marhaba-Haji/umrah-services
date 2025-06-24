
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
    const { backupType } = await req.json();
    
    const supabaseUrl = 'https://rjyhoikoqhephrkjgebo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeWhvaWtvcWhlcGhya2pnZWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDMxNjQsImV4cCI6MjA2NjE3OTE2NH0.Fjc89LevH6lXllWRjZSt-iNGBCzBgrACGt5nWKTPtlI';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // List of tables to backup
    const tables = [
      'activities', 'blog_posts', 'booking_services', 'bookings', 'categories',
      'contact_inquiries', 'faqs', 'group_flights', 'guide_services', 'hotel_bookings',
      'hotel_enquiries', 'hotel_rooms', 'hotels', 'leads', 'profiles',
      'reviews', 'routes', 'saudi_visas', 'seo_pages', 'system_settings',
      'testimonials', 'transport_services', 'umrah_packages', 'user_roles',
      'vehicles', 'ziarath_services'
    ];

    const backupData: any = {
      metadata: {
        backupType,
        timestamp: new Date().toISOString(),
        version: '1.0'
      },
      schema: {},
      data: {}
    };

    let totalSize = 0;
    let tableCount = 0;

    // Get schema information if needed
    if (backupType === 'full' || backupType === 'schema') {
      console.log('Backing up schema...');
      
      // Get table schemas from information_schema
      const { data: schemaData, error: schemaError } = await supabase
        .from('information_schema.tables')
        .select('table_name, table_type')
        .eq('table_schema', 'public');

      if (!schemaError && schemaData) {
        backupData.schema.tables = schemaData;
      }

      // Get column information
      for (const table of tables) {
        const { data: columnData, error: columnError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable, column_default')
          .eq('table_schema', 'public')
          .eq('table_name', table);

        if (!columnError && columnData) {
          backupData.schema[table] = columnData;
        }
      }
    }

    // Get table data if needed
    if (backupType === 'full' || backupType === 'data') {
      console.log('Backing up data...');
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*');

          if (!error && data) {
            backupData.data[table] = data;
            totalSize += JSON.stringify(data).length;
            tableCount++;
            console.log(`Backed up ${data.length} rows from ${table}`);
          } else if (error) {
            console.warn(`Could not backup table ${table}:`, error.message);
          }
        } catch (err) {
          console.warn(`Error backing up table ${table}:`, err);
        }
      }
    }

    // Store backup record
    const backupName = `${backupType}_backup_${new Date().toISOString().split('T')[0]}_${Date.now()}`;
    
    const { data: backupRecord, error: backupError } = await supabase
      .from('database_backups')
      .insert([{
        backup_name: backupName,
        backup_type: backupType,
        size_bytes: totalSize,
        table_count: tableCount,
        status: 'completed',
        backup_data: backupData
      }])
      .select()
      .single();

    if (backupError) {
      console.error('Error storing backup record:', backupError);
      throw backupError;
    }

    console.log(`Backup completed: ${backupName}, ${totalSize} bytes, ${tableCount} tables`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        backup: backupRecord,
        message: `${backupType} backup completed successfully`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in create-database-backup function:', error);
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
