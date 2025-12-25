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
      <section className="py-32 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight">
              Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-neutral-50 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <section className="py-32 px-4 bg-white relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-neutral-900 mb-6 tracking-tight">
            Library & <span className="text-brand-600">Resources</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-medium">
            Access important documents, guides, and information to support your journey in the YEE Program.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documents.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group p-8 rounded-[2.5rem] border border-neutral-100 bg-white shadow-xl hover:shadow-2xl hover:border-brand-200 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500 group-hover:text-black transition-colors duration-500">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-neutral-900 line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors">
                    {doc.file_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(doc.upload_date), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>

              {doc.description && (
                <p className="text-neutral-600 mb-8 line-clamp-3 text-lg leading-relaxed font-medium">
                  {doc.description}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-neutral-200 hover:bg-neutral-50"
                  onClick={() => setViewingDocument(doc)}
                >
                  View Document
                </Button>
                <Button
                  variant="outline"
                  className="h-14 w-14 rounded-2xl border-neutral-200 hover:bg-brand-500 hover:border-brand-500 hover:text-black transition-all"
                  onClick={() => handleDownload(doc)}
                >
                  <Download className="w-5 h-5" />
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

