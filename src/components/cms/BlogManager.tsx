import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  category_id: string | null;
  author_id: string | null;
  status: 'draft' | 'published' | 'archived';
  publish_date: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  schema_markup: any;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string | null;
  og_url: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  twitter_card_type: string | null;
  view_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  categories?: { name: string };
  profiles?: { first_name: string; last_name: string };
  speakable_schema?: any;
  faq_schema?: any;
  howto_schema?: any;
  local_business_schema?: any;
  author_url?: string | null;
  review_rating?: number | null;
  video_url?: string | null;
  image_gallery?: string[] | null;
  related_searches?: string[] | null;
  news_keywords?: string | null;
  date_modified?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const BlogManager = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category_id: '',
      status: 'draft',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      schema_markup: '',
      canonical_url: '',
      og_title: '',
      og_description: '',
      og_image: '',
      og_type: '',
      og_url: '',
      twitter_title: '',
      twitter_description: '',
      twitter_image: '',
      twitter_card_type: '',
      featured_image: '',
      featured_image_alt: '',
      featured: false,
      speakable_schema: '',
      faq_schema: '',
      howto_schema: '',
      local_business_schema: '',
      author_url: '',
      review_rating: '',
      video_url: '',
      image_gallery: '',
      related_searches: '',
      news_keywords: '',
      date_modified: '',
    }
  });

  useEffect(() => {
    fetchBlogPosts();
    fetchCategories();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          categories(name),
          profiles(first_name, last_name)
        `)
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
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const onSubmit = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to manage blog posts",
          variant: "destructive"
        });
        return;
      }

      const postData = {
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        excerpt: data.excerpt || null,
        content: data.content || null,
        featured_image: data.featured_image || null,
        featured_image_alt: data.featured_image_alt || null,
        category_id: data.category_id || null,
        author_id: user.id,
        status: data.status,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        meta_keywords: data.meta_keywords || null,
        schema_markup: data.schema_markup ? JSON.parse(data.schema_markup) : null,
        canonical_url: data.canonical_url || null,
        og_title: data.og_title || null,
        og_description: data.og_description || null,
        og_image: data.og_image || null,
        og_type: data.og_type || null,
        og_url: data.og_url || null,
        twitter_title: data.twitter_title || null,
        twitter_description: data.twitter_description || null,
        twitter_image: data.twitter_image || null,
        twitter_card_type: data.twitter_card_type || null,
        featured: data.featured || false,
        speakable_schema: data.speakable_schema ? JSON.parse(data.speakable_schema) : null,
        faq_schema: data.faq_schema ? JSON.parse(data.faq_schema) : null,
        howto_schema: data.howto_schema ? JSON.parse(data.howto_schema) : null,
        local_business_schema: data.local_business_schema ? JSON.parse(data.local_business_schema) : null,
        author_url: data.author_url || null,
        review_rating: data.review_rating ? parseFloat(data.review_rating) : null,
        video_url: data.video_url || null,
        image_gallery: data.image_gallery ? data.image_gallery.split(',').map(url => url.trim()) : null,
        related_searches: data.related_searches ? data.related_searches.split(',').map(keyword => keyword.trim()) : null,
        news_keywords: data.news_keywords || null,
        date_modified: data.date_modified || null,
      };

      let result;
      if (editingPost) {
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id)
          .select();
      } else {
        result = await supabase
          .from('blog_posts')
          .insert([postData])
          .select();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Blog post ${editingPost ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingPost(null);
      form.reset();
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

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      category_id: post.category_id || '',
      status: post.status,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      meta_keywords: post.meta_keywords || '',
      schema_markup: post.schema_markup ? JSON.stringify(post.schema_markup) : '',
      canonical_url: post.canonical_url || '',
      og_title: post.og_title || '',
      og_description: post.og_description || '',
      og_image: post.og_image || '',
      og_type: post.og_type || '',
      og_url: post.og_url || '',
      twitter_title: post.twitter_title || '',
      twitter_description: post.twitter_description || '',
      twitter_image: post.twitter_image || '',
      twitter_card_type: post.twitter_card_type || '',
      featured_image: post.featured_image || '',
      featured_image_alt: post.featured_image_alt || '',
      featured: post.featured || false,
      speakable_schema: post.speakable_schema ? JSON.stringify(post.speakable_schema) : '',
      faq_schema: post.faq_schema ? JSON.stringify(post.faq_schema) : '',
      howto_schema: post.howto_schema ? JSON.stringify(post.howto_schema) : '',
      local_business_schema: post.local_business_schema ? JSON.stringify(post.local_business_schema) : '',
      author_url: post.author_url || '',
      review_rating: post.review_rating ? post.review_rating.toString() : '',
      video_url: post.video_url || '',
      image_gallery: post.image_gallery ? post.image_gallery.join(', ') : '',
      related_searches: post.related_searches ? post.related_searches.join(', ') : '',
      news_keywords: post.news_keywords || '',
      date_modified: post.date_modified || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Blog Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPost(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter blog title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="auto-generated-from-title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the blog post" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <div className="min-h-[300px]">
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            modules={{
                              toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['link', 'image', 'video'],
                                ['clean']
                              ]
                            }}
                            formats={[
                              'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                              'list', 'bullet', 'link', 'image', 'video'
                            ]}
                            placeholder="Write your blog content here..."
                            style={{ minHeight: 300 }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featured_image_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image Alt Tag</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe the featured image" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 pt-6">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel>Featured Post</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* SEO & Social Settings */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold mb-4">SEO & Social Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="meta_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO meta title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO meta description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta_keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Keywords</FormLabel>
                          <FormControl>
                            <Input placeholder="keyword1, keyword2, keyword3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="canonical_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Canonical URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/blog-post" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Advanced SEO & SERP */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold mb-4">Advanced SEO & SERP</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="faq_schema"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FAQ Schema (JSON)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste FAQPage JSON-LD here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="howto_schema"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HowTo Schema (JSON)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste HowTo JSON-LD here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="local_business_schema"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local Business Schema (JSON)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste LocalBusiness JSON-LD here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="speakable_schema"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Speakable Schema (JSON)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste Speakable JSON-LD here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="author_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/author" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="review_rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Review Rating (1-5)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="5" step="0.1" placeholder="4.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="video_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="image_gallery"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image Gallery (comma separated URLs)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://img1.jpg, https://img2.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="related_searches"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related Searches (comma separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="umrah tips, hajj guide, saudi travel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="news_keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>News Keywords</FormLabel>
                          <FormControl>
                            <Input placeholder="umrah, hajj, saudi arabia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date_modified"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Modified</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Author</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map(post => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 max-w-xs">
                      <div className="truncate">{post.title}</div>
                      {post.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">
                        {post.categories?.name || 'Uncategorized'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {post.profiles?.first_name && post.profiles?.last_name 
                        ? `${post.profiles.first_name} ${post.profiles.last_name}`
                        : 'Unknown'
                      }
                    </td>
                    <td className="p-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="p-2">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager;
