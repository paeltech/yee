
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const activities = [
  { name: "Training Sessions", engagement: 92, color: "bg-brand-500 text-black" },
  { name: "Community Projects", engagement: 78, color: "bg-neutral-400" },
  { name: "Social Events", engagement: 85, color: "bg-brand-400" },
  { name: "Skill Development", engagement: 67, color: "bg-neutral-500" },
];

export function ActivityEngagement() {
  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-neutral-900 text-lg">Activity Engagement</CardTitle>
        <p className="text-sm text-neutral-600">Participation by activity type</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">{activity.name}</span>
                <span className="text-sm text-neutral-600">{activity.engagement}%</span>
              </div>
              <Progress 
                value={activity.engagement} 
                className="h-2"
                style={{
                  backgroundColor: '#f5f5f5'
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
