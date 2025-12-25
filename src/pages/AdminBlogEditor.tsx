import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { useNavigate, useParams } from "react-router-dom";
import { blogService, NewBlogPost, BlogPost } from "@/integrations/supabase/blog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
    ArrowLeft,
    Save,
    Send,
    Trash2,
    Image as ImageIcon,
    Loader2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AdminBlogEditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isPublished, setIsPublished] = useState(false);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [featuredImage, setFeaturedImage] = useState("");

    useEffect(() => {
        if (id && id !== "new") {
            loadPost(id);
        }
    }, [id]);

    const loadPost = async (postId: string) => {
        setLoading(true);
        try {
            // Need a getById but let's just use getAll and filter for now or add getById to service
            const posts = await blogService.getAllPostsAdmin();
            const post = posts.find(p => p.id === postId);

            if (post) {
                setTitle(post.title);
                setSlug(post.slug);
                setExcerpt(post.excerpt || "");
                setContent(post.content);
                setFeaturedImage(post.featured_image || "");
                setIsPublished(post.status === "published");
            } else {
                toast.error("Post not found");
                navigate("/admin/blogs");
            }
        } catch (error) {
            toast.error("Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        if (!id || id === "new") {
            // Auto-generate slug from title
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    const handleSave = async (publish = false) => {
        if (!title || !slug || !content) {
            toast.error("Please fill in all required fields (title, slug, content)");
            return;
        }

        setSaving(true);
        try {
            const postData: NewBlogPost = {
                title,
                slug,
                excerpt,
                content,
                featured_image: featuredImage,
                status: publish ? "published" : "draft",
                author_id: user?.id,
                published_at: publish ? new Date().toISOString() : (isPublished ? new Date().toISOString() : null)
            };

            if (id && id !== "new") {
                await blogService.updatePost(id, postData);
                toast.success("Post updated successfully");
            } else {
                await blogService.createPost(postData);
                toast.success("Post created successfully");
                navigate("/admin/blogs");
            }
        } catch (error: any) {
            if (error.code === '23505') {
                toast.error("Slug already exists. Please choose a unique slug.");
            } else {
                toast.error("Failed to save post");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            return await blogService.uploadImage(file);
        } catch (error) {
            toast.error("Failed to upload image");
            throw error;
        }
    };

    const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const url = await handleImageUpload(e.target.files[0]);
                setFeaturedImage(url);
                toast.success("Featured image uploaded");
            } catch (error) {
                // Error handled in handleImageUpload
            }
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8 min-h-screen">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate("/admin/blogs")} className="text-neutral-500 dark:text-stone-400 font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-100 dark:hover:bg-stone-800">
                        <ArrowLeft className="mr-2 h-3 w-3" />
                        Back to Posts
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => handleSave(false)} disabled={saving} className="border-neutral-200 dark:border-stone-800 dark:text-stone-300 font-extrabold uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-all">
                            <Save className="mr-2 h-3 w-3" />
                            Save Draft
                        </Button>
                        <Button onClick={() => handleSave(true)} disabled={saving} className="bg-brand-500 text-black hover:bg-brand-600 font-black uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-brand-500/20">
                            <Send className="mr-2 h-3 w-3" />
                            {isPublished ? "Update & Publish" : "Publish Now"}
                        </Button>
                    </div>
                </div>

                <div className="space-y-8 bg-white dark:bg-stone-900 p-8 rounded-3xl border border-neutral-100 dark:border-stone-800 shadow-xl overflow-hidden">
                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Title <span className="text-red-500 font-black">*</span></Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Enter a catchy title..."
                            className="text-4xl h-auto py-2 font-black border-none px-0 focus-visible:ring-0 placeholder:text-neutral-200 dark:placeholder:text-stone-800 bg-transparent dark:text-white tracking-tight uppercase"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Slug (URL)</Label>
                        <div className="flex items-center gap-1 text-xs font-black text-neutral-400 dark:text-stone-600">
                            <span className="opacity-50 uppercase tracking-widest">yeeplatform.com/blogs/</span>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="h-8 border-none p-0 focus-visible:ring-0 w-auto min-w-[200px] bg-transparent text-black dark:text-stone-300 font-black"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Featured Image</Label>
                        <div className="flex items-center gap-6">
                            {featuredImage && (
                                <div className="relative w-40 h-24 rounded-2xl overflow-hidden border border-neutral-100 dark:border-stone-800 shadow-lg group">
                                    <img src={featuredImage} alt="Featured" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <button
                                        onClick={() => setFeaturedImage("")}
                                        className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            <div className="flex-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFeaturedImageUpload}
                                    className="hidden"
                                    id="featured-image-upload"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('featured-image-upload')?.click()}
                                    className="w-full h-24 border-dashed border-2 border-neutral-100 dark:border-stone-800 rounded-2xl bg-neutral-50/50 dark:bg-stone-950/50 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all font-black uppercase tracking-widest text-[10px]"
                                >
                                    <ImageIcon className="mr-3 h-5 w-5 opacity-50" />
                                    {featuredImage ? "Change Featured Image" : "Add Featured Image"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="excerpt" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500">Excerpt (Short Summary)</Label>
                        <Textarea
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="What is this story about?"
                            className="resize-none h-24 border-neutral-100 dark:border-stone-800 rounded-2xl bg-neutral-50/30 dark:bg-stone-950/50 text-neutral-600 dark:text-stone-300 font-medium leading-relaxed focus:bg-white dark:focus:bg-stone-900 transition-all"
                        />
                    </div>

                    <div className="space-y-6 pt-8 border-t border-neutral-50 dark:border-stone-800">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500 block">Content <span className="text-red-500">*</span></Label>
                        <div className="bg-neutral-50/50 dark:bg-stone-950/50 rounded-3xl p-1 border border-neutral-50 dark:border-stone-800">
                            <BlogEditor
                                content={content}
                                onChange={setContent}
                                onImageUpload={handleImageUpload}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminBlogEditor;
