import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Trash2, Calendar, File, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { DocumentViewer } from "@/components/DocumentViewer";
import type { Database } from "@/integrations/supabase/types";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

export function DocumentList() {
  const { toast } = useToast();
  const [viewingDocument, setViewingDocument] = useState<DocumentRow | null>(null);

  const { data: documents, isLoading, refetch } = useQuery<DocumentRow[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("upload_date", { ascending: false });
      if (error) throw error;
      return data as DocumentRow[];
    },
  });

  const deleteMutation = useMutation<void, Error, DocumentRow>({
    mutationFn: async (doc) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([doc.file_path]);
      if (storageError) throw storageError;
      // Delete from table
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", doc.id);
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast({ title: "Document Deleted", description: "The document has been deleted." });
      refetch();
    },
    onError: () => {
      toast({ title: "Delete Failed", description: "Failed to delete the document.", variant: "destructive" });
    },
  });

  const handleDownload = async (doc: DocumentRow) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(doc.file_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Download Started", description: `Downloading ${doc.file_name}` });
    } catch (error) {
      console.error("Download error:", error);
      toast({ title: "Download Failed", description: "Failed to download the document", variant: "destructive" });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading documents...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Documents</span>
          <Badge variant="secondary">{documents?.length || 0}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!documents || documents.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-neutral-600 flex-shrink-0" />
                    <h4 className="text-sm font-medium text-neutral-900 truncate">
                      {doc.file_name}
                    </h4>
                  </div>
                  {doc.description && (
                    <p className="text-sm text-neutral-600 mb-2">{doc.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-neutral-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(doc.upload_date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <File className="w-3 h-3" />
                      <span>{formatFileSize(doc.file_size)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button size="icon" variant="ghost" onClick={() => setViewingDocument(doc)} title="View">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDownload(doc)} title="Download">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(doc)} disabled={deleteMutation.isPending} title="Delete">
                    {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {viewingDocument && (
        <DocumentViewer
          document={{
            ...viewingDocument,
            bucket: 'documents'
          }}
          open={!!viewingDocument}
          onOpenChange={(open) => !open && setViewingDocument(null)}
        />
      )}
    </Card>
  );
} 