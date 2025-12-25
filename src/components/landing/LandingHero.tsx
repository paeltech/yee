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
    <section className="relative py-24 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight">
              Empowering Youth
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto">
              Connect with opportunities, build skills, and grow your future through the YEE Program
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
          >
            <Button
              size="lg"
              className="bg-brand-500 text-black hover:bg-brand-600 text-black px-8"
              onClick={() => navigate('/login')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-neutral-300 hover:bg-neutral-50 px-8"
              onClick={() => navigate('/groups/public')}
            >
              View Groups
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-neutral-900">{stat.value}</div>
                <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


