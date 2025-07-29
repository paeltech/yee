import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Ward name is required"),
  ward_code: z.string().optional(),
  population: z.string().optional(),
  area_km2: z.string().optional(),
  description: z.string().optional(),
  council_id: z.string().min(1, "Council is required"),
  status: z.enum(["active", "inactive"]),
});

type FormData = z.infer<typeof formSchema>;

interface EditWardDialogProps {
  ward: any;
}

export function EditWardDialog({ ward }: EditWardDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: councils } = useQuery({
    queryKey: ['councils-for-wards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('councils')
        .select('id, name, code')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ward.name || "",
      ward_code: ward.ward_code || "",
      population: ward.population?.toString() || "",
      area_km2: ward.area_km2?.toString() || "",
      description: ward.description || "",
      council_id: ward.council_id?.toString() || "",
      status: ward.status || "active",
    },
  });

  const updateWard = useMutation({
    mutationFn: async (data: FormData) => {
      const updateData = {
        ...data,
        council_id: parseInt(data.council_id),
        population: data.population ? parseInt(data.population) : null,
        area_km2: data.area_km2 ? parseFloat(data.area_km2) : null,
      };

      const { error } = await supabase
        .from('wards')
        .update(updateData)
        .eq('id', ward.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wards'] });
      toast({
        title: "Success",
        description: "Ward updated successfully",
      });
      setOpen(false);
      form.reset();
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
      console.error('Update ward error:', error);
    },
  });

  const onSubmit = (data: FormData) => {
    updateWard.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Ward</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ward_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="council_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Council *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select council" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {councils?.map((council) => (
                          <SelectItem key={council.id} value={council.id.toString()}>
                            {council.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="population"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Population</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area_km2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (km²)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateWard.isPending}>
                {updateWard.isPending ? "Updating..." : "Update Ward"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 