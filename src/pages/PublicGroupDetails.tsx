import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopNavbar } from "@/components/TopNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, MapPin, Calendar, Phone } from "lucide-react";
import { GroupDocuments } from "@/components/groups/GroupDocuments";
import { useTranslation } from "react-i18next";

const PublicGroupDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: group, isLoading, error } = useQuery({
    queryKey: ['public-group', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          wards (
            name,
            councils (
              name
            )
          )
        `)
        .eq('id', parseInt(id!))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: members } = useQuery({
    queryKey: ['public-group-members', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name, member_role, membership_status')
        .eq('group_id', parseInt(id!))
        .eq('membership_status', 'active');

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
        <TopNavbar />
        <main className="flex-grow pt-32 pb-24 px-6 lg:px-12">
          <div className="container mx-auto max-w-7xl animate-pulse space-y-8">
            <div className="h-12 bg-neutral-100 rounded-[1.5rem] w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-neutral-100 rounded-[2.5rem]"></div>
              <div className="h-96 bg-neutral-100 rounded-[2.5rem]"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
        <TopNavbar />
        <main className="flex-grow pt-32 pb-24 px-6 lg:px-12 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-6">{t('landing.publicGroupDetails.notFound')}</h3>
            <Button
              onClick={() => navigate("/groups/public")}
              className="h-12 px-6 rounded-2xl bg-brand-500 text-black hover:bg-brand-600 font-black uppercase tracking-widest text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('landing.publicGroupDetails.backToGroups')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col selection:bg-brand-200 selection:text-black transition-colors duration-500">
      <TopNavbar />

      <main className="flex-grow pt-32 pb-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Button
              variant="outline"
              onClick={() => navigate("/groups/public")}
              className="w-fit border-neutral-200 dark:border-neutral-800 dark:text-neutral-400 font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all rounded-2xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('landing.publicGroupDetails.back')}
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white uppercase tracking-tight leading-none">
                {group.name}
              </h1>
              <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">
                {group.group_number}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-[2rem] shadow-sm">
                <CardHeader className="border-b border-neutral-50 dark:border-neutral-800 pb-6 px-8 pt-8">
                  <CardTitle className="flex items-center text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                    <Users className="w-6 h-6 mr-3 text-brand-500" />
                    {t('landing.publicGroupDetails.groupInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.groupName')}</label>
                      <p className="text-base font-bold text-neutral-900 dark:text-white">{group.name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.registrationDate')}</label>
                      <p className="text-base font-bold text-neutral-900 dark:text-white">{new Date(group.registration_date).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.registrationNumber')}</label>
                      <p className="text-base font-bold text-neutral-900 dark:text-white">{group.registration_number || t('landing.publicGroupDetails.notAssigned')}</p>
                    </div>
                    {group.description && (
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.description')}</label>
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">{group.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-[2rem] shadow-sm">
                <CardHeader className="border-b border-neutral-50 dark:border-neutral-800 pb-6 px-8 pt-8">
                  <CardTitle className="flex items-center text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                    <Calendar className="w-6 h-6 mr-3 text-brand-500" />
                    {t('landing.publicGroupDetails.meetingInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {group.meeting_day && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.meetingDay')}</label>
                        <p className="text-base font-bold text-neutral-900 dark:text-white">{group.meeting_day}</p>
                      </div>
                    )}
                    {group.meeting_time && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.meetingTime')}</label>
                        <p className="text-base font-bold text-neutral-900 dark:text-white">{group.meeting_time}</p>
                      </div>
                    )}
                    {group.meeting_location && (
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.meetingLocation')}</label>
                        <p className="text-base font-bold text-neutral-900 dark:text-white">{group.meeting_location}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-[2rem] shadow-sm">
                <CardHeader className="border-b border-neutral-50 dark:border-neutral-800 pb-6 px-8 pt-8 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                    {t('landing.publicGroupDetails.members')} ({members?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 mt-2">
                  {members && members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50">
                          <div>
                            <p className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">
                              {member.member_role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 opacity-50">
                      <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">{t('landing.publicGroupDetails.noMembers')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="rounded-[2rem] overflow-hidden">
                <GroupDocuments groupId={parseInt(id!)} groupName={group.name} allowDownload={false} />
              </div>
            </div>

            <div className="space-y-8">
              <Card className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-[2rem] shadow-sm">
                <CardHeader className="border-b border-neutral-50 dark:border-neutral-800 pb-6 px-8 pt-8">
                  <CardTitle className="flex items-center text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                    <MapPin className="w-6 h-6 mr-3 text-brand-500" />
                    {t('landing.publicGroupDetails.location')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.ward')}</label>
                    <p className="text-base font-bold text-neutral-900 dark:text-white">{group.wards?.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.council')}</label>
                    <p className="text-base font-bold text-neutral-900 dark:text-white">{group.wards?.councils?.name}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-[2rem] shadow-sm">
                <CardHeader className="border-b border-neutral-50 dark:border-neutral-800 pb-6 px-8 pt-8">
                  <CardTitle className="flex items-center text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                    <Phone className="w-6 h-6 mr-3 text-brand-500" />
                    {t('landing.publicGroupDetails.contactInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {group.primary_contact_name && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.contactPerson')}</label>
                      <p className="text-base font-bold text-neutral-900 dark:text-white">{group.primary_contact_name}</p>
                    </div>
                  )}
                  {group.primary_contact_phone && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.phone')}</label>
                      <p className="text-base font-bold text-neutral-900 dark:text-white">{group.primary_contact_phone}</p>
                    </div>
                  )}
                  {group.primary_contact_email && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t('landing.publicGroupDetails.email')}</label>
                      <p className="text-base font-bold text-neutral-900 dark:text-white break-all">{group.primary_contact_email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-neutral-900 text-white py-24 px-6 lg:px-12 mt-auto">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <img src="/mulika-logo.png" className="w-48" alt="YEE Platform" />
              <p className="text-neutral-400 text-xl max-w-md leading-relaxed">
                {t('landing.footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-widest mb-6">{t('landing.footer.platform')}</h4>
              <ul className="space-y-4 text-neutral-400 font-medium">
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500 transition-colors">{t('nav.home')}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/blogs'); }} className="hover:text-brand-500 transition-colors">{t('landing.footer.latestStories')}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/groups/public'); }} className="hover:text-brand-500 transition-colors">{t('landing.footer.groupsPortal')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-widest mb-6">{t('landing.footer.support')}</h4>
              <ul className="space-y-4 text-neutral-400 font-medium">
                <li><a href="mailto:info@mulika.or.tz" className="hover:text-brand-500 transition-colors">info@mulika.or.tz</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">{t('landing.footer.privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">{t('landing.footer.termsOfService')}</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-500 font-medium text-sm">
            <p>© {new Date().getFullYear()} Youth Economic Empowerment Portal</p>
            <p>Implemented under <span className="text-white font-bold">Mulika Tanzania</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicGroupDetails;
