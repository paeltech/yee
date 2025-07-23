
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddCouncilDialog } from "./AddCouncilDialog";
import { EditCouncilDialog } from "./EditCouncilDialog";
import { DeleteCouncilDialog } from "./DeleteCouncilDialog";

export function CouncilsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: councils, isLoading, error } = useQuery({
    queryKey: ['councils'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('councils')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const filteredCouncils = councils?.filter(council =>
    council.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    council.region?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load councils data",
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Councils</h1>
          <p className="text-neutral-600 mt-2">Manage council information and records</p>
        </div>
        <AddCouncilDialog />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Search councils..."
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
          {filteredCouncils.map((council) => (
            <Card key={council.id} className="hover:shadow-lg transition-shadow border-neutral-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-neutral-900">{council.name}</CardTitle>
                    <p className="text-sm text-neutral-600">{council.region}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Region:</span>
                    <span className="text-sm font-medium text-neutral-900">{council.region || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Status:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      council.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {council.status}
                    </span>
                  </div>
                  {council.contact_person && (
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Contact:</span>
                      <span className="text-sm font-medium text-neutral-900">{council.contact_person}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-8">
                    <EditCouncilDialog council={council} />
                    <DeleteCouncilDialog council={council} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCouncils.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No councils found</h3>
          <p className="text-neutral-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first council.'}
          </p>
        </div>
      )}
    </div>
  );
}
