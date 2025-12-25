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
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
                        <p className="text-muted-foreground">
                            Create and manage stories for the community.
                        </p>
                    </div>
                    <Button onClick={() => navigate("/admin/blogs/new")} className="bg-brand-500 text-black hover:bg-brand-600">
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                    </Button>
                </div>

                <div className="border rounded-lg bg-white overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Published At</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{post.title}</span>
                                                <span className="text-xs text-neutral-400">/{post.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {post.status === "published" ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                                    <Globe className="mr-1 h-3 w-3" /> Published
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-neutral-500">
                                                    <FileText className="mr-1 h-3 w-3" /> Draft
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-neutral-600">
                                            {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "-"}
                                        </TableCell>
                                        <TableCell className="text-neutral-600">
                                            {format(new Date(post.created_at), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/blogs/${post.slug}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/admin/blogs/edit/${post.id}`)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
