import { LandingHero } from "@/components/landing/LandingHero";
import { ProjectDetails } from "@/components/landing/ProjectDetails";
import { ContactInfo } from "@/components/landing/ContactInfo";
import { PublicDocuments } from "@/components/landing/PublicDocuments";
import { TestimonialsSlider } from "@/components/landing/TestimonialsSlider";
import { Button } from "@/components/ui/button";
import { LogIn, Github, Twitter, Linkedin, Facebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LandingRedirect } from "@/components/LandingRedirect";
import { LatestPosts } from "@/components/landing/LatestPosts";
import { useEffect, useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-brand-200 selection:text-black">
      <LandingRedirect />
      {/* Header */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-500 py-6 ${isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-neutral-100 py-4 shadow-sm" : "bg-transparent"}`}>
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12 mt-0">
          <div className="flex items-center">
            <a href="/" className="hover:scale-105 transition-transform">
              <img src="/mulika-logo.png" className="w-32 md:w-40" alt="YEE Platform" />
            </a>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/blogs')} className="text-neutral-600 hover:text-brand-600 font-black uppercase tracking-widest text-sm transition-colors">
              Stories
            </button>
            <button onClick={() => navigate('/groups/public')} className="text-neutral-600 hover:text-brand-600 font-black uppercase tracking-widest text-sm transition-colors">
              Groups
            </button>
            <Button
              onClick={() => navigate('/login')}
              className="bg-brand-500 text-black hover:bg-brand-600 px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>
          <div className="md:hidden">
            <Button
              onClick={() => navigate('/login')}
              className="bg-brand-500 text-black hover:bg-brand-600 p-3 rounded-xl"
            >
              <LogIn className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <LandingHero />
        <ProjectDetails />
        <LatestPosts />
        <PublicDocuments />
        <TestimonialsSlider />
        <ContactInfo />
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
              <div className="flex gap-4">
                {[Twitter, Facebook, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:text-black transition-all">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-4 text-neutral-400 font-medium">
                <li><a href="#" className="hover:text-brand-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors" onClick={() => navigate('/blogs')}>Latest Stories</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors" onClick={() => navigate('/groups/public')}>Groups Portal</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-widest mb-6">Support</h4>
              <ul className="space-y-4 text-neutral-400 font-medium">
                <li><a href="#" className="hover:text-brand-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-neutral-500 font-medium">
              © {new Date().getFullYear()} Youth Economic Empowerment Portal
            </p>
            <p className="text-neutral-500 font-medium flex items-center gap-2">
              Implemented under <span className="text-white font-bold">Mulika Tanzania</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

