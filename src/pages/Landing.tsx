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
import { ThemeToggle } from "@/components/ThemeToggle";
import { TopNavbar } from "@/components/TopNavbar";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white selection:bg-brand-200 selection:text-black">
      <LandingRedirect />
      <TopNavbar />

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

