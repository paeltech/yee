import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Calendar, MapPin, Users, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddActivityDialog } from "./AddActivityDialog";
import { ActivityDetailDialog } from "./ActivityDetailDialog";

export function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_activities')
        .select(`
          *,
          groups (
            name,
            wards (
              name,
              councils (
                name
              )
            )
          )
        `)
        .order('activity_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredActivities = activities?.filter(activity =>
    activity.activity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.groups?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.activity_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load activities data",
      variant: "destructive",
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50';
      case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      case 'planned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      default: return 'bg-gray-100 text-gray-800 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Activities</h1>
          <p className="text-neutral-600 dark:text-stone-400 mt-2 font-medium">Manage group activities and events</p>
        </div>
        <AddActivityDialog />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-stone-500 w-4 h-4" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-stone-900 dark:border-stone-800 dark:text-white placeholder:dark:text-stone-600 px-4 py-2"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse dark:bg-stone-900 dark:border-stone-800">
              <CardContent className="p-6">
                <div className="h-4 bg-neutral-200 dark:bg-stone-800 rounded mb-4"></div>
                <div className="h-3 bg-neutral-200 dark:bg-stone-800 rounded mb-2"></div>
                <div className="h-3 bg-neutral-200 dark:bg-stone-800 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-xl transition-all duration-300 border-neutral-200 dark:border-stone-800 dark:bg-stone-900 group dark:hover:shadow-brand-500/5">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-neutral-900 dark:text-white flex-1 font-black uppercase tracking-tight">
                    {activity.activity_name}
                  </CardTitle>
                  <Badge variant="outline" className={`${getStatusColor(activity.status)} border-none shadow-sm`}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600 dark:text-brand-500 font-bold uppercase tracking-widest text-[10px] mt-1">{activity.groups?.name}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-neutral-600 dark:text-stone-400">
                      <Calendar className="w-4 h-4 mr-2 text-brand-500" />
                      <span className="font-medium tracking-tight font-black uppercase tracking-widest text-[10px]">{new Date(activity.activity_date).toLocaleDateString()}</span>
                    </div>

                    {activity.location && (
                      <div className="flex items-center text-sm text-neutral-600 dark:text-stone-400">
                        <MapPin className="w-4 h-4 mr-2 text-brand-500" />
                        <span className="font-medium font-black uppercase tracking-widest text-[10px]">{activity.location}</span>
                      </div>
                    )}

                    {activity.activity_type && (
                      <div className="text-[10px] flex items-center">
                        <span className="text-neutral-500 dark:text-stone-500 font-black uppercase tracking-widest mr-2">Type:</span>
                        <span className="font-black text-neutral-900 dark:text-stone-300 uppercase tracking-widest">{activity.activity_type}</span>
                      </div>
                    )}

                    {activity.attendees_count && (
                      <div className="flex items-center text-[10px]">
                        <Users className="w-4 h-4 mr-2 text-brand-500" />
                        <span className="text-neutral-900 dark:text-stone-300 font-black uppercase tracking-widest">{activity.attendees_count} attendees</span>
                      </div>
                    )}

                    {activity.budget_allocated && (
                      <div className="text-[10px]">
                        <span className="text-neutral-500 dark:text-stone-500 font-black uppercase tracking-widest mr-2">Budget:</span>
                        <span className="font-black text-neutral-900 dark:text-brand-500 uppercase tracking-widest">
                          TSh {activity.budget_allocated.toLocaleString()}
                        </span>
                        {activity.budget_spent && (
                          <span className="text-neutral-500 dark:text-stone-600 ml-2 font-black uppercase tracking-widest">
                            (Spent: TSh {activity.budget_spent.toLocaleString()})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {activity.description && (
                    <p className="text-xs text-neutral-600 dark:text-stone-500 line-clamp-2 leading-relaxed italic">
                      {activity.description}
                    </p>
                  )}

                  <div className="pt-4 border-t dark:border-stone-800">
                    <ActivityDetailDialog
                      activity={activity}
                      trigger={
                        <Button variant="outline" size="sm" className="w-full dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 font-black uppercase tracking-widest text-[10px] h-9">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredActivities.length === 0 && !isLoading && (
        <div className="text-center py-12 dark:bg-stone-900 dark:border-stone-800 rounded-xl border border-dashed">
          <Calendar className="w-12 h-12 text-neutral-400 dark:text-stone-700 mx-auto mb-4" />
          <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2 uppercase tracking-tight">No activities found</h3>
          <p className="text-neutral-600 dark:text-stone-400 font-medium">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first activity.'}
          </p>
        </div>
      )}
    </div>
  );
}
