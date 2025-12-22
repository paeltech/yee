import { YEELogo } from "@/components/YEELogo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <YEELogo size="lg" showText={true} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
                Empowering Youth Through
                <span className="text-amber-600"> Economic Opportunities</span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto lg:mx-0">
                Join the Youth Economic Empowerment Program and unlock your potential. 
                Connect with opportunities, build skills, and grow your future.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-6"
                onClick={() => navigate('/login')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50 text-lg px-8 py-6"
                onClick={() => navigate('/groups/public')}
              >
                View Groups
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50 text-lg px-8 py-6"
                onClick={() => {
                  document.getElementById('project-details')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">1000+</div>
                  <div className="text-sm text-neutral-600">Active Members</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Target className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">50+</div>
                  <div className="text-sm text-neutral-600">Youth Groups</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">85%</div>
                  <div className="text-sm text-neutral-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

