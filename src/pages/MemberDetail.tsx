import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, User, Phone, Mail, MapPin, Calendar, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadMemberPhotoDialog } from "@/components/members/UploadMemberPhotoDialog";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";

const MemberDetail = () => {
  const { id } = useParams();

  const { data: member, isLoading, error } = useQuery({
    queryKey: ['member', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          groups (
            name,
            group_number,
            wards (
              name,
              councils (
                name
              )
            )
          )
        `)
        .eq('id', parseInt(id!))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-64 bg-neutral-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  if (error || !member) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Member not found</h3>
          <Link to="/members">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Members
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/members">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="relative group">
              <Avatar className="w-16 h-16 border-2 border-brand-500">
                <AvatarImage src={member.photo_url || undefined} alt={`${member.first_name} ${member.last_name}`} />
                <AvatarFallback className="text-xl bg-brand-100 text-brand-600">
                  {member.first_name[0]}{member.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <UploadMemberPhotoDialog
                  memberId={member.id}
                  memberName={`${member.first_name} ${member.last_name}`}
                  currentPhotoUrl={member.photo_url}
                  trigger={
                    <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full p-0 shadow-sm border border-neutral-200">
                      <Edit className="w-3 h-3" />
                    </Button>
                  }
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                {member.first_name} {member.middle_name} {member.last_name}
              </h1>
              <p className="text-neutral-600">{member.groups?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <EditMemberDialog member={member} />
            <DeleteMemberDialog member={member} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Full Name</label>
                    <p className="text-neutral-900">{member.first_name} {member.middle_name} {member.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Gender</label>
                    <p className="text-neutral-900">{member.gender}</p>
                  </div>
                  {member.date_of_birth && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Age</label>
                      <p className="text-neutral-900">{getAge(member.date_of_birth)} years old</p>
                    </div>
                  )}
                  {member.national_id && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">National ID</label>
                      <p className="text-neutral-900">{member.national_id}</p>
                    </div>
                  )}
                  {member.education_level && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Education Level</label>
                      <p className="text-neutral-900">{member.education_level}</p>
                    </div>
                  )}
                  {member.occupation && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Occupation</label>
                      <p className="text-neutral-900">{member.occupation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Mobile Number</label>
                    <p className="text-neutral-900">{member.mobile_number}</p>
                  </div>
                  {member.alternative_phone && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Alternative Phone</label>
                      <p className="text-neutral-900">{member.alternative_phone}</p>
                    </div>
                  )}
                  {member.email_address && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Email</label>
                      <p className="text-neutral-900">{member.email_address}</p>
                    </div>
                  )}
                  {member.residential_address && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-neutral-600">Residential Address</label>
                      <p className="text-neutral-900">{member.residential_address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status & Role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">Membership Status</label>
                  <div className="mt-1">
                    <Badge variant={member.membership_status === 'active' ? 'default' : 'secondary'}>
                      {member.membership_status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Role</label>
                  <p className="text-neutral-900">{member.member_role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Member Number</label>
                  <p className="text-neutral-900">{member.member_number || 'Not assigned'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Membership Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">Join Date</label>
                  <p className="text-neutral-900">{new Date(member.join_date).toLocaleDateString()}</p>
                </div>
                {member.exit_date && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Exit Date</label>
                    <p className="text-neutral-900">{new Date(member.exit_date).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Group Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">Group</label>
                  <p className="text-neutral-900">{member.groups?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Group Number</label>
                  <p className="text-neutral-900">{member.groups?.group_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Ward</label>
                  <p className="text-neutral-900">{member.groups?.wards?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Council</label>
                  <p className="text-neutral-900">{member.groups?.wards?.councils?.name}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemberDetail;
