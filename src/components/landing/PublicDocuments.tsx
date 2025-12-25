import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useState } from "react";
import { motion } from "framer-motion";

export function PublicDocuments() {
  const [viewingDocument, setViewingDocument] = useState<any | null>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["public-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("upload_date", { ascending: false })
        .limit(9);

      if (error) throw error;
      return data;
    },
  });

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
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Resources
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
    <section className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Resources
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Access important documents and information about the YEE Program
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="border border-neutral-200 rounded-lg p-6 hover:border-brand-300 transition-colors"
            >
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">{doc.file_name}</h3>
              </div>

              {doc.description && (
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{doc.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(doc.upload_date), "MMM d, yyyy")}</span>
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
            </motion.div>
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

