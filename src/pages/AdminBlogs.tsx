import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Eye, Globe, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { blogService, BlogPost } from "@/integrations/supabase/blog";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const AdminBlogs = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadPosts = async () => {
        try {
            const data = await blogService.getAllPostsAdmin();
            setPosts(data);
        } catch (error) {
            console.error("Error loading posts:", error);
            toast.error("Failed to load blog posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await blogService.deletePost(id);
                toast.success("Post deleted successfully");
                loadPosts();
            } catch (error) {
                toast.error("Failed to delete post");
            }
        }
    };

    return (
        <Layout>
            <div className="space-y-8 min-h-screen">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase dark:text-white">Blog Management</h1>
                        <p className="text-neutral-500 dark:text-stone-400 mt-2 font-medium">
                            Create and manage stories for the community.
                        </p>
                    </div>
                    <Button onClick={() => navigate("/admin/blogs/new")} className="bg-brand-500 text-black hover:bg-brand-600 font-black uppercase tracking-widest text-xs px-6 py-4 h-auto shadow-lg shadow-brand-500/20">
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                    </Button>
                </div>

                <div className="border border-neutral-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-900 overflow-hidden shadow-xl">
                    <Table>
                        <TableHeader className="bg-neutral-50 dark:bg-stone-950">
                            <TableRow className="border-neutral-100 dark:border-stone-800 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Title</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Published At</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Created At</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-stone-500 py-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Loading posts...
                                    </TableCell>
                                </TableRow>
                            ) : posts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                                        No posts found. Create your first post!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                posts.map((post) => (
                                    <TableRow key={post.id} className="border-neutral-50 dark:border-stone-800/50 hover:bg-neutral-50/50 dark:hover:bg-stone-800/30">
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="font-black text-neutral-900 dark:text-white leading-tight">{post.title}</span>
                                                <span className="text-[10px] font-medium text-neutral-400 dark:text-stone-500 uppercase tracking-widest mt-1">/{post.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {post.status === "published" ? (
                                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 border-none text-[9px] font-black uppercase tracking-widest">
                                                    <Globe className="mr-1 h-3 w-3" /> Published
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-neutral-500 dark:text-stone-400 border-neutral-200 dark:border-stone-800 text-[9px] font-black uppercase tracking-widest">
                                                    <FileText className="mr-1 h-3 w-3" /> Draft
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm font-black text-neutral-600 dark:text-stone-400">
                                            {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "-"}
                                        </TableCell>
                                        <TableCell className="text-sm font-black text-neutral-600 dark:text-stone-400">
                                            {format(new Date(post.created_at), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 border-neutral-200 dark:border-stone-800 dark:text-stone-400 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all shadow-sm"
                                                    onClick={() => navigate(`/blogs/${post.slug}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 border-neutral-200 dark:border-stone-800 dark:text-stone-400 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all shadow-sm"
                                                    onClick={() => navigate(`/admin/blogs/edit/${post.id}`)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 border-neutral-200 dark:border-stone-800 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                                                    onClick={() => handleDelete(post.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Layout>
    );
};

export default AdminBlogs;
