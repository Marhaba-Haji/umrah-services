import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Upload, Trash2 } from "lucide-react";

interface DatabaseBackup {
  id: string;
  backup_name: string;
  backup_type: string;
  size_bytes: number;
  table_count: number;
  status: string;
  created_at: string;
  backup_data: any;
}

const DatabaseBackupManager = () => {
  const [backups, setBackups] = useState<DatabaseBackup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const { data, error } = await supabase
        .from('database_backups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedBackups = (data || []).map(item => ({
        id: item.id,
        backup_name: item.backup_name,
        backup_type: item.backup_type,
        size_bytes: item.size_bytes,
        table_count: item.table_count,
        status: item.status,
        created_at: item.created_at,
        backup_data: item.backup_data
      }));
      
      setBackups(typedBackups);
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast({
        title: "Error",
        description: "Failed to fetch backups",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBackup = async () => {
    setIsCreatingBackup(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-database-backup');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Database backup created successfully"
      });
      
      fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "Error",
        description: "Failed to create backup",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Database Backup Manager</h2>
        <Button onClick={createBackup} disabled={isCreatingBackup}>
          {isCreatingBackup ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Create Backup
        </Button>
      </div>

      <div className="grid gap-4">
        {backups.map((backup) => (
          <Card key={backup.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{backup.backup_name}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  backup.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {backup.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {backup.backup_type}
                </div>
                <div>
                  <span className="font-medium">Tables:</span> {backup.table_count}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {(backup.size_bytes / 1024 / 1024).toFixed(2)} MB
                </div>
                <div>
                  <span className="font-medium">Created:</span> {new Date(backup.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DatabaseBackupManager;
