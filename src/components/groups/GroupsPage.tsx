
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Calendar, MapPin, Eye, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GroupDialog } from "@/components/groups/GroupDialog";
import { UploadGroupDocumentDialog } from "@/components/groups/UploadGroupDocumentDialog";
import { Link } from "react-router-dom";

export function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: groups, isLoading, error } = useQuery({
    queryKey: ['groups'],
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
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const filteredGroups = groups?.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.wards?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.wards?.councils?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load groups data",
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Youth Groups</h1>
          <p className="text-neutral-600 mt-2">Manage youth groups and their activities</p>
        </div>
        <GroupDialog mode="add" trigger={<Button className="bg-amber-500 hover:bg-amber-600 text-white">Add Group</Button>} />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow border-neutral-200">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-neutral-900">{group.name}</CardTitle>
                    <p className="text-sm text-neutral-600">{group.group_number}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    group.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : group.status === 'inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : group.status === 'suspended'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {group.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{group.wards?.name}, {group.wards?.councils?.name}</span>
                  </div>
                  
                  {group.meeting_day && (
                    <div className="flex items-center text-sm text-neutral-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{group.meeting_day} {group.meeting_time && `at ${group.meeting_time}`}</span>
                    </div>
                  )}

                  {group.registration_date && (
                    <div className="text-sm">
                      <span className="text-neutral-600">Registered: </span>
                      <span className="font-medium text-neutral-900">
                        {new Date(group.registration_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {group.primary_contact_name && (
                    <div className="text-sm">
                      <span className="text-neutral-600">Contact: </span>
                      <span className="font-medium text-neutral-900">{group.primary_contact_name}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <div className="flex gap-2">
                      <Link to={`/groups/${group.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredGroups.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No groups found</h3>
          <p className="text-neutral-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first youth group.'}
          </p>
        </div>
      )}
    </div>
  );
}
