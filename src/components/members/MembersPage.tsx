
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
import { AddMemberDialog } from "./AddMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { DeleteMemberDialog } from "./DeleteMemberDialog";
import { Link } from "react-router-dom";

export function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const { toast } = useToast();

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Members</h1>
          <p className="text-neutral-600 mt-2">Manage youth group members and their information</p>
        </div>
        <AddMemberDialog />
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Toggle
            pressed={viewMode === "cards"}
            onPressedChange={(pressed) => setViewMode(pressed ? "cards" : "table")}
            aria-label="Card view"
            size="sm"
          >
            <LayoutGrid className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={viewMode === "table"}
            onPressedChange={(pressed) => setViewMode(pressed ? "table" : "cards")}
            aria-label="Table view"
            size="sm"
          >
            <LayoutList className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                <div className="h-3 bg-neutral-200 rounded mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow border-neutral-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-neutral-900">
                        {member.first_name} {member.middle_name} {member.last_name}
                      </CardTitle>
                      <p className="text-sm text-neutral-600">{member.groups?.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={member.membership_status === 'active' ? 'default' : 'secondary'}>
                      {member.membership_status}
                    </Badge>
                    {member.member_role !== 'Member' && (
                      <Badge variant="outline" className="text-xs">
                        {member.member_role}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-neutral-400" />
                    <span className="text-neutral-900">{member.mobile_number}</span>
                  </div>
                  
                  {member.email_address && (
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-neutral-400" />
                      <span className="text-neutral-900">{member.email_address}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Gender: </span>
                      <span className="font-medium text-neutral-900">{member.gender}</span>
                    </div>
                    {member.date_of_birth && (
                      <div>
                        <span className="text-neutral-600">Age: </span>
                        <span className="font-medium text-neutral-900">{getAge(member.date_of_birth)}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm">
                    <span className="text-neutral-600">Joined: </span>
                    <span className="font-medium text-neutral-900">
                      {new Date(member.join_date).toLocaleDateString()}
                    </span>
                  </div>

                  {member.occupation && (
                    <div className="text-sm">
                      <span className="text-neutral-600">Occupation: </span>
                      <span className="font-medium text-neutral-900">{member.occupation}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Link to={`/members/${member.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
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
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.first_name} {member.middle_name} {member.last_name}
                  </TableCell>
                  <TableCell>{member.groups?.name}</TableCell>
                  <TableCell>{member.mobile_number}</TableCell>
                  <TableCell>{member.email_address || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={member.membership_status === 'active' ? 'default' : 'secondary'}>
                      {member.membership_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.member_role !== 'Member' ? (
                      <Badge variant="outline" className="text-xs">
                        {member.member_role}
                      </Badge>
                    ) : (
                      'Member'
                    )}
                  </TableCell>
                  <TableCell>
                    {member.date_of_birth ? getAge(member.date_of_birth) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link to={`/members/${member.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
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
        <div className="text-center py-12">
          <User className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No members found</h3>
          <p className="text-neutral-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first member.'}
          </p>
        </div>
      )}
    </div>
  );
}
