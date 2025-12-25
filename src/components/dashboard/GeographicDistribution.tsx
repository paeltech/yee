
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const locations = [
  { council: "Dodoma Municipal Council", groups: 45, members: 1247, growth: "+8.3%" },
  { council: "Kondoa District Council", groups: 67, members: 1105, growth: "+12.1%" },
  { council: "Mpwapwa District Council", groups: 44, members: 495, growth: "+5.7%" },
];

export function GeographicDistribution() {
  return (
    <Card className="border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white font-black uppercase tracking-tight">Geographic Distribution</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-stone-400 font-medium">Youth groups by council location</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.council} className="p-6 border border-neutral-100 dark:border-stone-800 rounded-2xl hover:shadow-xl hover:border-brand-500 transition-all duration-300 group bg-white dark:bg-stone-900/50">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-brand-50 dark:bg-stone-800 rounded-xl flex items-center justify-center group-hover:bg-brand-500 transition-colors duration-500">
                  <MapPin className="w-6 h-6 text-brand-600 dark:text-brand-500 group-hover:text-black transition-colors" />
                </div>
                <div>
                  <h3 className="font-black text-neutral-900 dark:text-white tracking-tight leading-tight">{location.council}</h3>
                  <p className="text-xs text-green-600 dark:text-green-500 font-black uppercase tracking-widest mt-1">{location.growth} growth</p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-neutral-50 dark:border-stone-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Groups</span>
                  <span className="text-sm font-black text-neutral-900 dark:text-white">{location.groups}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Members</span>
                  <span className="text-sm font-black text-neutral-900 dark:text-white">{location.members.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
