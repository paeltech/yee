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
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate("/admin/blogs")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Posts
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button onClick={() => handleSave(true)} disabled={saving} className="bg-brand-500 text-black hover:bg-brand-600">
                            <Send className="mr-2 h-4 w-4" />
                            {isPublished ? "Update & Publish" : "Publish Now"}
                        </Button>
                    </div>
                </div>

                <div className="space-y-6 bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-lg font-semibold text-neutral-900">Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Enter a catchy title..."
                            className="text-2xl h-14 font-bold border-none px-0 focus-visible:ring-0 placeholder:text-neutral-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-sm font-medium text-neutral-500">Slug (URL)</Label>
                        <div className="flex items-center gap-1 text-sm text-neutral-400">
                            <span>yeeplatform.com/blogs/</span>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="h-8 border-none p-0 focus-visible:ring-0 w-auto min-w-[200px]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-neutral-500">Featured Image</Label>
                        <div className="flex items-center gap-4">
                            {featuredImage && (
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-neutral-200">
                                    <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setFeaturedImage("")}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
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
                                    className="w-full h-20 border-dashed"
                                >
                                    <ImageIcon className="mr-2 h-5 w-5" />
                                    {featuredImage ? "Change Featured Image" : "Add Featured Image"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-sm font-medium text-neutral-500">Excerpt (Short Summary)</Label>
                        <Textarea
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="What is this story about?"
                            className="resize-none h-20 border-neutral-200"
                        />
                    </div>

                    <div className="space-y-2 pt-4 border-t border-neutral-100">
                        <Label className="text-lg font-semibold text-neutral-900 mb-4 block">Content <span className="text-red-500">*</span></Label>
                        <BlogEditor
                            content={content}
                            onChange={setContent}
                            onImageUpload={handleImageUpload}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminBlogEditor;
