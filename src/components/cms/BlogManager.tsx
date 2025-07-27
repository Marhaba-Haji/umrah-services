
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  status: 'draft' | 'published' | 'archived';
  featured_image?: string;
  featured_image_alt?: string;
  author_name?: string;
  author_id?: string;
  author_url?: string;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
  publish_date?: string;
  date_modified?: string;
  featured?: boolean;
  view_count?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  og_url?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_card_type?: string;
  news_keywords?: string;
  video_url?: string;
  review_rating?: number;
  image_gallery?: string[];
  related_searches?: string[];
  schema_markup?: any;
  faq_schema?: any;
  howto_schema?: any;
  local_business_schema?: any;
  speakable_schema?: any;
}

const BlogManager = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured_image: '',
    featured_image_alt: '',
    author_name: '',
    author_url: '',
    category_id: '',
    publish_date: '',
    featured: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    og_type: 'article',
    og_url: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    twitter_card_type: 'summary_large_image',
    news_keywords: '',
    video_url: '',
    review_rating: 0,
    image_gallery: [] as string[],
    related_searches: [] as string[]
  });

  useEffect(() => {
    fetchBlogPosts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      
      const typedCategories = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        parent_id: item.parent_id,
        sort_order: item.sort_order,
        is_active: item.is_active
      }));
      
      setCategories(typedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    }
  };

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        status: formData.status,
        featured_image: formData.featured_image,
        featured_image_alt: formData.featured_image_alt,
        author_name: formData.author_name,
        author_url: formData.author_url,
        category_id: formData.category_id || null,
        publish_date: formData.publish_date || null,
        featured: formData.featured,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
        canonical_url: formData.canonical_url,
        og_title: formData.og_title,
        og_description: formData.og_description,
        og_image: formData.og_image,
        og_type: formData.og_type,
        og_url: formData.og_url,
        twitter_title: formData.twitter_title,
        twitter_description: formData.twitter_description,
        twitter_image: formData.twitter_image,
        twitter_card_type: formData.twitter_card_type,
        news_keywords: formData.news_keywords,
        video_url: formData.video_url,
        review_rating: formData.review_rating || null,
        image_gallery: formData.image_gallery.length > 0 ? formData.image_gallery : null,
        related_searches: formData.related_searches.length > 0 ? formData.related_searches : null
      };

      if (isEditing && selectedPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', selectedPost.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([blogData]);

        if (error) throw error;
        
        toast({
          title: "Success", 
          description: "Blog post created successfully"
        });
      }

      resetForm();
      fetchBlogPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'draft',
      featured_image: '',
      featured_image_alt: '',
      author_name: '',
      author_url: '',
      category_id: '',
      publish_date: '',
      featured: false,
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      canonical_url: '',
      og_title: '',
      og_description: '',
      og_image: '',
      og_type: 'article',
      og_url: '',
      twitter_title: '',
      twitter_description: '',
      twitter_image: '',
      twitter_card_type: 'summary_large_image',
      news_keywords: '',
      video_url: '',
      review_rating: 0,
      image_gallery: [],
      related_searches: []
    });
    setSelectedPost(null);
    setIsEditing(false);
    setShowAdvancedFields(false);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      status: post.status,
      featured_image: post.featured_image || '',
      featured_image_alt: post.featured_image_alt || '',
      author_name: post.author_name || '',
      author_url: post.author_url || '',
      category_id: post.category_id || '',
      publish_date: post.publish_date || '',
      featured: post.featured || false,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      meta_keywords: post.meta_keywords || '',
      canonical_url: post.canonical_url || '',
      og_title: post.og_title || '',
      og_description: post.og_description || '',
      og_image: post.og_image || '',
      og_type: post.og_type || 'article',
      og_url: post.og_url || '',
      twitter_title: post.twitter_title || '',
      twitter_description: post.twitter_description || '',
      twitter_image: post.twitter_image || '',
      twitter_card_type: post.twitter_card_type || 'summary_large_image',
      news_keywords: post.news_keywords || '',
      video_url: post.video_url || '',
      review_rating: post.review_rating || 0,
      image_gallery: post.image_gallery || [],
      related_searches: post.related_searches || []
    });
    setIsEditing(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });
      
      fetchBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  const handleImageGalleryChange = (value: string) => {
    const images = value.split(',').map(img => img.trim()).filter(img => img.length > 0);
    setFormData({...formData, image_gallery: images});
  };

  const handleRelatedSearchesChange = (value: string) => {
    const searches = value.split(',').map(search => search.trim()).filter(search => search.length > 0);
    setFormData({...formData, related_searches: searches});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Blog Manager</h2>
        <Button onClick={() => setIsEditing(false)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Fields */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={10}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  value={formData.author_name}
                  onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="author_url">Author URL</Label>
                <Input
                  id="author_url"
                  value={formData.author_url}
                  onChange={(e) => setFormData({...formData, author_url: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="featured_image_alt">Featured Image Alt Text</Label>
                <Input
                  id="featured_image_alt"
                  value={formData.featured_image_alt}
                  onChange={(e) => setFormData({...formData, featured_image_alt: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="publish_date">Publish Date</Label>
                <Input
                  id="publish_date"
                  type="datetime-local"
                  value={formData.publish_date}
                  onChange={(e) => setFormData({...formData, publish_date: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({...formData, featured: checked as boolean})}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>

              {/* Toggle Advanced Fields */}
              <div className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                  className="w-full"
                >
                  {showAdvancedFields ? 'Hide' : 'Show'} Advanced SEO & Social Media Fields
                </Button>
              </div>

              {/* Advanced Fields */}
              {showAdvancedFields && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">SEO Fields</h3>
                  
                  <div>
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="meta_keywords">Meta Keywords</Label>
                    <Input
                      id="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="canonical_url">Canonical URL</Label>
                    <Input
                      id="canonical_url"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData({...formData, canonical_url: e.target.value})}
                    />
                  </div>

                  <h3 className="font-semibold pt-4">Open Graph Fields</h3>
                  
                  <div>
                    <Label htmlFor="og_title">OG Title</Label>
                    <Input
                      id="og_title"
                      value={formData.og_title}
                      onChange={(e) => setFormData({...formData, og_title: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_description">OG Description</Label>
                    <Textarea
                      id="og_description"
                      value={formData.og_description}
                      onChange={(e) => setFormData({...formData, og_description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_image">OG Image</Label>
                    <Input
                      id="og_image"
                      value={formData.og_image}
                      onChange={(e) => setFormData({...formData, og_image: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_type">OG Type</Label>
                    <Select value={formData.og_type} onValueChange={(value) => setFormData({...formData, og_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="og_url">OG URL</Label>
                    <Input
                      id="og_url"
                      value={formData.og_url}
                      onChange={(e) => setFormData({...formData, og_url: e.target.value})}
                    />
                  </div>

                  <h3 className="font-semibold pt-4">Twitter Fields</h3>
                  
                  <div>
                    <Label htmlFor="twitter_title">Twitter Title</Label>
                    <Input
                      id="twitter_title"
                      value={formData.twitter_title}
                      onChange={(e) => setFormData({...formData, twitter_title: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter_description">Twitter Description</Label>
                    <Textarea
                      id="twitter_description"
                      value={formData.twitter_description}
                      onChange={(e) => setFormData({...formData, twitter_description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter_image">Twitter Image</Label>
                    <Input
                      id="twitter_image"
                      value={formData.twitter_image}
                      onChange={(e) => setFormData({...formData, twitter_image: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter_card_type">Twitter Card Type</Label>
                    <Select value={formData.twitter_card_type} onValueChange={(value) => setFormData({...formData, twitter_card_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        <SelectItem value="app">App</SelectItem>
                        <SelectItem value="player">Player</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <h3 className="font-semibold pt-4">Additional Fields</h3>
                  
                  <div>
                    <Label htmlFor="news_keywords">News Keywords</Label>
                    <Input
                      id="news_keywords"
                      value={formData.news_keywords}
                      onChange={(e) => setFormData({...formData, news_keywords: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="video_url">Video URL</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="review_rating">Review Rating (1-5)</Label>
                    <Input
                      id="review_rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.review_rating}
                      onChange={(e) => setFormData({...formData, review_rating: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_gallery">Image Gallery (comma-separated URLs)</Label>
                    <Textarea
                      id="image_gallery"
                      value={formData.image_gallery.join(', ')}
                      onChange={(e) => handleImageGalleryChange(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="related_searches">Related Searches (comma-separated)</Label>
                    <Textarea
                      id="related_searches"
                      value={formData.related_searches.join(', ')}
                      onChange={(e) => handleRelatedSearchesChange(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit">
                  {isEditing ? 'Update Post' : 'Create Post'}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.slug}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      {post.featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogManager;
