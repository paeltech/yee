
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const resources = [
  { name: "Training Materials", utilization: 85, total: 120, used: 102 },
  { name: "Meeting Venues", utilization: 73, total: 45, used: 33 },
  { name: "Equipment", utilization: 91, total: 68, used: 62 },
  { name: "Funding", utilization: 67, total: 100, used: 67 },
];

export function ResourceUtilization() {
  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-neutral-900 text-lg">Resource Utilization</CardTitle>
        <p className="text-sm text-neutral-600">Current resource usage</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div key={resource.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">{resource.name}</span>
                <span className="text-sm text-neutral-600">{resource.used}/{resource.total}</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div 
                  className="bg-brand-500 text-black h-3 rounded-full transition-all duration-300"
                  style={{ width: `${resource.utilization}%` }}
                />
              </div>
              <div className="text-xs text-neutral-500">{resource.utilization}% utilized</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
