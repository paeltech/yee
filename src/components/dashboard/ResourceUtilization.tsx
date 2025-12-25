
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const resources = [
  { name: "Training Materials", utilization: 85, total: 120, used: 102 },
  { name: "Meeting Venues", utilization: 73, total: 45, used: 33 },
  { name: "Equipment", utilization: 91, total: 68, used: 62 },
  { name: "Funding", utilization: 67, total: 100, used: 67 },
];

export function ResourceUtilization() {
  return (
    <Card className="border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white text-lg font-black uppercase tracking-tight">Resource Utilization</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-stone-400 font-medium">Current resource usage</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {resources.map((resource) => (
            <div key={resource.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-stone-400">{resource.name}</span>
                <span className="text-sm font-black text-neutral-900 dark:text-white">{resource.used}/{resource.total}</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-500 h-full transition-all duration-1000"
                  style={{ width: `${resource.utilization}%` }}
                />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">{resource.utilization}% utilized</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
