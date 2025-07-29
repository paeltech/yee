
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
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female"]),
  date_of_birth: z.string().optional(),
  mobile_number: z.string().min(1, "Mobile number is required"),
  alternative_phone: z.string().optional(),
  email_address: z.string().email().optional().or(z.literal("")),
  residential_address: z.string().optional(),
  postal_address: z.string().optional(),
  national_id: z.string().optional(),
  passport_number: z.string().optional(),
  education_level: z.string().optional(),
  occupation: z.string().optional(),
  monthly_income: z.string().optional(),
  group_id: z.string().min(1, "Group is required"),
  member_role: z.enum(["Chair Person", "Vice Chair", "Secretary", "Treasurer", "Finance Officer", "Member"]),
  membership_status: z.enum(["active", "inactive", "suspended", "left"]),
  member_number: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditMemberDialogProps {
  member: any;
}

export function EditMemberDialog({ member }: EditMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups } = useQuery({
    queryKey: ['groups-for-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('id, name, group_number')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: member.first_name || "",
      middle_name: member.middle_name || "",
      last_name: member.last_name || "",
      gender: member.gender || "Male",
      date_of_birth: member.date_of_birth || "",
      mobile_number: member.mobile_number || "",
      alternative_phone: member.alternative_phone || "",
      email_address: member.email_address || "",
      residential_address: member.residential_address || "",
      postal_address: member.postal_address || "",
      national_id: member.national_id || "",
      passport_number: member.passport_number || "",
      education_level: member.education_level || "",
      occupation: member.occupation || "",
      monthly_income: member.monthly_income?.toString() || "",
      group_id: member.group_id?.toString() || "",
      member_role: member.member_role || "Member",
      membership_status: member.membership_status || "active",
      member_number: member.member_number || "",
    },
  });

  const updateMember = useMutation({
    mutationFn: async (data: FormData) => {
      const updateData = {
        ...data,
        group_id: parseInt(data.group_id),
        monthly_income: data.monthly_income ? parseFloat(data.monthly_income) : null,
        date_of_birth: data.date_of_birth || null,
      };

      const { error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', member.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', member.id.toString()] });
      toast({
        title: "Success",
        description: "Member updated successfully",
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
      console.error('Update member error:', error);
    },
  });

  const onSubmit = (data: FormData) => {
    updateMember.mutate(data);
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
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
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
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="group_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups?.map((group) => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name} ({group.group_number})
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
                name="member_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Chair Person">Chair Person</SelectItem>
                        <SelectItem value="Vice Chair">Vice Chair</SelectItem>
                        <SelectItem value="Secretary">Secretary</SelectItem>
                        <SelectItem value="Treasurer">Treasurer</SelectItem>
                        <SelectItem value="Finance Officer">Finance Officer</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="membership_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMember.isPending}>
                {updateMember.isPending ? "Updating..." : "Update Member"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
