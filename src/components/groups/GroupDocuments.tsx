import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, User, File, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { UploadGroupDocumentDialog } from "./UploadGroupDocumentDialog";

interface GroupDocumentsProps {
  groupId: number;
  groupName: string;
}

interface GroupDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  description: string;
}

export function GroupDocuments({ groupId, groupName }: GroupDocumentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<GroupDocument | null>(null);

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ["group-documents", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_documents")
        .select("*")
        .eq("group_id", groupId)
        .order("upload_date", { ascending: false });

      if (error) throw error;
      return data as GroupDocument[];
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (document: GroupDocument) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("group-documents")
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("group_documents")
        .delete()
        .eq("id", document.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-documents", groupId] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    },
    onError: (error) => {
      let description = "Unknown error";
      if (error instanceof Error && error.message) {
        description = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        description = (error as any).message;
      } else {
        description = JSON.stringify(error);
      }
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
      console.error('Delete document error:', error);
    },
  });

  const handleDownload = async (document: GroupDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("group-documents")
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${document.file_name}`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (document: GroupDocument) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      deleteDocument.mutate(documentToDelete);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.includes("pdf")) return "bg-red-100 text-red-800";
    if (fileType.includes("word") || fileType.includes("document")) return "bg-blue-100 text-blue-800";
    if (fileType.includes("image")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Group Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading documents...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-neutral-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Group Documents</span>
              <Badge variant="secondary">{documents?.length || 0}</Badge>
            </CardTitle>
            <UploadGroupDocumentDialog 
              groupId={groupId} 
              groupName={groupName} 
              trigger={
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              } 
            />
          </div>
        </CardHeader>
        <CardContent>
          {!documents || documents.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-5 h-5 text-neutral-600 flex-shrink-0" />
                      <h4 className="text-sm font-medium text-neutral-900 truncate">
                        {document.file_name}
                      </h4>
                      <Badge className={getFileTypeColor(document.file_type)}>
                        {document.file_type.split("/")[1]?.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {document.description && (
                      <p className="text-sm text-neutral-600 mb-2">{document.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-neutral-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(document.upload_date), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <File className="w-3 h-3" />
                        <span>{formatFileSize(document.file_size)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(document)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentToDelete?.file_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteDocument.isPending}
            >
              {deleteDocument.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}