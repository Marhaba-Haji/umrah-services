import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Upload,
  Database,
  Clock,
  RefreshCw,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BackupRecord {
  id: string;
  backup_name: string;
  backup_type: "full" | "schema" | "data";
  created_at: string;
  size_bytes: number;
  table_count: number;
  status: "completed" | "in_progress" | "failed";
  backup_data: unknown;
}

const DatabaseBackupManager = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(
    null,
  );

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("database_backups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching backups:", error);
        toast.error("Failed to fetch backups");
      } else {
        // Type assertion to handle the database type mismatch
        setBackups(
          (data as unknown[])?.map((item) => ({
            ...item,
            backup_type: item.backup_type as "full" | "schema" | "data",
            status: item.status as "completed" | "in_progress" | "failed",
          })) || [],
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async (backupType: "full" | "schema" | "data") => {
    setBackupInProgress(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-database-backup",
        {
          body: { backupType },
        },
      );

      if (error) {
        console.error("Error creating backup:", error);
        toast.error("Failed to create backup");
      } else {
        toast.success("Backup created successfully");
        fetchBackups();
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Failed to create backup");
    } finally {
      setBackupInProgress(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "restore-database-backup",
        {
          body: { backupId },
        },
      );

      if (error) {
        console.error("Error restoring backup:", error);
        toast.error("Failed to restore backup");
      } else {
        toast.success("Backup restored successfully");
        setRestoreDialogOpen(false);
      }
    } catch (error) {
      console.error("Error restoring backup:", error);
      toast.error("Failed to restore backup");
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!window.confirm("Are you sure you want to delete this backup?")) return;

    try {
      const { error } = await supabase
        .from("database_backups")
        .delete()
        .eq("id", backupId);

      if (error) {
        console.error("Error deleting backup:", error);
        toast.error("Failed to delete backup");
      } else {
        toast.success("Backup deleted successfully");
        fetchBackups();
      }
    } catch (error) {
      console.error("Error deleting backup:", error);
      toast.error("Failed to delete backup");
    }
  };

  const downloadBackup = async (backup: BackupRecord) => {
    try {
      const dataStr = JSON.stringify(backup.backup_data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${backup.backup_name}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded successfully");
    } catch (error) {
      console.error("Error downloading backup:", error);
      toast.error("Failed to download backup");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Backup & Restore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              onClick={() => createBackup("full")}
              disabled={backupInProgress}
              className="flex items-center gap-2"
            >
              {backupInProgress ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              Full Backup
            </Button>
            <Button
              onClick={() => createBackup("schema")}
              disabled={backupInProgress}
              variant="outline"
              className="flex items-center gap-2"
            >
              {backupInProgress ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              Schema Only
            </Button>
            <Button
              onClick={() => createBackup("data")}
              disabled={backupInProgress}
              variant="outline"
              className="flex items-center gap-2"
            >
              {backupInProgress ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              Data Only
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Backup History</h3>
            {loading ? (
              <div>Loading backups...</div>
            ) : backups.length === 0 ? (
              <div className="text-gray-500">No backups found</div>
            ) : (
              <div className="space-y-3">
                {backups.map((backup) => (
                  <Card key={backup.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">
                              {backup.backup_name}
                            </h4>
                            <Badge
                              variant={
                                backup.status === "completed"
                                  ? "default"
                                  : backup.status === "failed"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {backup.status}
                            </Badge>
                            <Badge variant="outline">
                              {backup.backup_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(backup.created_at).toLocaleString()}
                            </span>
                            <span>{formatFileSize(backup.size_bytes)}</span>
                            <span>{backup.table_count} tables</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadBackup(backup)}
                            className="flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedBackup(backup)}
                              >
                                <Upload className="w-3 h-3" />
                                Restore
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Restore Database Backup
                                </DialogTitle>
                                <DialogDescription>
                                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Warning: This will replace current data
                                  </div>
                                  Are you sure you want to restore from backup "
                                  {backup.backup_name}"? This action cannot be
                                  undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedBackup(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => restoreBackup(backup.id)}
                                >
                                  Restore Backup
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteBackup(backup.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseBackupManager;
