
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const locations = [
  { council: "Dodoma Municipal Council", groups: 45, members: 1247, growth: "+8.3%" },
  { council: "Kondoa District Council", groups: 67, members: 1105, growth: "+12.1%" },
  { council: "Mpwapwa District Council", groups: 44, members: 495, growth: "+5.7%" },
];

export function GeographicDistribution() {
  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-neutral-900">Geographic Distribution</CardTitle>
        <p className="text-sm text-neutral-600">Youth groups by council location</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.council} className="p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">{location.council}</h3>
                  <p className="text-sm text-green-600 font-medium">{location.growth} growth</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Groups:</span>
                  <span className="text-sm font-medium text-neutral-900">{location.groups}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Members:</span>
                  <span className="text-sm font-medium text-neutral-900">{location.members.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
