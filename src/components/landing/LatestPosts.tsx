import { useEffect, useState } from "react";
import { blogService, BlogPost } from "@/integrations/supabase/blog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const LatestPosts = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const data = await blogService.getLatestPublishedPosts(3);
                setPosts(data);
            } catch (error) {
                console.error("Error fetching latest posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (!loading && posts.length === 0) return null;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 mb-6 tracking-tight">
                            Stories & Updates
                        </h2>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            Stay updated with the latest news, success stories, and insights from the YEE community.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/blogs")}
                        className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 font-bold text-lg p-0"
                    >
                        See all stories <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="h-64 bg-neutral-100 rounded-2xl w-full" />
                                <div className="h-4 bg-neutral-100 w-1/4 rounded" />
                                <div className="h-8 bg-neutral-100 w-full rounded" />
                                <div className="h-4 bg-neutral-100 w-3/4 rounded" />
                            </div>
                        ))
                    ) : (
                        posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/blogs/${post.slug}`)}
                            >
                                <div className="relative h-72 rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                    {post.featured_image ? (
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                                            <img src="/mulika-logo.png" className="w-24 opacity-30 grayscale" alt="" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-neutral-500 font-medium">
                                        <span className="text-brand-600 font-bold uppercase tracking-wider">Updates</span>
                                        <span>•</span>
                                        <span>{format(new Date(post.published_at || post.created_at), "MMM d, yyyy")}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-neutral-900 leading-tight group-hover:text-brand-600 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-neutral-600 line-clamp-2 leading-relaxed">
                                        {post.excerpt || "Discover how youth are leveraging opportunities in the YEE ecosystem..."}
                                    </p>
                                    <div className="pt-2">
                                        <span className="inline-flex items-center text-sm font-bold text-neutral-900 group-hover:text-brand-600">
                                            Read more <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
