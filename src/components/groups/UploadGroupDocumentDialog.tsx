import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText } from "lucide-react";

interface UploadGroupDocumentDialogProps {
  groupId: number;
  groupName: string;
  trigger: React.ReactNode;
}

export function UploadGroupDocumentDialog({ groupId, groupName, trigger }: UploadGroupDocumentDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadDocument = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");

      setIsUploading(true);

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${groupId}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("group-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save to database
      const { error: dbError } = await supabase
        .from("group_documents")
        .insert({
          group_id: groupId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          description: description.trim() || null,
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-documents", groupId] });
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      setOpen(false);
      setFile(null);
      setDescription("");
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
      console.error('Upload document error:', error);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    uploadDocument.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document to {groupName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              required
            />
            {file && (
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
                <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!file || isUploading}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 