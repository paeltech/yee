
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { Search, User, Phone, Mail, Eye, LayoutGrid, LayoutList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AddMemberDialog } from "./AddMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { DeleteMemberDialog } from "./DeleteMemberDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const { toast } = useToast();
  const { user, canManageMember } = useAuth();

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['members'],
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
        .order('first_name');

      if (error) throw error;
      return data;
    },
  });

  const filteredMembers = members?.filter(member =>
    member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.mobile_number.includes(searchTerm) ||
    member.groups?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load members data",
      variant: "destructive",
    });
  }

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

  return (
    <div className="space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">Members</h1>
          <p className="text-neutral-600 dark:text-stone-400 mt-2 font-medium">Manage youth group members and their information</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'chairperson' || user?.role === 'secretary') && (
          <AddMemberDialog />
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-stone-500 w-4 h-4" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 text-neutral-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-stone-900 p-1 rounded-lg border border-neutral-200 dark:border-stone-800">
          <Toggle
            pressed={viewMode === "cards"}
            onPressedChange={(pressed) => setViewMode(pressed ? "cards" : "table")}
            aria-label="Card view"
            size="sm"
            className="data-[state=on]:bg-white dark:data-[state=on]:bg-stone-800 data-[state=on]:text-brand-600 dark:text-stone-400"
          >
            <LayoutGrid className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={viewMode === "table"}
            onPressedChange={(pressed) => setViewMode(pressed ? "table" : "cards")}
            aria-label="Table view"
            size="sm"
            className="data-[state=on]:bg-white dark:data-[state=on]:bg-stone-800 data-[state=on]:text-brand-600 dark:text-stone-400"
          >
            <LayoutList className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800">
              <CardContent className="p-6">
                <div className="h-4 bg-neutral-100 dark:bg-stone-800 rounded mb-4"></div>
                <div className="h-3 bg-neutral-100 dark:bg-stone-800 rounded mb-2"></div>
                <div className="h-3 bg-neutral-100 dark:bg-stone-800 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-xl transition-all duration-300 border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 group overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-14 h-14 border-2 border-brand-50 dark:border-stone-800">
                      <AvatarImage src={member.photo_url || undefined} alt={`${member.first_name} ${member.last_name}`} />
                      <AvatarFallback className="bg-brand-50 dark:bg-stone-800 text-brand-600 dark:text-brand-500">
                        <User className="w-7 h-7" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
                        {member.first_name} {member.middle_name} {member.last_name}
                      </CardTitle>
                      <p className="text-xs font-black text-neutral-400 dark:text-stone-500 uppercase tracking-widest mt-1">{member.groups?.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${member.membership_status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-stone-800 dark:text-stone-400'
                      }`}>
                      {member.membership_status}
                    </span>
                    {member.member_role !== 'Member' && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-brand-500 text-black">
                        {member.member_role}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm font-medium text-neutral-600 dark:text-stone-400">
                    <Phone className="w-4 h-4 mr-2 text-brand-500" />
                    <span className="text-neutral-900 dark:text-white font-black">{member.mobile_number}</span>
                  </div>

                  {member.email_address && (
                    <div className="flex items-center text-sm font-medium text-neutral-600 dark:text-stone-400">
                      <Mail className="w-4 h-4 mr-2 text-brand-500" />
                      <span className="text-neutral-900 dark:text-white font-black truncate">{member.email_address}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-neutral-50 dark:border-stone-800/50">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500 block mb-1">Gender</span>
                      <span className="text-sm font-black text-neutral-900 dark:text-white">{member.gender}</span>
                    </div>
                    {member.date_of_birth && (
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500 block mb-1">Age</span>
                        <span className="text-sm font-black text-neutral-900 dark:text-white">{getAge(member.date_of_birth)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-neutral-50 dark:border-stone-800">
                    <Link to={`/members/${member.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-neutral-200 dark:border-stone-800 dark:text-stone-300 font-extrabold uppercase tracking-widest text-[10px] h-10 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all">
                        <Eye className="w-3 h-3 mr-2" />
                        View
                      </Button>
                    </Link>
                    <EditMemberDialog member={member} />
                    <DeleteMemberDialog member={member} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 overflow-hidden shadow-xl rounded-2xl">
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-stone-950">
              <TableRow className="hover:bg-transparent dark:hover:bg-transparent border-neutral-100 dark:border-stone-800">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Name</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Group</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Contact</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Role</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="border-neutral-50 dark:border-stone-800/50 hover:bg-neutral-50/50 dark:hover:bg-stone-800/30">
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 border border-neutral-100 dark:border-stone-800">
                        <AvatarImage src={member.photo_url || undefined} alt={`${member.first_name} ${member.last_name}`} />
                        <AvatarFallback className="bg-brand-50 dark:bg-stone-800 text-brand-600 dark:text-brand-500">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-black text-neutral-900 dark:text-white block leading-tight">{member.first_name} {member.last_name}</span>
                        <span className="text-[10px] font-medium text-neutral-500 dark:text-stone-500 uppercase tracking-widest">{member.gender}, {member.date_of_birth ? getAge(member.date_of_birth) : '-'} yrs</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-black text-neutral-600 dark:text-stone-400">{member.groups?.name}</TableCell>
                  <TableCell>
                    <div className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{member.mobile_number}</div>
                    <div className="text-[10px] font-medium text-neutral-500 dark:text-stone-500 truncate max-w-[150px]">{member.email_address || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${member.membership_status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-stone-800 dark:text-stone-400'
                      }`}>
                      {member.membership_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {member.member_role !== 'Member' ? (
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-brand-500 text-black">
                        {member.member_role}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500 ml-2">Member</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/members/${member.id}`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-neutral-200 dark:border-stone-800 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </Link>
                      <EditMemberDialog member={member} />
                      <DeleteMemberDialog member={member} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredMembers.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-white dark:bg-stone-900 border border-neutral-100 dark:border-stone-800 rounded-[2rem] shadow-sm">
          <User className="w-16 h-16 text-neutral-200 dark:text-stone-800 mx-auto mb-6" />
          <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight mb-2">No members found</h3>
          <p className="text-neutral-500 dark:text-stone-400 font-medium">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first member.'}
          </p>
        </div>
      )}
    </div>
  );
}
