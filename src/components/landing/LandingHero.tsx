import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export function LandingHero() {
  const navigate = useNavigate();

  // Fetch active members count
  const { data: membersCount } = useQuery({
    queryKey: ["landing-members-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true })
        .eq("membership_status", "active");

      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch active groups count
  const { data: groupsCount } = useQuery({
    queryKey: ["landing-groups-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("groups")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch wards count
  const { data: wardsCount } = useQuery({
    queryKey: ["landing-wards-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("wards")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const stats = [
    {
      value: membersCount ? `${membersCount.toLocaleString()}+` : "...",
      label: "Active Members"
    },
    {
      value: groupsCount ? `${groupsCount}+` : "...",
      label: "Youth Groups"
    },
    {
      value: wardsCount ? `${wardsCount}+` : "...",
      label: "Wards"
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-4 overflow-hidden bg-mesh">
      {/* Decorative Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-100 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-4000" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-8xl font-black text-neutral-900 dark:text-white tracking-tighter leading-none">
              Empowering <span className="text-brand-600">Youth</span>
            </h1>
            <p className="text-xl md:text-3xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto font-medium leading-relaxed">
              Connect with opportunities, build skills, and grow your future through the YEE Program ecosystem.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-brand-500 text-black hover:bg-brand-600 px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              onClick={() => document.getElementById('project-details')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn more
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 dark:text-white px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-bold rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              onClick={() => navigate('/groups/public')}
            >
              View Groups
            </Button>
          </motion.div>

          {/* Stats Section with Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                className="glass p-6 md:p-8 rounded-3xl text-center group hover:bg-white dark:hover:bg-neutral-800 transition-colors duration-300"
              >
                <div className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-widest leading-none">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </section>
  );
}


