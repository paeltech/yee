import { LandingHero } from "@/components/landing/LandingHero";
import { ProjectDetails } from "@/components/landing/ProjectDetails";
import { ContactInfo } from "@/components/landing/ContactInfo";
import { PublicDocuments } from "@/components/landing/PublicDocuments";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LandingRedirect } from "@/components/LandingRedirect";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <LandingRedirect />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-neutral-900">YEE Portal</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/groups/public')}
            >
              View Groups
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <LandingHero />
        <ProjectDetails />
        <PublicDocuments />
        <ContactInfo />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Youth Economic Empowerment Portal. All rights reserved.
          </p>
          <p className="text-sm mt-2">
            Implemented under Mulika Tanzania
          </p>
        </div>
      </footer>
    </div>
  );
}

