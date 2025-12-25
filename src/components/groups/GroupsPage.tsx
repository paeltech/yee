
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Calendar, MapPin, Eye, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { GroupDialog } from "@/components/groups/GroupDialog";
import { UploadGroupDocumentDialog } from "@/components/groups/UploadGroupDocumentDialog";
import { UploadGroupPhotoDialog } from "@/components/groups/UploadGroupPhotoDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { user, canManageGroup } = useAuth();

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
    <div className="space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">Youth Groups</h1>
          <p className="text-neutral-600 dark:text-stone-400 mt-2 font-medium">Manage youth groups and their activities</p>
        </div>
        {user?.role === 'admin' && (
          <GroupDialog mode="add" trigger={<Button className="bg-brand-500 text-black hover:bg-brand-600 font-black uppercase tracking-widest text-xs px-6 py-4 h-auto shadow-lg shadow-brand-500/20">Add Group</Button>} />
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-stone-500 w-4 h-4" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 text-neutral-900 dark:text-white"
          />
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-xl transition-all duration-300 border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 group overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-brand-50 dark:border-stone-800">
                      <AvatarImage src={group.photo_url || undefined} alt={group.name} />
                      <AvatarFallback className="bg-brand-50 dark:bg-stone-800 text-brand-600 dark:text-brand-500">
                        <Users className="w-7 h-7" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-black text-neutral-900 dark:text-white tracking-tight leading-tight">{group.name}</CardTitle>
                    <p className="text-xs font-black text-neutral-400 dark:text-stone-500 uppercase tracking-widest mt-1">{group.group_number}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-neutral-50 dark:border-stone-800/50">
                    <span className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Status</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${group.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : group.status === 'suspended'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {group.status}
                    </span>
                  </div>

                  <div className="flex items-center text-sm font-medium text-neutral-600 dark:text-stone-400">
                    <MapPin className="w-4 h-4 mr-2 text-brand-500" />
                    <span className="truncate">{group.wards?.name}, {group.wards?.councils?.name}</span>
                  </div>

                  {group.primary_contact_name && (
                    <div className="text-sm border-t border-neutral-50 dark:border-stone-800/50 pt-4">
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500 block mb-1">Primary Contact</span>
                      <span className="font-black text-neutral-900 dark:text-white">{group.primary_contact_name}</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <Link to={`/groups/${group.id}`} className="block">
                      <Button variant="outline" size="sm" className="w-full border-neutral-200 dark:border-stone-800 dark:text-stone-300 font-extrabold uppercase tracking-widest text-[10px] h-10 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all">
                        <Eye className="w-3 h-3 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredGroups.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-white dark:bg-stone-900 border border-neutral-100 dark:border-stone-800 rounded-[2rem] shadow-sm">
          <Users className="w-16 h-16 text-neutral-200 dark:text-stone-800 mx-auto mb-6" />
          <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight mb-2">No groups found</h3>
          <p className="text-neutral-500 dark:text-stone-400 font-medium">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first youth group.'}
          </p>
        </div>
      )}
    </div>
  );
}
