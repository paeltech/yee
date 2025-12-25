
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
    <Card className="border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white text-lg font-black uppercase tracking-tight">Activity Engagement</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-stone-400 font-medium">Participation by activity type</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-stone-400">{activity.name}</span>
                <span className="text-sm font-black text-neutral-900 dark:text-white">{activity.engagement}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 transition-all duration-1000"
                  style={{ width: `${activity.engagement}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
