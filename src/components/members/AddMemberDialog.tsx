
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
import { Plus, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    mobile_number: "",
    alternative_phone: "",
    email_address: "",
    residential_address: "",
    postal_address: "",
    national_id: "",
    education_level: "",
    occupation: "",
    monthly_income: "",
    group_id: "",
    member_role: "Member",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreview(null);
    const fileInput = document.getElementById('member-photo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const { data: groups } = useQuery({
    queryKey: ['groups-for-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          wards (
            name,
            councils (
              name
            )
          )
        `)
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: memberData, error } = await supabase
        .from('members')
        .insert([{
          ...data,
          group_id: parseInt(data.group_id),
          monthly_income: data.monthly_income ? parseFloat(data.monthly_income) : null,
        }])
        .select()
        .single();

      if (error) throw error;

      // Handle photo upload if a file was selected
      if (selectedFile && memberData) {
        setIsUploading(true);
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `members/${memberData.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, selectedFile);

        if (uploadError) {
          toast({
            title: "Photo Upload Failed",
            description: "Member was created, but the photo could not be uploaded.",
            variant: "destructive",
          });
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('photos')
            .getPublicUrl(fileName);

          await supabase
            .from('members')
            .update({ photo_url: publicUrl })
            .eq('id', memberData.id);
        }
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({
        title: "Success",
        description: "Member added successfully",
      });
      setOpen(false);
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        mobile_number: "",
        alternative_phone: "",
        email_address: "",
        residential_address: "",
        postal_address: "",
        national_id: "",
        education_level: "",
        occupation: "",
        monthly_income: "",
        group_id: "",
        member_role: "Member",
      });
      setSelectedFile(null);
      setPreview(null);
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
      console.error('Error adding member:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.gender || !formData.mobile_number.trim() || !formData.group_id) {
      toast({
        title: "Error",
        description: "First name, last name, gender, mobile number, and group are required",
        variant: "destructive",
      });
      return;
    }
    addMemberMutation.mutate(formData);
  };

  const memberRoles = [
    "Chair Person", "Vice Chair", "Secretary", "Treasurer", "Finance Officer", "Member"
  ];

  const educationLevels = [
    "Primary", "Secondary", "Certificate", "Diploma", "Degree", "Masters", "PhD"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-500 text-black hover:bg-brand-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 py-2">
            <Avatar className="w-24 h-24 border-2 border-brand-500 shadow-sm">
              <AvatarImage src={preview || undefined} />
              <AvatarFallback className="bg-brand-50 text-brand-600 text-2xl">
                {formData.first_name?.[0] || '?'}{formData.last_name?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="member-photo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  {selectedFile ? "Change Photo" : "Upload Photo"}
                </div>
              </Label>
              <Input
                id="member-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={addMemberMutation.isPending || isUploading}
              />
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7"
                >
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="First name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                value={formData.middle_name}
                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                placeholder="Middle name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile_number">Mobile Number *</Label>
              <Input
                id="mobile_number"
                value={formData.mobile_number}
                onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                placeholder="Mobile number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alternative_phone">Alternative Phone</Label>
              <Input
                id="alternative_phone"
                value={formData.alternative_phone}
                onChange={(e) => setFormData({ ...formData, alternative_phone: e.target.value })}
                placeholder="Alternative phone"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email_address">Email Address</Label>
            <Input
              id="email_address"
              type="email"
              value={formData.email_address}
              onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
              placeholder="Email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="residential_address">Residential Address</Label>
            <Textarea
              id="residential_address"
              value={formData.residential_address}
              onChange={(e) => setFormData({ ...formData, residential_address: e.target.value })}
              placeholder="Residential address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="national_id">National ID</Label>
              <Input
                id="national_id"
                value={formData.national_id}
                onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                placeholder="National ID"
              />
            </div>
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select
                value={formData.education_level}
                onValueChange={(value) => setFormData({ ...formData, education_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Occupation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_income">Monthly Income (TSh)</Label>
              <Input
                id="monthly_income"
                type="number"
                value={formData.monthly_income}
                onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                placeholder="Monthly income"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Group *</Label>
              <Select
                value={formData.group_id}
                onValueChange={(value) => setFormData({ ...formData, group_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name} - {group.wards?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Member Role</Label>
              <Select
                value={formData.member_role}
                onValueChange={(value) => setFormData({ ...formData, member_role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {memberRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-500 text-black hover:bg-brand-600"
              disabled={addMemberMutation.isPending}
            >
              {addMemberMutation.isPending ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
