import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function TopNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const linkClass = (path: string) => `
    font-black uppercase tracking-widest text-sm transition-colors
    ${isActive(path)
            ? "text-brand-600"
            : "text-neutral-600 dark:text-neutral-400 hover:text-brand-600"
        }
  `;

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-500 py-6 ${isScrolled ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800 py-4 shadow-sm" : "bg-transparent"}`}>
            <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12 mt-0">
                <div className="flex items-center">
                    <a href="/" className="hover:scale-105 transition-transform">
                        <img src="/mulika-logo.png" className="w-32 md:w-40" alt="YEE Platform" />
                    </a>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {location.pathname !== '/' && (
                        <button onClick={() => navigate('/')} className={linkClass('/')}>
                            Home
                        </button>
                    )}

                    <button onClick={() => navigate('/blogs')} className={linkClass('/blogs')}>
                        Stories
                    </button>
                    <button onClick={() => navigate('/groups/public')} className={linkClass('/groups/public')}>
                        Groups
                    </button>



                    <Button
                        onClick={() => navigate('/login')}
                        className="bg-brand-500 text-black hover:bg-brand-600 px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                    </Button>
                    <ThemeToggle />
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex items-center gap-3">
                    <ThemeToggle />
                    <Button
                        onClick={() => navigate('/login')}
                        className="bg-brand-500 text-black hover:bg-brand-600 p-3 rounded-xl"
                    >
                        <LogIn className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
