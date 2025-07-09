
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
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MembershipTrends />
        <EventParticipation />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AgeDistribution />
        <ActivityEngagement />
        <ResourceUtilization />
      </div>
      
      <GeographicDistribution />
    </div>
  );
}
