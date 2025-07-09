import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function GroupDocumentUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["groups-for-upload"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("id, name")
        .eq("status", "active")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 52428800) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedGroupId) {
      toast({
        title: "Missing Information",
        description: "Please select a file and group",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${selectedGroupId}/${Date.now()}_${selectedFile.name}`;
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("group-documents")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from("group_documents")
        .insert({
          group_id: parseInt(selectedGroupId),
          file_name: selectedFile.name,
          file_path: uploadData.path,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          description: description.trim() || null,
        });

      if (dbError) throw dbError;

      toast({
        title: "Document Uploaded",
        description: `${selectedFile.name} has been uploaded successfully`,
      });

      // Reset form
      setSelectedFile(null);
      setSelectedGroupId("");
      setDescription("");
      
      // Reset file input
      const fileInput = document.getElementById("document-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Upload className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-neutral-900">Group Documents</CardTitle>
            <p className="text-sm text-neutral-600">Upload documents for groups</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="group-select">Select Group</Label>
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a group" />
            </SelectTrigger>
            <SelectContent>
              {groupsLoading ? (
                <SelectItem value="loading" disabled>Loading groups...</SelectItem>
              ) : groups && groups.length > 0 ? (
                groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-groups" disabled>No groups available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="document-file">Document File</Label>
          <Input
            id="document-file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          <p className="text-xs text-neutral-500">
            Supported: PDF, Word documents, images, text files (max 50MB)
          </p>
        </div>

        {selectedFile && (
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">{selectedFile.name}</span>
              <span className="text-xs text-purple-600">
                ({Math.round(selectedFile.size / 1024)} KB)
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add a description for this document..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedGroupId || isUploading}
          className="w-full bg-purple-500 hover:bg-purple-600"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}