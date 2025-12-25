import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityPhotoGalleryProps {
  activityId: number;
  canManage?: boolean;
}

interface ActivityPhoto {
  id: string;
  photo_url: string;
  photo_path: string;
  uploaded_at: string;
}

export function ActivityPhotoGallery({ activityId, canManage = false }: ActivityPhotoGalleryProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: photos, isLoading } = useQuery<ActivityPhoto[]>({
    queryKey: ['activity-photos', activityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_photos')
        .select('*')
        .eq('activity_id', activityId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data as ActivityPhoto[];
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photo: ActivityPhoto) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.photo_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('activity_photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-photos', activityId] });
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
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

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `activities/${activityId}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('activity_photos')
        .insert({
          activity_id: activityId,
          photo_url: publicUrl,
          photo_path: fileName,
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['activity-photos', activityId] });
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4 text-neutral-500 dark:text-stone-500 font-black uppercase tracking-widest text-[10px]">
        Loading photos...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div>
          <label htmlFor={`activity-photo-upload-${activityId}`}>
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={uploading}
              className="w-full dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 font-extrabold uppercase tracking-widest text-[10px] h-10"
            >
              <span>
                <Plus className="w-4 h-4 mr-2 text-brand-500" />
                {uploading ? "Uploading..." : "Add Photo"}
              </span>
            </Button>
          </label>
          <input
            id={`activity-photo-upload-${activityId}`}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {photos && photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="relative group overflow-hidden dark:bg-stone-900 dark:border-stone-800 shadow-sm transition-all duration-300 hover:shadow-xl dark:hover:shadow-brand-500/5">
              <CardContent className="p-0">
                <div
                  className="aspect-square cursor-pointer"
                  onClick={() => setSelectedPhoto(photo.photo_url)}
                >
                  <img
                    src={photo.photo_url}
                    alt={`Activity photo ${photo.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {canManage && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhotoMutation.mutate(photo);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-neutral-500 dark:text-stone-600 border border-dashed rounded-xl dark:bg-stone-950/30 dark:border-stone-800/50 transition-colors">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 text-neutral-300 dark:text-stone-700" />
          <p className="font-black uppercase tracking-widest text-[10px]">No photos uploaded yet</p>
          {canManage && (
            <p className="text-[10px] mt-2 opacity-60">Click "Add Photo" to upload images</p>
          )}
        </div>
      )}

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl dark:bg-stone-900 dark:border-stone-800 p-2">
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Activity photo"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

