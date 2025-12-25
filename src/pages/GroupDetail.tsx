import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Users, MapPin, Calendar, Phone } from "lucide-react";
import { GroupDocuments } from "@/components/groups/GroupDocuments";
import { GroupDialog } from "@/components/groups/GroupDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";
import { MemberDetailsDialog } from "@/components/members/MemberDetailsDialog";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { useState } from "react";

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: group, isLoading, error } = useQuery({
    queryKey: ['group', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          wards (
            name,
            councils (
              name
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

  const { data: members } = useQuery({
    queryKey: ['group-members', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('group_id', parseInt(id!))
        .eq('membership_status', 'active');

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("groups").delete().eq("id", group.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      navigate("/groups");
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-10 bg-neutral-100 dark:bg-stone-800 rounded-lg w-20"></div>
            <div className="space-y-2">
              <div className="h-8 bg-neutral-100 dark:bg-stone-800 rounded w-48"></div>
              <div className="h-4 bg-neutral-100 dark:bg-stone-800 rounded w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-neutral-100 dark:bg-stone-800 rounded-3xl"></div>
            <div className="h-96 bg-neutral-100 dark:bg-stone-800 rounded-3xl"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !group) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Group not found</h3>
          <Link to="/groups">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Groups
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
            <Link to="/groups">
              <Button variant="outline" size="sm" className="border-neutral-200 dark:border-stone-800 dark:text-stone-400 font-black uppercase tracking-widest text-[10px] h-10 px-4 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all">
                <ArrowLeft className="w-3 h-3 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight leading-none">{group.name}</h1>
              <p className="text-xs font-black text-neutral-400 dark:text-stone-500 uppercase tracking-widest mt-2">{group.group_number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <GroupDialog
              mode="edit"
              initialData={group}
              trigger={
                <Button variant="outline" size="sm" className="border-neutral-200 dark:border-stone-800 dark:text-stone-300 font-extrabold uppercase tracking-widest text-[10px] h-10 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all">
                  <Edit className="w-3 h-3 mr-2" />
                  Edit
                </Button>
              }
              onSuccess={() => queryClient.invalidateQueries({ queryKey: ["group", id] })}
            />
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="font-extrabold uppercase tracking-widest text-[10px] h-10 px-4 shadow-lg shadow-red-500/20">
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Delete Group</DialogTitle>
                </DialogHeader>
                <p className="text-neutral-600 dark:text-stone-400 font-medium">Are you sure you want to delete this group? This action cannot be undone and will remove all associated members and records.</p>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-neutral-200 dark:border-stone-800 dark:text-stone-400 font-bold uppercase tracking-widest text-[10px] h-10 px-6">Cancel</Button>
                  <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} className="font-bold uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-red-500/20 text-white">
                    {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="flex items-center text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  <Users className="w-5 h-5 mr-3 text-brand-500" />
                  Group Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Group Name</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white">{group.name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Group Number</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white">{group.group_number}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Registration Date</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white">{new Date(group.registration_date).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Registration Number</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white">{group.registration_number || 'Not assigned'}</p>
                  </div>
                  {group.description && (
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Description</label>
                      <p className="text-sm font-medium text-neutral-600 dark:text-stone-400 leading-relaxed">{group.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="flex items-center text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  <Calendar className="w-5 h-5 mr-3 text-brand-500" />
                  Meeting Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {group.meeting_day && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Meeting Day</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white">{group.meeting_day}</p>
                    </div>
                  )}
                  {group.meeting_time && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Meeting Time</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white">{group.meeting_time}</p>
                    </div>
                  )}
                  {group.meeting_location && (
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Meeting Location</label>
                      <p className="text-sm font-black text-neutral-900 dark:text-white">{group.meeting_location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">Members ({members?.length || 0})</CardTitle>
                <AddMemberDialog />
              </CardHeader>
              <CardContent className="pt-6">
                {members && members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {members.slice(0, 10).map((member) => (
                      <MemberDetailsDialog
                        key={member.id}
                        member={member}
                        trigger={
                          <div className="flex items-center justify-between p-4 border border-neutral-100 dark:border-stone-800/50 rounded-2xl hover:bg-neutral-50 dark:hover:bg-stone-800/30 cursor-pointer transition-all group">
                            <div>
                              <p className="text-sm font-black text-neutral-900 dark:text-white group-hover:text-brand-600 transition-colors uppercase tracking-tight">{member.first_name} {member.last_name}</p>
                              <p className="text-[10px] font-black text-neutral-400 dark:text-stone-500 uppercase tracking-widest mt-1">{member.member_role}</p>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${member.membership_status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-neutral-100 text-neutral-600 dark:bg-stone-800 dark:text-stone-400'
                              }`}>
                              {member.membership_status}
                            </span>
                          </div>
                        }
                      />
                    ))}
                    {members.length > 10 && (
                      <div className="md:col-span-2 py-4 text-center">
                        <Link to="/members" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500 hover:text-brand-500 transition-colors cursor-pointer">
                          View all {members.length} members
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-xs font-black uppercase tracking-widest text-neutral-500">No active members found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <GroupDocuments groupId={parseInt(id!)} groupName={group.name} />
          </div>

          <div className="space-y-8">
            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">Overall Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block ${group.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : group.status === 'suspended'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                  {group.status}
                </span>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="flex items-center text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  <MapPin className="w-4 h-4 mr-3 text-brand-500" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Ward</label>
                  <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{group.wards?.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Council</label>
                  <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{group.wards?.councils?.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-neutral-50 dark:border-stone-800 pb-4">
                <CardTitle className="flex items-center text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  <Phone className="w-4 h-4 mr-3 text-brand-500" />
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {group.primary_contact_name && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Contact Person</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{group.primary_contact_name}</p>
                  </div>
                )}
                {group.primary_contact_phone && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Phone</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{group.primary_contact_phone}</p>
                  </div>
                )}
                {group.primary_contact_email && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Email</label>
                    <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight break-all">{group.primary_contact_email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout >
  );
};

export default GroupDetail;
