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
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <img src="mulika-logo.png" className="w-32" alt="" />
            <span className="text-lg font-bold text-neutral-900">YEE Portal</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="lg"
              variant="outline"
              className="border-neutral-300 hover:bg-neutral-50 px-8"
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
      <footer className="border-t border-neutral-200 py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} Youth Economic Empowerment Portal
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            Implemented under Mulika Tanzania
          </p>
        </div>
      </footer>
    </div>
  );
}

