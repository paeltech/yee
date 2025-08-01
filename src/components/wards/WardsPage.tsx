import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Layers3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddWardDialog } from "./AddWardDialog";
import { EditWardDialog } from "./EditWardDialog";
import { DeleteWardDialog } from "./DeleteWardDialog";

export function WardsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: wards, isLoading, error } = useQuery({
    queryKey: ['wards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wards')
        .select(`
          *,
          councils (
            name,
            code,
            region
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const filteredWards = wards?.filter(ward =>
    ward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ward.councils?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load wards data",
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Wards</h1>
          <p className="text-neutral-600 mt-2">Manage ward information by council</p>
        </div>
        <AddWardDialog />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Search wards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                <div className="h-3 bg-neutral-200 rounded mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWards.map((ward) => (
            <Card key={ward.id} className="hover:shadow-lg transition-shadow border-neutral-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Layers3 className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-neutral-900">{ward.name}</CardTitle>
                      <p className="text-sm text-neutral-600">{ward.councils?.name}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ward.ward_code && (
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Ward Code:</span>
                      <span className="text-sm font-medium text-neutral-900">{ward.ward_code}</span>
                    </div>
                  )}
                  {ward.population && (
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Population:</span>
                      <span className="text-sm font-medium text-neutral-900">{ward.population.toLocaleString()}</span>
                    </div>
                  )}
                  {ward.area_km2 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Area:</span>
                      <span className="text-sm font-medium text-neutral-900">{ward.area_km2} km²</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Status:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      ward.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ward.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <EditWardDialog ward={ward} />
                    <DeleteWardDialog ward={ward} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredWards.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Layers3 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No wards found</h3>
          <p className="text-neutral-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first ward.'}
          </p>
        </div>
      )}
    </div>
  );
}
