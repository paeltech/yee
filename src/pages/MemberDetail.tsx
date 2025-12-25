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
        <div className="animate-pulse space-y-8">
          <div className="flex items-center space-x-6">
            <div className="h-10 bg-neutral-100 dark:bg-stone-800 rounded-lg w-20"></div>
            <div className="w-16 h-16 bg-neutral-100 dark:bg-stone-800 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-8 bg-neutral-100 dark:bg-stone-800 rounded w-64"></div>
              <div className="h-4 bg-neutral-100 dark:bg-stone-800 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-neutral-100 dark:bg-stone-800 rounded-3xl"></div>
            <div className="h-96 bg-neutral-100 dark:bg-stone-800 rounded-3xl"></div>
          </div>
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
      <div className="space-y-8 min-h-screen">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/members">
              <Button variant="outline" size="sm" className="border-neutral-200 dark:border-stone-800 dark:text-stone-400 font-black uppercase tracking-widest text-[10px] h-10 px-4 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all">
                <ArrowLeft className="w-3 h-3 mr-2" />
                Back
              </Button>
            </Link>
            <div className="relative group">
              <Avatar className="w-20 h-20 border-2 border-brand-500 shadow-xl shadow-brand-500/20">
                <AvatarImage src={member.photo_url || undefined} alt={`${member.first_name} ${member.last_name}`} />
                <AvatarFallback className="text-2xl font-black bg-brand-50 dark:bg-stone-800 text-brand-600 dark:text-brand-500 uppercase tracking-widest">
                  {member.first_name[0]}{member.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <UploadMemberPhotoDialog
                  memberId={member.id}
                  memberName={`${member.first_name} ${member.last_name}`}
                  currentPhotoUrl={member.photo_url}
                  trigger={
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full p-0 shadow-xl bg-white dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 hover:bg-brand-500 hover:text-black transition-colors">
                      <Edit className="w-4 h-4" />
                    </Button>
                  }
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight leading-none">
                {member.first_name} {member.middle_name} {member.last_name}
              </h1>
              <p className="text-xs font-black text-neutral-400 dark:text-stone-500 uppercase tracking-widest mt-2">{member.groups?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <EditMemberDialog member={member} />
            <DeleteMemberDialog member={member} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="flex items-center text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  <User className="w-5 h-5 mr-3 text-brand-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Full Name</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{member.first_name} {member.middle_name} {member.last_name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Gender</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white">{member.gender}</p>
                  </div>
                  {member.date_of_birth && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Age</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white">{getAge(member.date_of_birth)} years old</p>
                    </div>
                  )}
                  {member.national_id && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">National ID</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white">{member.national_id}</p>
                    </div>
                  )}
                  {member.education_level && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Education Level</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white">{member.education_level}</p>
                    </div>
                  )}
                  {member.occupation && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Occupation</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white">{member.occupation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="flex items-center text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  <Phone className="w-5 h-5 mr-3 text-brand-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Mobile Number</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white">{member.mobile_number}</p>
                  </div>
                  {member.alternative_phone && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Alternative Phone</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white">{member.alternative_phone}</p>
                    </div>
                  )}
                  {member.email_address && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Email</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white break-all">{member.email_address}</p>
                    </div>
                  )}
                  {member.residential_address && (
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Residential Address</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white leading-relaxed">{member.residential_address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">Status & Role</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Membership Status</label>
                  <div className="mt-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block ${member.membership_status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-stone-800 dark:text-stone-400'
                      }`}>
                      {member.membership_status}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Role</label>
                  <p className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-widest">{member.member_role}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Member Number</label>
                  <p className="text-sm font-black text-neutral-900 dark:text-white">{member.member_number || 'Not assigned'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="flex items-center text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  <Calendar className="w-4 h-4 mr-3 text-brand-500" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Join Date</label>
                  <p className="text-sm font-black text-neutral-900 dark:text-white">{new Date(member.join_date).toLocaleDateString()}</p>
                </div>
                {member.exit_date && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Exit Date</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white">{new Date(member.exit_date).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="flex items-center text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  <MapPin className="w-4 h-4 mr-3 text-brand-500" />
                  Group Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Group</label>
                  <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{member.groups?.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Group Number</label>
                  <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{member.groups?.group_number}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Ward</label>
                  <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{member.groups?.wards?.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Council</label>
                  <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{member.groups?.wards?.councils?.name}</p>
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
