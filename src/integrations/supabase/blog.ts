import { supabase } from "./client";
import { Database } from "./types";

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type NewBlogPost = Database["public"]["Tables"]["blog_posts"]["Insert"];
export type UpdateBlogPost = Database["public"]["Tables"]["blog_posts"]["Update"];

export const blogService = {
    async getPublishedPosts() {
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("status", "published")
            .order("published_at", { ascending: false });

        if (error) throw error;
        return data;
    },

    async getLatestPublishedPosts(limit = 3) {
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async getPostBySlug(slug: string) {
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error) throw error;
        return data;
    },

    async getAllPostsAdmin() {
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    },

    async createPost(post: NewBlogPost) {
        const { data, error } = await supabase
            .from("blog_posts")
            .insert(post)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updatePost(id: string, post: UpdateBlogPost) {
        const { data, error } = await supabase
            .from("blog_posts")
            .update(post)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deletePost(id: string) {
        const { error } = await supabase
            .from("blog_posts")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    async uploadImage(file: File) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('blog-assets')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('blog-assets')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};
