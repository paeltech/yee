import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, MapPin, Calendar, Award, MessageCircle, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { DocumentViewer } from "@/components/DocumentViewer";
import { motion } from "framer-motion";

export default function PublicGroups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [councilFilter, setCouncilFilter] = useState<string>("all");
  const [memberCountFilter, setMemberCountFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [viewingCertificate, setViewingCertificate] = useState<any | null>(null);
  const { toast } = useToast();

  // Debug: Log when component mounts
  console.log('PublicGroups component rendered');

  const { data: groups, isLoading, error: groupsError } = useQuery({
    queryKey: ['public-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          wards (
            id,
            name,
            councils (
              id,
              name
            )
          )
        `)
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Error fetching groups:', error);
        throw error;
      }
      return data;
    },
  });

  // Fetch group documents (certificates) for all groups
  const { data: groupDocuments } = useQuery({
    queryKey: ['public-group-documents'],
    queryFn: async () => {
      if (!groups) return {};

      const groupIds = groups.map(g => g.id);
      const { data, error } = await supabase
        .from('group_documents')
        .select('group_id, file_name, file_path, file_type')
        .in('group_id', groupIds)
        .or('file_name.ilike.%certificate%,file_name.ilike.%cert%,file_name.ilike.%registration%');

      if (error) throw error;

      // Group by group_id
      const docsByGroup: Record<number, any[]> = {};
      data?.forEach(doc => {
        if (!docsByGroup[doc.group_id]) {
          docsByGroup[doc.group_id] = [];
        }
        docsByGroup[doc.group_id].push(doc);
      });

      return docsByGroup;
    },
    enabled: !!groups,
  });

  const { data: groupStats } = useQuery({
    queryKey: ['public-group-stats'],
    queryFn: async () => {
      if (!groups) return {};

      const groupIds = groups.map(g => g.id);
      const { data, error } = await supabase
        .from('members')
        .select('group_id, gender')
        .in('group_id', groupIds)
        .eq('membership_status', 'active');

      if (error) throw error;

      // Calculate stats per group
      const stats: Record<number, { total: number; male: number; female: number }> = {};
      data?.forEach(member => {
        if (!member.group_id) return;
        if (!stats[member.group_id]) {
          stats[member.group_id] = { total: 0, male: 0, female: 0 };
        }
        stats[member.group_id].total++;
        if (member.gender === 'Male') stats[member.group_id].male++;
        if (member.gender === 'Female') stats[member.group_id].female++;
      });

      return stats;
    },
    enabled: !!groups,
  });

  const { data: wards, error: wardsError } = useQuery({
    queryKey: ['public-wards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wards')
        .select(`
          id,
          name,
          councils (
            id,
            name
          )
        `)
        .order('name');

      if (error) {
        console.error('Error fetching wards:', error);
        throw error;
      }
      return data;
    },
  });

  // Extract unique councils and wards from groups data (more reliable)
  const uniqueCouncils = Array.from(
    new Set(
      groups?.map(g => g.wards?.councils?.name).filter(Boolean) || []
    )
  ).sort();

  const uniqueWards = Array.from(
    new Set(
      groups?.map(g => g.wards?.name).filter(Boolean) || []
    )
  ).sort();

  const handleWhatsAppRequest = (group: any) => {
    // Get contact number from group or use default admin contact
    const phoneNumber = group.primary_contact_phone?.replace(/\D/g, '') || "255758335223"; // Replace with actual admin phone number
    const message = `Hello, I would like to request more information about the ${group.name} youth group (${group.group_number || 'Group ID: ' + group.id}).`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredGroups = groups?.filter(group => {
    // Search filter
    if (searchTerm && !group.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Ward filter
    if (wardFilter && wardFilter !== 'all' && group.wards?.name !== wardFilter) {
      return false;
    }

    // Council filter
    if (councilFilter && councilFilter !== 'all' && group.wards?.councils?.name !== councilFilter) {
      return false;
    }

    // Member count filter
    if (memberCountFilter && memberCountFilter !== 'all') {
      const stats = groupStats?.[group.id];
      const count = stats?.total || 0;
      switch (memberCountFilter) {
        case '0-10':
          if (count > 10) return false;
          break;
        case '11-20':
          if (count < 11 || count > 20) return false;
          break;
        case '21-30':
          if (count < 21 || count > 30) return false;
          break;
        case '31+':
          if (count < 31) return false;
          break;
      }
    }

    // Gender distribution filter
    if (genderFilter && genderFilter !== 'all') {
      const stats = groupStats?.[group.id];
      if (!stats) return false;

      const malePercentage = stats.total > 0 ? (stats.male / stats.total) * 100 : 0;
      const femalePercentage = stats.total > 0 ? (stats.female / stats.total) * 100 : 0;

      switch (genderFilter) {
        case 'male-majority':
          if (malePercentage <= 50) return false;
          break;
        case 'female-majority':
          if (femalePercentage <= 50) return false;
          break;
        case 'balanced':
          if (Math.abs(malePercentage - femalePercentage) > 20) return false;
          break;
      }
    }

    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 mt-8">

          <div className="flex items-center space-x-2">
            <a href="/">
              <img src="/mulika-logo.png" className="w-32" alt="" />
            </a>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Home
            </Button>
            <Button
              onClick={() => window.location.href = '/login'}
              className="bg-brand-500 text-black hover:bg-brand-600"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Youth Groups</h1>
            <p className="text-lg text-neutral-600">
              Explore active youth groups in the YEE Program
            </p>
          </motion.div>

          {/* Show error message if query fails */}
          {(groupsError || wardsError) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                Error loading data: {groupsError?.message || wardsError?.message || 'Unknown error'}
              </p>
              <p className="text-red-600 text-xs mt-2">
                Please check your browser console for more details.
              </p>
            </div>
          )}

          {/* Filters Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <Card className="border-neutral-200 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Council/District</label>
                    <Select value={councilFilter} onValueChange={setCouncilFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Councils" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Councils</SelectItem>
                        {uniqueCouncils.map(council => (
                          <SelectItem key={council} value={council}>{council}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ward</label>
                    <Select value={wardFilter} onValueChange={setWardFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Wards" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Wards</SelectItem>
                        {uniqueWards.map(ward => (
                          <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Members</label>
                    <Select value={memberCountFilter} onValueChange={setMemberCountFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sizes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        <SelectItem value="0-10">0-10 members</SelectItem>
                        <SelectItem value="11-20">11-20 members</SelectItem>
                        <SelectItem value="21-30">21-30 members</SelectItem>
                        <SelectItem value="31+">31+ members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender Distribution</label>
                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="male-majority">Male Majority</SelectItem>
                        <SelectItem value="female-majority">Female Majority</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchTerm("");
                      setWardFilter("all");
                      setCouncilFilter("all");
                      setMemberCountFilter("all");
                      setGenderFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Groups Grid */}
            <div className="lg:col-span-3">
              {(groupsError || wardsError) && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    Error loading data: {groupsError?.message || wardsError?.message || 'Unknown error'}
                  </p>
                </div>
              )}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              ) : !groups || groups.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No groups available</h3>
                  <p className="text-neutral-600">
                    There are currently no active groups in the system.
                  </p>
                </div>
              ) : filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGroups.map((group) => {
                    const stats = groupStats?.[group.id];
                    const certificates = groupDocuments?.[group.id] || [];
                    const hasCertificate = certificates.length > 0 || group.registration_number;

                    return (
                      <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={group.photo_url || undefined} alt={group.name} />
                                <AvatarFallback className="bg-brand-100 text-brand-600">
                                  <Users className="w-6 h-6" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-1">{group.name}</CardTitle>
                                {group.group_number && (
                                  <p className="text-sm text-neutral-600">{group.group_number}</p>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-neutral-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{group.wards?.name}, {group.wards?.councils?.name}</span>
                              </div>

                              {stats && (
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm">
                                    <Users className="w-4 h-4 mr-2 text-neutral-400" />
                                    <span className="font-medium text-neutral-900">{stats.total} members</span>
                                  </div>
                                  {stats.total > 0 && (
                                    <div className="flex items-center gap-4 text-xs text-neutral-600">
                                      <span>👥 Male: {stats.male}</span>
                                      <span>👩 Female: {stats.female}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {group.registration_date && (
                                <div className="flex items-center text-sm text-neutral-600">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span>Registered {new Date(group.registration_date).toLocaleDateString()}</span>
                                </div>
                              )}

                              {hasCertificate && (
                                <div className="space-y-2 pt-2 border-t">
                                  {group.registration_number && (
                                    <div className="flex items-center text-sm text-neutral-600">
                                      <Award className="w-4 h-4 mr-2" />
                                      <span className="font-medium">Registration: {group.registration_number}</span>
                                    </div>
                                  )}
                                  {certificates.length > 0 && (
                                    <div className="space-y-1">
                                      {certificates.map((cert: any) => (
                                        <Button
                                          key={cert.file_path}
                                          variant="outline"
                                          size="sm"
                                          className="w-full justify-start"
                                          onClick={() => setViewingCertificate({
                                            ...cert,
                                            bucket: 'group-documents'
                                          })}
                                        >
                                          <FileText className="w-4 h-4 mr-2" />
                                          View Certificate: {cert.file_name}
                                        </Button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              <Button
                                className="w-full bg-brand-500 text-black hover:bg-brand-600 mt-4"
                                onClick={() => handleWhatsAppRequest(group)}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Request More Information
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No groups found</h3>
                  <p className="text-neutral-600">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-8 px-4 mt-12">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Youth Economic Empowerment Portal. All rights reserved.
          </p>
          <p className="text-sm mt-2">
            Implemented under Mulika Tanzania
          </p>
        </div>
      </footer>

      {viewingCertificate && (
        <DocumentViewer
          document={viewingCertificate}
          open={!!viewingCertificate}
          onOpenChange={(open) => !open && setViewingCertificate(null)}
        />
      )}
    </div>
  );
}

