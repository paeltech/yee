import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, MapPin, Calendar, Award, MessageCircle, FileText, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { DocumentViewer } from "@/components/DocumentViewer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PublicGroups() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [councilFilter, setCouncilFilter] = useState<string>("all");
  const [memberCountFilter, setMemberCountFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [viewingCertificate, setViewingCertificate] = useState<any | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      const docsByGroup: Record<number, any[]> = {};
      data?.forEach(doc => {
        if (!docsByGroup[doc.group_id]) docsByGroup[doc.group_id] = [];
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
      const stats: Record<number, { total: number; male: number; female: number }> = {};
      data?.forEach(member => {
        if (!member.group_id) return;
        if (!stats[member.group_id]) stats[member.group_id] = { total: 0, male: 0, female: 0 };
        stats[member.group_id].total++;
        if (member.gender === 'Male') stats[member.group_id].male++;
        if (member.gender === 'Female') stats[member.group_id].female++;
      });
      return stats;
    },
    enabled: !!groups,
  });

  const { data: wards } = useQuery({
    queryKey: ['public-wards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wards')
        .select('id, name, councils(id, name)')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const uniqueCouncils = Array.from(new Set(groups?.map(g => g.wards?.councils?.name).filter(Boolean) || [])).sort();
  const uniqueWards = Array.from(new Set(groups?.map(g => g.wards?.name).filter(Boolean) || [])).sort();

  const handleWhatsAppRequest = (group: any) => {
    const phoneNumber = group.primary_contact_phone?.replace(/\D/g, '') || "255758335223";
    const message = `Hello, I would like to request more information about the ${group.name} youth group (${group.group_number || 'Group ID: ' + group.id}).`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredGroups = groups?.filter(group => {
    if (searchTerm && !group.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (wardFilter && wardFilter !== 'all' && group.wards?.name !== wardFilter) return false;
    if (councilFilter && councilFilter !== 'all' && group.wards?.councils?.name !== councilFilter) return false;
    if (memberCountFilter && memberCountFilter !== 'all') {
      const count = groupStats?.[group.id]?.total || 0;
      if (memberCountFilter === '0-10' && count > 10) return false;
      if (memberCountFilter === '11-20' && (count < 11 || count > 20)) return false;
      if (memberCountFilter === '21-30' && (count < 21 || count > 30)) return false;
      if (memberCountFilter === '31+' && count < 31) return false;
    }
    if (genderFilter && genderFilter !== 'all') {
      const stats = groupStats?.[group.id];
      if (!stats) return false;
      const maleP = stats.total > 0 ? (stats.male / stats.total) * 100 : 0;
      const femaleP = stats.total > 0 ? (stats.female / stats.total) * 100 : 0;
      if (genderFilter === 'male-majority' && maleP <= 50) return false;
      if (genderFilter === 'female-majority' && femaleP <= 50) return false;
      if (genderFilter === 'balanced' && Math.abs(maleP - femaleP) > 20) return false;
    }
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-white selection:bg-brand-200 selection:text-black">
      {/* Header */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-500 py-6 ${isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-neutral-100 py-4 shadow-sm" : "bg-transparent"}`}>
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12">
          <div className="flex items-center">
            <a href="/" className="hover:scale-105 transition-transform">
              <img src="/mulika-logo.png" className="w-32 md:w-40" alt="YEE Platform" />
            </a>
          </div>
          <div className="hidden md:flex items-center gap-8 font-black uppercase tracking-widest text-sm">
            <button onClick={() => navigate('/')} className="text-neutral-600 hover:text-brand-600 transition-colors">Home</button>
            <button onClick={() => navigate('/blogs')} className="text-neutral-600 hover:text-brand-600 transition-colors">Stories</button>
            <button className="text-brand-600">Groups</button>
            <Button
              onClick={() => navigate('/login')}
              className="bg-brand-500 text-black hover:bg-brand-600 px-8 py-6 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>
          <div className="md:hidden">
            <Button onClick={() => navigate('/login')} className="bg-brand-500 text-black p-3 rounded-xl">
              <LogIn className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 mt-12 text-center md:text-left"
          >
            <h1 className="text-5xl md:text-8xl font-black text-neutral-900 mb-6 tracking-tighter leading-none">
              Youth <span className="text-brand-600">Groups</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 font-medium max-w-3xl">
              Discover and connect with active youth-led groups across Tanzania making a difference in their communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-neutral-50 p-6 sticky top-28 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="px-0 pb-6">
                  <CardTitle className="text-xl font-black uppercase tracking-widest text-neutral-900 leading-none">Filters</CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Search</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <Input
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-14 pl-12 rounded-2xl border-neutral-200 focus:ring-brand-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-neutral-200/50">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Council</label>
                      <Select value={councilFilter} onValueChange={setCouncilFilter}>
                        <SelectTrigger className="h-14 rounded-2xl border-neutral-200 font-medium">
                          <SelectValue placeholder="All Councils" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-neutral-200">
                          <SelectItem value="all">All Councils</SelectItem>
                          {uniqueCouncils.map(council => (
                            <SelectItem key={council} value={council}>{council}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Ward</label>
                      <Select value={wardFilter} onValueChange={setWardFilter}>
                        <SelectTrigger className="h-14 rounded-2xl border-neutral-200 font-medium">
                          <SelectValue placeholder="All Wards" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-neutral-200">
                          <SelectItem value="all">All Wards</SelectItem>
                          {uniqueWards.map(ward => (
                            <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Size</label>
                      <Select value={memberCountFilter} onValueChange={setMemberCountFilter}>
                        <SelectTrigger className="h-14 rounded-2xl border-neutral-200 font-medium">
                          <SelectValue placeholder="All Sizes" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-neutral-200">
                          <SelectItem value="all">All Sizes</SelectItem>
                          <SelectItem value="0-10">0-10 members</SelectItem>
                          <SelectItem value="11-20">11-20 members</SelectItem>
                          <SelectItem value="21-30">21-30 members</SelectItem>
                          <SelectItem value="31+">31+ members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-neutral-200 hover:bg-white transition-all shadow-sm"
                    onClick={() => {
                      setSearchTerm("");
                      setWardFilter("all");
                      setCouncilFilter("all");
                      setMemberCountFilter("all");
                      setGenderFilter("all");
                    }}
                  >
                    Clear All
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Groups Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-neutral-100 rounded-[2.5rem] animate-pulse" />
                  ))}
                </div>
              ) : filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AnimatePresence>
                    {filteredGroups.map((group, idx) => {
                      const stats = groupStats?.[group.id];
                      const certificates = groupDocuments?.[group.id] || [];
                      const hasReg = certificates.length > 0 || group.registration_number;

                      return (
                        <motion.div
                          key={group.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                        >
                          <Card className="group border border-neutral-100 rounded-[3rem] p-8 h-full bg-white shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 flex flex-col">
                            <div className="flex items-center gap-5 mb-8">
                              <Avatar className="w-16 h-16 rounded-2xl shadow-lg border-2 border-brand-50 group-hover:border-brand-500 transition-colors">
                                <AvatarImage src={group.photo_url || undefined} className="object-cover" />
                                <AvatarFallback className="bg-brand-50 text-brand-600">
                                  <Users className="w-8 h-8" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-black text-neutral-900 group-hover:text-brand-600 transition-colors tracking-tight">{group.name}</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mt-0.5">{group.group_number || 'YEE Group'}</p>
                              </div>
                            </div>

                            <div className="space-y-6 flex-grow">
                              <div className="space-y-4">
                                <div className="flex items-center text-neutral-600 font-medium">
                                  <MapPin className="w-5 h-5 mr-3 text-brand-600" />
                                  <span>{group.wards?.name}, {group.wards?.councils?.name}</span>
                                </div>

                                {stats && (
                                  <div className="p-5 rounded-3xl bg-neutral-50 space-y-3 group-hover:bg-brand-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center text-sm font-black uppercase tracking-widest text-neutral-500">
                                        <Users className="w-4 h-4 mr-2" />
                                        Membership
                                      </div>
                                      <span className="text-xl font-black text-neutral-900">{stats.total}</span>
                                    </div>
                                    <div className="flex gap-4">
                                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-neutral-600 border border-neutral-100">
                                        <span>Male:</span> <span className="text-neutral-900">{stats.male}</span>
                                      </div>
                                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-neutral-600 border border-neutral-100">
                                        <span>Female:</span> <span className="text-neutral-900">{stats.female}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {hasReg && (
                                <div className="pt-6 border-t border-neutral-100 space-y-4">
                                  {group.registration_number && (
                                    <div className="flex items-center justify-between text-sm px-2">
                                      <span className="text-neutral-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                        <Award className="w-4 h-4" /> Registration
                                      </span>
                                      <span className="font-black text-neutral-900">{group.registration_number}</span>
                                    </div>
                                  )}
                                  {certificates.map((cert: any) => (
                                    <Button
                                      key={cert.file_path}
                                      variant="outline"
                                      className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border-neutral-200 hover:bg-neutral-50 group-hover:border-brand-300 transition-all"
                                      onClick={() => setViewingCertificate({ ...cert, bucket: 'group-documents' })}
                                    >
                                      <FileText className="w-4 h-4 mr-2 text-brand-600" />
                                      View {cert.file_name}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <Button
                              className="w-full h-16 rounded-[1.5rem] bg-brand-500 text-black hover:bg-brand-600 font-black uppercase tracking-widest text-xs mt-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                              onClick={() => handleWhatsAppRequest(group)}
                            >
                              <MessageCircle className="w-5 h-5 mr-3" />
                              Request more information
                            </Button>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-32 bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-flex p-8 rounded-full bg-white mb-6 shadow-sm">
                    <Users className="w-16 h-16 text-neutral-200" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-neutral-900 tracking-tight">No groups found</h3>
                  <p className="text-xl text-neutral-500 font-medium mt-2">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <img src="/mulika-logo.png" className="w-48" alt="YEE Platform" />
              <p className="text-neutral-400 text-xl max-w-md leading-relaxed">
                Empowering the next generation of Tanzanian entrepreneurs through technology and community support.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-widest mb-6">Explore</h4>
              <ul className="space-y-4 text-neutral-400 font-medium">
                <li><a href="#" onClick={() => navigate('/')} className="hover:text-brand-500 transition-colors">Home</a></li>
                <li><a href="#" onClick={() => navigate('/blogs')} className="hover:text-brand-500 transition-colors">Latest Stories</a></li>
                <li><a href="#" onClick={() => navigate('/groups/public')} className="hover:text-brand-500 transition-colors">Groups Portal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-widest mb-6">Connect</h4>
              <ul className="space-y-4 text-neutral-400 font-medium">
                <li><a href="mailto:info@mulika.or.tz" className="hover:text-brand-500 transition-colors">info@mulika.or.tz</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-500 font-medium text-sm">
            <p>© {new Date().getFullYear()} Youth Economic Empowerment Portal</p>
            <p>Implemented under <span className="text-white font-bold">Mulika Tanzania</span></p>
          </div>
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

