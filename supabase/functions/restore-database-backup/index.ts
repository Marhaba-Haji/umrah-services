import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { backupId } = await req.json();

    const supabaseUrl = "https://rjyhoikoqhephrkjgebo.supabase.co";
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeWhvaWtvcWhlcGhya2pnZWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDMxNjQsImV4cCI6MjA2NjE3OTE2NH0.Fjc89LevH6lXllWRjZSt-iNGBCzBgrACGt5nWKTPtlI";

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get backup data
    const { data: backup, error: fetchError } = await supabase
      .from("database_backups")
      .select("*")
      .eq("id", backupId)
      .single();

    if (fetchError || !backup) {
      throw new Error("Backup not found");
    }

    console.log(`Starting restore from backup: ${backup.backup_name}`);

    const backupData = backup.backup_data;
    let restoredTables = 0;
    let restoredRows = 0;

    // Restore data if present
    if (backupData.data && Object.keys(backupData.data).length > 0) {
      for (const [tableName, tableData] of Object.entries(backupData.data)) {
        try {
          const data = tableData as unknown[];

          if (data && data.length > 0) {
            // Clear existing data (be careful with this!)
            console.log(`Clearing table ${tableName}...`);
            const { error: deleteError } = await supabase
              .from(tableName)
              .delete()
              .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all rows

            if (deleteError) {
              console.warn(
                `Could not clear table ${tableName}:`,
                deleteError.message,
              );
            }

            // Insert backup data in batches
            console.log(`Restoring ${data.length} rows to ${tableName}...`);
            const batchSize = 100;

            for (let i = 0; i < data.length; i += batchSize) {
              const batch = data.slice(i, i + batchSize);

              const { error: insertError } = await supabase
                .from(tableName)
                .insert(batch);

              if (insertError) {
                console.error(
                  `Error inserting batch to ${tableName}:`,
                  insertError.message,
                );
                // Continue with next batch instead of failing completely
              } else {
                restoredRows += batch.length;
              }
            }

            restoredTables++;
          }
        } catch (err) {
          console.error(`Error restoring table ${tableName}:`, err);
        }
      }
    }

    console.log(
      `Restore completed: ${restoredTables} tables, ${restoredRows} rows`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `Restore completed: ${restoredTables} tables, ${restoredRows} rows restored`,
        restoredTables,
        restoredRows,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error in restore-database-backup function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
