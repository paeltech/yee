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
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-64 bg-neutral-200 rounded"></div>
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/groups">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">{group.name}</h1>
              <p className="text-neutral-600">{group.group_number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <GroupDialog
              mode="edit"
              initialData={group}
              trigger={
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
              }
              onSuccess={() => queryClient.invalidateQueries({ queryKey: ["group", id] })}
            />
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Group</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this group? This action cannot be undone.</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Group Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Group Name</label>
                    <p className="text-neutral-900">{group.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Group Number</label>
                    <p className="text-neutral-900">{group.group_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Registration Date</label>
                    <p className="text-neutral-900">{new Date(group.registration_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Registration Number</label>
                    <p className="text-neutral-900">{group.registration_number || 'Not assigned'}</p>
                  </div>
                  {group.description && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-neutral-600">Description</label>
                      <p className="text-neutral-900">{group.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Meeting Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.meeting_day && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Meeting Day</label>
                      <p className="text-neutral-900">{group.meeting_day}</p>
                    </div>
                  )}
                  {group.meeting_time && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Meeting Time</label>
                      <p className="text-neutral-900">{group.meeting_time}</p>
                    </div>
                  )}
                  {group.meeting_location && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-neutral-600">Meeting Location</label>
                      <p className="text-neutral-900">{group.meeting_location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Members ({members?.length || 0})</CardTitle>
                  <AddMemberDialog />
                </div>
              </CardHeader>
              <CardContent>
                {members && members.length > 0 ? (
                  <div className="space-y-2">
                    {members.slice(0, 7).map((member) => (
                      <MemberDetailsDialog
                        key={member.id}
                        member={member}
                        trigger={
                          <div className="flex items-center justify-between p-2 border rounded hover:bg-neutral-50 cursor-pointer transition-colors">
                            <div>
                              <p className="font-medium">{member.first_name} {member.last_name}</p>
                              <p className="text-sm text-neutral-600">{member.member_role}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={member.membership_status === 'active' ? 'default' : 'secondary'}>
                                {member.membership_status}
                              </Badge>
                              <EditMemberDialog member={member} />
                              <DeleteMemberDialog member={member} />
                            </div>
                          </div>
                        }
                      />
                    ))}
                    {members.length > 7 && (
                      <p className="text-sm text-neutral-600 text-center">
                        and {members.length - 5} more members...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-600">No active members found.</p>
                )}
              </CardContent>
            </Card>

            <GroupDocuments groupId={parseInt(id!)} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                  {group.status}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">Ward</label>
                  <p className="text-neutral-900">{group.wards?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Council</label>
                  <p className="text-neutral-900">{group.wards?.councils?.name}</p>
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
              <CardContent className="space-y-4">
                {group.primary_contact_name && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Contact Person</label>
                    <p className="text-neutral-900">{group.primary_contact_name}</p>
                  </div>
                )}
                {group.primary_contact_phone && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Phone</label>
                    <p className="text-neutral-900">{group.primary_contact_phone}</p>
                  </div>
                )}
                {group.primary_contact_email && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Email</label>
                    <p className="text-neutral-900">{group.primary_contact_email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GroupDetail;
