
import { GeographicDistribution } from "@/components/dashboard/GeographicDistribution";

export function LocationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Locations</h1>
        <p className="text-neutral-600 mt-2">Geographic distribution and location management</p>
      </div>
      
      <GeographicDistribution />
    </div>
  );
}
