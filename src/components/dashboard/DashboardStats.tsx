
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Calendar, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DashboardStats() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get total members
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id')
        .eq('membership_status', 'active');
      
      if (membersError) throw membersError;

      // Get total groups
      const { data: groups, error: groupsError } = await supabase
        .from('groups')
        .select('id')
        .eq('status', 'active');
      
      if (groupsError) throw groupsError;

      // Get this month's activities
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const nextMonth = new Date(thisMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const { data: activities, error: activitiesError } = await supabase
        .from('group_activities')
        .select('id')
        .gte('activity_date', thisMonth.toISOString().split('T')[0])
        .lt('activity_date', nextMonth.toISOString().split('T')[0]);
      
      if (activitiesError) throw activitiesError;

      return {
        totalMembers: members?.length || 0,
        totalGroups: groups?.length || 0,
        monthlyActivities: activities?.length || 0
      };
    },
  });

  const stats = [
    {
      title: "Total Members",
      value: isLoading ? "..." : statsData?.totalMembers.toString() || "0",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Users,
      description: "Active youth members"
    },
    {
      title: "Active Groups",
      value: isLoading ? "..." : statsData?.totalGroups.toString() || "0",
      change: "+3.2%",
      changeType: "positive" as const,
      icon: Building2,
      description: "Registered groups"
    },
    {
      title: "Monthly Activities",
      value: isLoading ? "..." : statsData?.monthlyActivities.toString() || "0",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Calendar,
      description: "Activities this month"
    },
    {
      title: "Engagement Rate",
      value: "87.3%",
      change: "+5.7%",
      changeType: "positive" as const,
      icon: BarChart3,
      description: "Member participation"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-neutral-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
            <div className="flex items-center space-x-1 mt-1">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-neutral-500">from last month</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
