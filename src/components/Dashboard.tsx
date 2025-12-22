
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardStats } from "./dashboard/DashboardStats";
import { MembershipTrends } from "./dashboard/MembershipTrends";
import { EventParticipation } from "./dashboard/EventParticipation";
import { AgeDistribution } from "./dashboard/AgeDistribution";
import { ActivityEngagement } from "./dashboard/ActivityEngagement";
import { ResourceUtilization } from "./dashboard/ResourceUtilization";
import { GeographicDistribution } from "./dashboard/GeographicDistribution";

export function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <DashboardHeader />
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-in slide-in-from-left duration-700">
          <MembershipTrends />
        </div>
        <div className="animate-in slide-in-from-right duration-700">
          <EventParticipation />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="animate-in slide-in-from-bottom duration-700 delay-100">
          <AgeDistribution />
        </div>
        <div className="animate-in slide-in-from-bottom duration-700 delay-200">
          <ActivityEngagement />
        </div>
        <div className="animate-in slide-in-from-bottom duration-700 delay-300">
          <ResourceUtilization />
        </div>
      </div>
      
      <div className="animate-in slide-in-from-bottom duration-700 delay-400">
        <GeographicDistribution />
      </div>
    </div>
  );
}
