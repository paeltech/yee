import React, { useEffect, useState } from "react";
import { blogService, BlogPost } from "@/integrations/supabase/blog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, ChevronRight, LogIn } from "lucide-react";
import { motion } from "framer-motion";

const Blogs = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await blogService.getPublishedPosts();
                setPosts(data);
            } catch (error) {
                console.error("Error loading posts:", error);
                toast.error("Failed to load blog posts");
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    return (
        <div className="min-h-screen bg-white selection:bg-brand-200 selection:text-black">
            {/* Header */}
            <header className="fixed top-0 z-50 w-full transition-all duration-500 bg-white/80 backdrop-blur-xl border-b border-neutral-100 py-4 shadow-sm">
                <div className="container mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/" className="hover:scale-105 transition-transform">
                            <img src="/mulika-logo.png" className="w-32 md:w-40" alt="YEE Platform" />
                        </a>
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-black uppercase tracking-widest text-sm">
                        <button onClick={() => navigate('/')} className="text-neutral-600 hover:text-brand-600 transition-colors">Home</button>
                        <button onClick={() => navigate('/blogs')} className="text-brand-600">Stories</button>
                        <button onClick={() => navigate('/groups/public')} className="text-neutral-600 hover:text-brand-600 transition-colors">Groups</button>
                        <Button
                            onClick={() => navigate('/login')}
                            className="bg-brand-500 text-black hover:bg-brand-600 px-8 py-6 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                        </Button>
                    </div>
                    <div className="md:hidden">
                        <Button onClick={() => navigate('/login')} className="bg-brand-500 text-black p-3 rounded-xl">
                            <LogIn className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 lg:px-12 py-32 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 mt-12">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-8xl font-black text-neutral-900 mb-6 tracking-tighter leading-none"
                        >
                            The YEE <span className="text-brand-600">Journal</span>
                        </motion.h1>
                        <p className="text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed">
                            Exploring stories of impact, youth empowerment, and economic transformation across the vibrant communities of Tanzania.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-6 animate-pulse">
                                <div className="h-80 bg-neutral-100 rounded-[2.5rem]" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-neutral-100 w-1/4" />
                                    <div className="h-8 bg-neutral-100 w-full" />
                                    <div className="h-4 bg-neutral-100 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-neutral-100 shadow-xl">
                        <div className="mb-6 text-neutral-200">
                            <Clock className="w-20 h-20 mx-auto" />
                        </div>
                        <h3 className="text-3xl font-black text-neutral-900 tracking-tight">No stories yet</h3>
                        <p className="text-xl text-neutral-500 mt-2 font-medium">Check back soon for new updates and insights.</p>
                        <Button
                            className="mt-10 bg-brand-500 text-black hover:bg-brand-600 px-10 py-7 rounded-2xl font-black text-lg"
                            onClick={() => navigate("/")}
                        >
                            Go Home
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {posts.map((post, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={post.id}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/blogs/${post.slug}`)}
                            >
                                <div className="relative h-80 rounded-[2.5rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700 group-hover:-translate-y-2">
                                    {post.featured_image ? (
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                                            <img src="/mulika-logo.png" className="w-24 opacity-30 grayscale" alt="" />
                                        </div>
                                    )}
                                    <div className="absolute inset-x-4 bottom-4 glass-dark p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex justify-between items-center text-white">
                                        <span className="font-bold">Read Story</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="space-y-4 px-2">
                                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-neutral-400">
                                        <span className="text-brand-600">Growth</span>
                                        <span>•</span>
                                        <span>{format(new Date(post.published_at || post.created_at), "MMM d, yyyy")}</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-neutral-900 leading-tight group-hover:text-brand-600 transition-colors tracking-tight">
                                        {post.title}
                                    </h2>
                                    <p className="text-neutral-600 line-clamp-2 text-lg font-medium leading-relaxed">
                                        {post.excerpt || "Click to read more about this story and stay updated with the latest YEE initiatives."}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
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
                        </div>
                        <div>
                            <h4 className="text-lg font-black uppercase tracking-widest mb-6">Explore</h4>
                            <ul className="space-y-4 text-neutral-400 font-medium">
                                <li><a href="#" onClick={() => navigate('/')} className="hover:text-brand-500 transition-colors">Home</a></li>
                                <li><a href="#" onClick={() => navigate('/blogs')} className="hover:text-brand-500 transition-colors">Latest Stories</a></li>
                                <li><a href="#" onClick={() => navigate('/groups/public')} className="hover:text-brand-500 transition-colors">Groups Portal</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-black uppercase tracking-widest mb-6">Connect</h4>
                            <ul className="space-y-4 text-neutral-400 font-medium">
                                <li><a href="mailto:info@mulika.or.tz" className="hover:text-brand-500 transition-colors">info@mulika.or.tz</a></li>
                                <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-brand-500 transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-500 font-medium">
                        <p>© {new Date().getFullYear()} Youth Economic Empowerment Portal</p>
                        <p>Implemented under <span className="text-white font-bold">Mulika Tanzania</span></p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Blogs;
