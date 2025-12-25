
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
    <div className="space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">Councils</h1>
          <p className="text-neutral-600 dark:text-stone-400 mt-2 font-medium">Manage council information and records</p>
        </div>
        <AddCouncilDialog />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-stone-500 w-4 h-4" />
          <Input
            placeholder="Search councils..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 text-neutral-900 dark:text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800">
              <CardContent className="p-6">
                <div className="h-4 bg-neutral-100 dark:bg-stone-800 rounded mb-4"></div>
                <div className="h-3 bg-neutral-100 dark:bg-stone-800 rounded mb-2"></div>
                <div className="h-3 bg-neutral-100 dark:bg-stone-800 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCouncils.map((council) => (
            <Card key={council.id} className="hover:shadow-xl transition-all duration-300 border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">{council.name}</CardTitle>
                    <p className="text-sm font-medium text-neutral-500 dark:text-stone-400 mt-1">{council.region}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-neutral-50 dark:border-stone-800/50">
                    <span className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Region</span>
                    <span className="text-sm font-black text-neutral-900 dark:text-white">{council.region || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-50 dark:border-stone-800/50">
                    <span className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Status</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${council.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {council.status}
                    </span>
                  </div>
                  {council.contact_person && (
                    <div className="flex justify-between items-center py-2 border-b border-neutral-50 dark:border-stone-800/50">
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Contact</span>
                      <span className="text-sm font-black text-neutral-900 dark:text-white">{council.contact_person}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-6">
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
        <div className="text-center py-20 bg-white dark:bg-stone-900 border border-neutral-100 dark:border-stone-800 rounded-[2rem] shadow-sm">
          <Building2 className="w-16 h-16 text-neutral-200 dark:text-stone-800 mx-auto mb-6" />
          <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight mb-2">No councils found</h3>
          <p className="text-neutral-500 dark:text-stone-400 font-medium">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first council.'}
          </p>
        </div>
      )}
    </div>
  );
}
