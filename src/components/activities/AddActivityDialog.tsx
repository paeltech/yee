
import { useState } from "react";
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
import { Plus } from "lucide-react";

export function AddActivityDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    activity_name: "",
    activity_type: "",
    activity_date: "",
    location: "",
    description: "",
    attendees_count: "",
    budget_allocated: "",
    group_id: "",
  });

  const { data: groups } = useQuery({
    queryKey: ['groups-for-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          wards (
            name
          )
        `)
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('group_activities')
        .insert([{
          ...data,
          group_id: parseInt(data.group_id),
          attendees_count: data.attendees_count ? parseInt(data.attendees_count) : null,
          budget_allocated: data.budget_allocated ? parseFloat(data.budget_allocated) : null,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success",
        description: "Activity added successfully",
      });
      setOpen(false);
      setFormData({
        activity_name: "",
        activity_type: "",
        activity_date: "",
        location: "",
        description: "",
        attendees_count: "",
        budget_allocated: "",
        group_id: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add activity",
        variant: "destructive",
      });
      console.error('Error adding activity:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity_name.trim() || !formData.activity_date || !formData.group_id) {
      toast({
        title: "Error",
        description: "Activity name, date, and group are required",
        variant: "destructive",
      });
      return;
    }
    addActivityMutation.mutate(formData);
  };

  const activityTypes = [
    "Training", "Meeting", "Community Service", "Sports", "Cultural", "Educational", "Health", "Business", "Other"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-500 text-black hover:bg-brand-600 font-extrabold uppercase tracking-widest text-xs px-6 py-4 h-auto shadow-lg shadow-brand-500/20 transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto dark:bg-stone-900 dark:border-stone-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight dark:text-white">Add New Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity_name" className="dark:text-stone-500 font-black uppercase tracking-widest text-[10px]">Activity Name *</Label>
            <Input
              id="activity_name"
              value={formData.activity_name}
              onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
              placeholder="Enter activity name"
              required
              className="dark:bg-stone-950/50 dark:border-stone-800 dark:text-white placeholder:dark:text-stone-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="dark:text-stone-500 font-black uppercase tracking-widest text-[10px]">Activity Type</Label>
              <Select
                value={formData.activity_type}
                onValueChange={(value) => setFormData({ ...formData, activity_type: value })}
              >
                <SelectTrigger className="dark:bg-stone-950/50 dark:border-stone-800 dark:text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-stone-900 dark:border-stone-800">
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type} className="dark:text-stone-300 focus:dark:bg-stone-800">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity_date" className="dark:text-stone-500 font-black uppercase tracking-widest text-[10px]">Activity Date *</Label>
              <Input
                id="activity_date"
                type="date"
                value={formData.activity_date}
                onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                required
                className="dark:bg-stone-950/50 dark:border-stone-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="dark:text-stone-500 font-black uppercase tracking-widest text-[10px]">Group *</Label>
            <Select
              value={formData.group_id}
              onValueChange={(value) => setFormData({ ...formData, group_id: value })}
            >
              <SelectTrigger className="dark:bg-stone-950/50 dark:border-stone-800 dark:text-white">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent className="dark:bg-stone-900 dark:border-stone-800">
                {groups?.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()} className="dark:text-stone-300 focus:dark:bg-stone-800">
                    {group.name} - {group.wards?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="dark:text-stone-500 font-black uppercase tracking-widest text-[10px]">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter location"
              className="dark:bg-stone-950/50 dark:border-stone-800 dark:text-white placeholder:dark:text-stone-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-stone-500 font-black uppercase tracking-widest text-[10px]">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter activity description"
              rows={3}
              className="dark:bg-stone-950/50 dark:border-stone-800 dark:text-white placeholder:dark:text-stone-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attendees_count" className="dark:text-stone-500 font-black uppercase tracking-widest text-[10px]">Expected Attendees</Label>
              <Input
                id="attendees_count"
                type="number"
                value={formData.attendees_count}
                onChange={(e) => setFormData({ ...formData, attendees_count: e.target.value })}
                placeholder="Number of attendees"
                className="dark:bg-stone-950/50 dark:border-stone-800 dark:text-white placeholder:dark:text-stone-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_allocated" className="dark:text-stone-500 font-black uppercase tracking-widest text-[10px]">Budget (TSh)</Label>
              <Input
                id="budget_allocated"
                type="number"
                value={formData.budget_allocated}
                onChange={(e) => setFormData({ ...formData, budget_allocated: e.target.value })}
                placeholder="Budget allocated"
                className="dark:bg-stone-950/50 dark:border-stone-800 dark:text-white placeholder:dark:text-stone-700"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="dark:border-stone-800 dark:text-stone-400 font-black uppercase tracking-widest text-[10px]">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-500 text-black hover:bg-brand-600 font-black uppercase tracking-widest text-[10px] px-8 shadow-lg shadow-brand-500/20"
              disabled={addActivityMutation.isPending}
            >
              {addActivityMutation.isPending ? "Adding..." : "Add Activity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
