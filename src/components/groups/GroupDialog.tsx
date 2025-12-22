import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { generateUniqueGroupId } from "@/lib/groupId";

export function GroupDialog({
  mode,
  initialData,
  onSuccess,
  trigger,
}: {
  mode: "add" | "edit";
  initialData?: any;
  onSuccess?: () => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [generatingId, setGeneratingId] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    group_number: "",
    ward_id: "",
    description: "",
    meeting_day: "",
    meeting_time: "",
    meeting_location: "",
    primary_contact_name: "",
    primary_contact_phone: "",
    primary_contact_email: "",
  });

  // Generate unique group ID when dialog opens in add mode
  const generateGroupNumber = async () => {
    setGeneratingId(true);
    try {
      const uniqueId = await generateUniqueGroupId(supabase, initialData?.id);
      setFormData(prev => ({ ...prev, group_number: uniqueId }));
    } catch (error) {
      console.error('Error generating group ID:', error);
      toast({
        title: "Error",
        description: "Failed to generate group ID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingId(false);
    }
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        group_number: initialData.group_number || "",
        ward_id: initialData.ward_id ? initialData.ward_id.toString() : "",
        description: initialData.description || "",
        meeting_day: initialData.meeting_day || "",
        meeting_time: initialData.meeting_time || "",
        meeting_location: initialData.meeting_location || "",
        primary_contact_name: initialData.primary_contact_name || "",
        primary_contact_phone: initialData.primary_contact_phone || "",
        primary_contact_email: initialData.primary_contact_email || "",
      });
    } else if (mode === "add") {
      const resetData = {
        name: "",
        group_number: "",
        ward_id: "",
        description: "",
        meeting_day: "",
        meeting_time: "",
        meeting_location: "",
        primary_contact_name: "",
        primary_contact_phone: "",
        primary_contact_email: "",
      };
      setFormData(resetData);
    }
  }, [mode, initialData]);

  // Generate ID when dialog opens in add mode
  useEffect(() => {
    if (open && mode === "add" && !formData.group_number) {
      generateGroupNumber();
    }
  }, [open, mode]);

  const { data: wards } = useQuery({
    queryKey: ["wards-for-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wards")
        .select(`
          id,
          name,
          councils (
            name
          )
        `)
        .eq("status", "active")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (mode === "add") {
        const { error } = await supabase
          .from("groups")
          .insert([
            {
              ...data,
              ward_id: parseInt(data.ward_id),
            },
          ]);
        if (error) throw error;
      } else if (mode === "edit" && initialData) {
        const { error } = await supabase
          .from("groups")
          .update({
            ...data,
            ward_id: parseInt(data.ward_id),
          })
          .eq("id", initialData.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group", initialData?.id] });
      toast({
        title: "Success",
        description: mode === "add" ? "Group added successfully" : "Group updated successfully",
      });
      setOpen(false);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: mode === "add" ? "Failed to add group" : "Failed to update group",
        variant: "destructive",
      });
      console.error("Error saving group:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.ward_id) {
      toast({
        title: "Error",
        description: "Group name and ward are required",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(formData);
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Group" : "Edit Group"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter group name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group_number">Group Number</Label>
              {mode === "add" ? (
                <div className="flex gap-2">
                  <Input
                    id="group_number"
                    value={formData.group_number}
                    readOnly
                    className="bg-neutral-50 font-mono font-semibold text-center"
                    placeholder={generatingId ? "Generating..." : "Auto-generated"}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateGroupNumber}
                    disabled={generatingId}
                    title="Generate new ID"
                  >
                    <RefreshCw className={`w-4 h-4 ${generatingId ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              ) : (
                <Input
                  id="group_number"
                  value={formData.group_number}
                  readOnly
                  className="bg-neutral-50 font-mono font-semibold"
                  placeholder="Group number"
                />
              )}
              <p className="text-xs text-neutral-500">
                {mode === "add" ? "Unique 6-character ID (auto-generated)" : "Group ID (cannot be changed)"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ward *</Label>
            <Select
              value={formData.ward_id}
              onValueChange={(value) => setFormData({ ...formData, ward_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a ward" />
              </SelectTrigger>
              <SelectContent>
                {wards?.map((ward) => (
                  <SelectItem key={ward.id} value={ward.id.toString()}>
                    {ward.name} - {ward.councils?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter group description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meeting Day</Label>
              <Select
                value={formData.meeting_day}
                onValueChange={(value) => setFormData({ ...formData, meeting_day: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_time">Meeting Time</Label>
              <Input
                id="meeting_time"
                type="time"
                value={formData.meeting_time}
                onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting_location">Meeting Location</Label>
            <Input
              id="meeting_location"
              value={formData.meeting_location}
              onChange={(e) => setFormData({ ...formData, meeting_location: e.target.value })}
              placeholder="Enter meeting location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary_contact_name">Primary Contact Name</Label>
            <Input
              id="primary_contact_name"
              value={formData.primary_contact_name}
              onChange={(e) => setFormData({ ...formData, primary_contact_name: e.target.value })}
              placeholder="Enter contact name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_contact_phone">Contact Phone</Label>
              <Input
                id="primary_contact_phone"
                value={formData.primary_contact_phone}
                onChange={(e) => setFormData({ ...formData, primary_contact_phone: e.target.value })}
                placeholder="Enter contact phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_contact_email">Contact Email</Label>
              <Input
                id="primary_contact_email"
                value={formData.primary_contact_email}
                onChange={(e) => setFormData({ ...formData, primary_contact_email: e.target.value })}
                placeholder="Enter contact email"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
              {mode === "add" ? "Add Group" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 