
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export function AddCouncilDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    region: "",
    contact_person: "",
    contact_phone: "",
    contact_email: "",
  });

  const addCouncilMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('councils')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['councils'] });
      toast({
        title: "Success",
        description: "Council added successfully",
      });
      setOpen(false);
      setFormData({
        name: "",
        code: "",
        region: "",
        contact_person: "",
        contact_phone: "",
        contact_email: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add council",
        variant: "destructive",
      });
      console.error('Error adding council:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Council name is required",
        variant: "destructive",
      });
      return;
    }
    addCouncilMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Council
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Council</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Council Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter council name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Enter council code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="Enter region"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              placeholder="Enter contact person name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              placeholder="Enter contact phone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="Enter contact email"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-amber-500 hover:bg-amber-600"
              disabled={addCouncilMutation.isPending}
            >
              {addCouncilMutation.isPending ? "Adding..." : "Add Council"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
