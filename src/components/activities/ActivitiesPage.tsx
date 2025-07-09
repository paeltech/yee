import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddActivityDialog } from "./AddActivityDialog";

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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Activities</h1>
          <p className="text-neutral-600 mt-2">Manage group activities and events</p>
        </div>
        <AddActivityDialog />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Search activities..."
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
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow border-neutral-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-neutral-900 flex-1">
                    {activity.activity_name}
                  </CardTitle>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600">{activity.groups?.name}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(activity.activity_date).toLocaleDateString()}</span>
                  </div>
                  
                  {activity.location && (
                    <div className="flex items-center text-sm text-neutral-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{activity.location}</span>
                    </div>
                  )}

                  {activity.activity_type && (
                    <div className="text-sm">
                      <span className="text-neutral-600">Type: </span>
                      <span className="font-medium text-neutral-900">{activity.activity_type}</span>
                    </div>
                  )}

                  {activity.attendees_count && (
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-neutral-400" />
                      <span className="text-neutral-900">{activity.attendees_count} attendees</span>
                    </div>
                  )}

                  {activity.budget_allocated && (
                    <div className="text-sm">
                      <span className="text-neutral-600">Budget: </span>
                      <span className="font-medium text-neutral-900">
                        TSh {activity.budget_allocated.toLocaleString()}
                      </span>
                      {activity.budget_spent && (
                        <span className="text-neutral-600 ml-2">
                          (Spent: TSh {activity.budget_spent.toLocaleString()})
                        </span>
                      )}
                    </div>
                  )}

                  {activity.description && (
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredActivities.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No activities found</h3>
          <p className="text-neutral-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first activity.'}
          </p>
        </div>
      )}
    </div>
  );
}
