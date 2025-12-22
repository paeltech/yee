import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, File } from "lucide-react";
import { format } from "date-fns";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useState } from "react";

export function PublicDocuments() {
  const [viewingDocument, setViewingDocument] = useState<any | null>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["public-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("upload_date", { ascending: false })
        .limit(12); // Show latest 12 documents
      
      if (error) throw error;
      return data;
    },
  });

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = async (doc: any) => {
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
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-neutral-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Resources & Documents
            </h2>
            <p className="text-lg text-neutral-600">Loading documents...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-neutral-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Resources & Documents
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Access important documents, resources, and information about the YEE Program
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="border-neutral-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg flex-1 line-clamp-2">{doc.file_name}</CardTitle>
                </div>
                {doc.description && (
                  <p className="text-sm text-neutral-600 line-clamp-2">{doc.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(doc.upload_date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <File className="w-3 h-3" />
                      <span>{formatFileSize(doc.file_size)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setViewingDocument(doc)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
      </div>
    </section>
  );
}

