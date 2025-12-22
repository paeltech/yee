import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingHero() {
  const navigate = useNavigate();

  const stats = [
    { value: "1000+", label: "Active Members" },
    { value: "50+", label: "Youth Groups" },
    { value: "85%", label: "Success Rate" },
  ];

  return (
    <section className="relative py-24 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight">
              Empowering Youth
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto">
              Connect with opportunities, build skills, and grow your future through the YEE Program
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8"
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
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-neutral-900">{stat.value}</div>
                <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

