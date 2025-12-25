import React, { useEffect, useState } from "react";
import { blogService, BlogPost } from "@/integrations/supabase/blog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, ChevronRight } from "lucide-react";

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
        <div className="min-h-screen bg-neutral-50">
            {/* Simple Header */}
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/">
                            <img src="/mulika-logo.png" className="w-24" alt="Logo" />
                        </a>
                        <div className="h-6 w-[1px] bg-neutral-200 hidden md:block" />
                        <span className="font-semibold text-neutral-900 hidden md:block">Stories & Updates</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
                        <Button variant="ghost" onClick={() => navigate("/groups/public")}>Groups</Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4">The YEE Journal</h1>
                        <p className="text-xl text-neutral-600 max-w-2xl">
                            Exploring stories of impact, youth empowerment, and economic transformation across Tanzania.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <div className="h-48 bg-neutral-200" />
                                <CardHeader className="space-y-2">
                                    <div className="h-4 bg-neutral-200 w-1/4" />
                                    <div className="h-6 bg-neutral-200 w-full" />
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="h-4 bg-neutral-200 w-full" />
                                    <div className="h-4 bg-neutral-200 w-3/4" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                        <div className="mb-4 text-neutral-300">
                            <Clock className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900">No stories yet</h3>
                        <p className="text-neutral-500 mt-2">Check back soon for new updates and insights.</p>
                        <Button className="mt-6" variant="outline" onClick={() => navigate("/")}>Go Home</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Card
                                key={post.id}
                                className="group overflow-hidden border-neutral-200 hover:border-brand-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md h-full flex flex-col"
                                onClick={() => navigate(`/blogs/${post.slug}`)}
                            >
                                <div className="relative h-56 overflow-hidden">
                                    {post.featured_image ? (
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                                            <img src="/mulika-logo.png" className="w-20 opacity-20 grayscale" alt="" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-white/90 text-neutral-900 border-none backdrop-blur shadow-sm">
                                            {format(new Date(post.published_at || post.created_at), "MMM d")}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="p-6 pb-2">
                                    <h2 className="text-2xl font-bold text-neutral-900 leading-tight group-hover:text-brand-600 transition-colors">
                                        {post.title}
                                    </h2>
                                </CardHeader>
                                <CardContent className="p-6 pt-2 flex-grow">
                                    <p className="text-neutral-600 line-clamp-3">
                                        {post.excerpt || "Click to read more about this story and stay updated with the latest YEE initiatives."}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 flex items-center justify-between text-sm text-neutral-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>5 min read</span>
                                    </div>
                                    <div className="flex items-center gap-1 font-semibold text-brand-600">
                                        Read Story <ChevronRight className="w-4 h-4" />
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Basic Footer */}
            <footer className="bg-white border-t border-neutral-200 pt-16 pb-12">
                <div className="container mx-auto px-4 text-center">
                    <img src="/mulika-logo.png" className="w-24 mx-auto mb-6" alt="" />
                    <p className="text-neutral-500 text-sm max-w-lg mx-auto mb-8">
                        The Youth Economic Empowerment (YEE) Portal is a platform dedicated to fostering economic growth among young people in Tanzania.
                    </p>
                    <div className="flex justify-center gap-6 text-sm font-medium text-neutral-600 mb-8">
                        <a href="/" className="hover:text-brand-600">Home</a>
                        <a href="/blogs" className="hover:text-brand-600">Stories</a>
                        <a href="/groups/public" className="hover:text-brand-600">Find Groups</a>
                    </div>
                    <p className="text-xs text-neutral-400">
                        © {new Date().getFullYear()} Mulika Tanzania. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Blogs;
