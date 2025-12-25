import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, FileText, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DocumentViewerProps {
  document: {
    id: string;
    file_name: string;
    file_path: string;
    file_type: string | null;
    bucket?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentViewer({ document, open, onOpenChange }: DocumentViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const bucket = document.bucket || 'documents';

  const isImage = document.file_type?.startsWith('image/');
  const isPDF = document.file_type === 'application/pdf';

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: downloadError } = await supabase.storage
        .from(bucket)
        .download(document.file_path);

      if (downloadError) throw downloadError;

      const url = URL.createObjectURL(data);
      setViewUrl(url);
    } catch (err) {
      console.error('Error loading document:', err);
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // Load document when dialog opens
  useEffect(() => {
    if (open && !viewUrl) {
      loadDocument();
    }
  }, [open]);

  // Cleanup URL when dialog closes
  const handleClose = () => {
    if (viewUrl) {
      URL.revokeObjectURL(viewUrl);
      setViewUrl(null);
    }
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {document.file_name}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                <p className="text-neutral-600">Loading document...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">{error}</p>
                <Button onClick={loadDocument} variant="outline">
                  Retry
                </Button>
              </div>
            </div>
          )}

          {viewUrl && !loading && !error && (
            <div className="border rounded-lg overflow-hidden">
              {isImage ? (
                <div className="flex items-center justify-center bg-neutral-50 p-4">
                  <img
                    src={viewUrl}
                    alt={document.file_name}
                    className="max-w-full max-h-[70vh] object-contain"
                    onLoad={() => setLoading(false)}
                  />
                </div>
              ) : isPDF ? (
                <iframe
                  src={viewUrl}
                  className="w-full h-[70vh] border-0"
                  title={document.file_name}
                  onLoad={() => setLoading(false)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-96 bg-neutral-50 p-8">
                  <FileText className="w-16 h-16 text-neutral-400 mb-4" />
                  <p className="text-neutral-600 mb-4">
                    Preview not available for this file type
                  </p>
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download to view
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

