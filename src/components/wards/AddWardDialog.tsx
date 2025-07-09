
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
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export function AddWardDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    council_id: "",
    ward_code: "",
    population: "",
    area_km2: "",
  });

  const { data: councils } = useQuery({
    queryKey: ['councils'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('councils')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const addWardMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('wards')
        .insert([{
          ...data,
          council_id: parseInt(data.council_id),
          population: data.population ? parseInt(data.population) : null,
          area_km2: data.area_km2 ? parseFloat(data.area_km2) : null,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wards'] });
      toast({
        title: "Success",
        description: "Ward added successfully",
      });
      setOpen(false);
      setFormData({
        name: "",
        council_id: "",
        ward_code: "",
        population: "",
        area_km2: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add ward",
        variant: "destructive",
      });
      console.error('Error adding ward:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.council_id) {
      toast({
        title: "Error",
        description: "Ward name and council are required",
        variant: "destructive",
      });
      return;
    }
    addWardMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Ward
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Ward</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ward Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter ward name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Council *</Label>
            <Select 
              value={formData.council_id} 
              onValueChange={(value) => setFormData({ ...formData, council_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a council" />
              </SelectTrigger>
              <SelectContent>
                {councils?.map((council) => (
                  <SelectItem key={council.id} value={council.id.toString()}>
                    {council.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ward_code">Ward Code</Label>
            <Input
              id="ward_code"
              value={formData.ward_code}
              onChange={(e) => setFormData({ ...formData, ward_code: e.target.value })}
              placeholder="Enter ward code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="population">Population</Label>
            <Input
              id="population"
              type="number"
              value={formData.population}
              onChange={(e) => setFormData({ ...formData, population: e.target.value })}
              placeholder="Enter population"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area_km2">Area (km²)</Label>
            <Input
              id="area_km2"
              type="number"
              step="0.01"
              value={formData.area_km2}
              onChange={(e) => setFormData({ ...formData, area_km2: e.target.value })}
              placeholder="Enter area in km²"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-amber-500 hover:bg-amber-600"
              disabled={addWardMutation.isPending}
            >
              {addWardMutation.isPending ? "Adding..." : "Add Ward"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
