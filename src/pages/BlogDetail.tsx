import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogService, BlogPost } from "@/integrations/supabase/blog";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { toast } from "sonner";

const BlogDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPost = async () => {
            if (!slug) return;
            try {
                const data = await blogService.getPostBySlug(slug);
                setPost(data);
            } catch (error) {
                console.error("Error loading post:", error);
                toast.error("Story not found");
                navigate("/blogs");
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-3xl space-y-8 animate-pulse">
                    <div className="h-10 bg-neutral-100 w-3/4 rounded mx-auto" />
                    <div className="h-4 bg-neutral-100 w-1/4 rounded mx-auto" />
                    <div className="h-[400px] bg-neutral-100 w-full rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-4 bg-neutral-100 w-full rounded" />
                        <div className="h-4 bg-neutral-100 w-full rounded" />
                        <div className="h-4 bg-neutral-100 w-5/6 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) return null;

    const shareUrl = window.location.href;

    return (
        <div className="min-h-screen bg-white">
            {/* Reading Progress Header (Optional, simplified here) */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-neutral-100 h-16 flex items-center px-4">
                <div className="container mx-auto max-w-4xl flex justify-between items-center">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/blogs")} className="text-neutral-500 hover:text-neutral-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        All Stories
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`, '_blank')} className="rounded-full h-8 w-8">
                            <Twitter className="h-4 w-4 text-neutral-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')} className="rounded-full h-8 w-8">
                            <Linkedin className="h-4 w-4 text-neutral-400" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-20 px-4">
                <article className="container mx-auto max-w-3xl">
                    {/* Header */}
                    <header className="mb-12 text-center">
                        <div className="flex justify-center gap-4 text-sm text-neutral-500 mb-6 font-medium uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(post.published_at || post.created_at), "MMMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                6 min read
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-tight mb-8">
                            {post.title}
                        </h1>
                        {post.excerpt && (
                            <p className="text-xl md:text-2xl text-neutral-500 font-medium leading-relaxed max-w-2xl mx-auto italic">
                                "{post.excerpt}"
                            </p>
                        )}
                    </header>

                    {/* Featured Image */}
                    {post.featured_image && (
                        <div className="mb-16 -mx-4 md:-mx-8 lg:-mx-16">
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full aspect-[21/9] object-cover rounded-none md:rounded-2xl shadow-xl"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg prose-neutral max-w-none md:prose-xl prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-p:leading-relaxed prose-a:text-brand-600 prose-img:rounded-xl prose-img:shadow-lg">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Footer of Article */}
                    <footer className="mt-20 pt-10 border-t border-neutral-100">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8 bg-neutral-50 rounded-2xl px-10">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-brand-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                                    Y
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900">YEE Editorial</h4>
                                    <p className="text-sm text-neutral-500">Official voice of Youth Economic Empowerment.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="rounded-full px-6 flex items-center gap-2" onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    toast.success("Link copied to clipboard");
                                }}>
                                    <Share2 className="h-4 w-4" />
                                    Copy Link
                                </Button>
                            </div>
                        </div>
                    </footer>
                </article>
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

export default BlogDetail;
