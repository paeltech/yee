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
        <section className="py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black text-neutral-900 mb-6 tracking-tight"
                        >
                            Stories & <span className="text-brand-600">Updates</span>
                        </motion.h2>
                        <p className="text-xl text-neutral-600 leading-relaxed font-medium">
                            Stay updated with the latest news, success stories, and insights from the YEE community ecosystem.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/blogs")}
                        className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 font-black text-lg p-0 h-auto self-start md:self-end group"
                    >
                        See all stories <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="space-y-6 animate-pulse">
                                <div className="h-80 bg-neutral-100 rounded-[2.5rem] w-full" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-neutral-100 w-1/4 rounded" />
                                    <div className="h-8 bg-neutral-100 w-full rounded" />
                                    <div className="h-4 bg-neutral-100 w-3/4 rounded" />
                                </div>
                            </div>
                        ))
                    ) : (
                        posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                                        <span className="font-bold">Read Article</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="space-y-4 px-2">
                                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-neutral-400">
                                        <span className="text-brand-600">Updates</span>
                                        <span>•</span>
                                        <span>{format(new Date(post.published_at || post.created_at), "MMM d, yyyy")}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-neutral-900 leading-tight group-hover:text-brand-600 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-neutral-600 line-clamp-2 leading-relaxed text-lg font-medium">
                                        {post.excerpt || "Discover how youth are leveraging opportunities in the YEE ecosystem..."}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
