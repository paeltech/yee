import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UploadGroupPhotoDialogProps {
  groupId: number;
  groupName: string;
  currentPhotoUrl?: string | null;
  trigger?: React.ReactNode;
}

export function UploadGroupPhotoDialog({ 
  groupId, 
  groupName,
  currentPhotoUrl,
  trigger 
}: UploadGroupPhotoDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file (JPEG, PNG, or WebP)",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhotoMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");

      setIsUploading(true);

      // Delete old photo if exists
      if (currentPhotoUrl) {
        const oldPath = currentPhotoUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('photos').remove([oldPath]);
      }

      // Upload new photo
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `groups/${groupId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // Update group record
      const { error: updateError } = await supabase
        .from('groups')
        .update({ photo_url: publicUrl })
        .eq('id', groupId);

      if (updateError) throw updateError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
      setOpen(false);
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(currentPhotoUrl || null);
    const fileInput = document.getElementById(`group-photo-${groupId}`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSave = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a photo to upload",
        variant: "destructive",
      });
      return;
    }
    uploadPhotoMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            {currentPhotoUrl ? "Change Photo" : "Upload Photo"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Group Photo</DialogTitle>
          <DialogDescription>
            Upload a photo for {groupName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={preview || undefined} alt={groupName} />
              <AvatarFallback className="text-2xl">
                {groupName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`group-photo-${groupId}`}>Select Photo</Label>
            <div className="flex items-center gap-2">
              <Input
                id={`group-photo-${groupId}`}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={isUploading}
                className="flex-1"
              />
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-neutral-500">
              Supported formats: JPEG, PNG, WebP. Max size: 10MB
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedFile || isUploading}
              className="bg-brand-500 text-black hover:bg-brand-600"
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

