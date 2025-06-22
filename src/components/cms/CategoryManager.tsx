
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
import { Edit, Trash2, Plus, Folder, FolderOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  parent?: Category;
  children?: Category[];
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parent_id: '',
      sort_order: 0,
      is_active: true,
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *
        `)
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const onSubmit = async (data: any) => {
    try {
      const categoryData = {
        name: data.name,
        slug: data.slug || generateSlug(data.name),
        description: data.description || null,
        parent_id: data.parent_id || null,
        sort_order: data.sort_order || 0,
        is_active: data.is_active,
      };

      let result;
      if (editingCategory) {
        result = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
          .select();
      } else {
        result = await supabase
          .from('categories')
          .insert([categoryData])
          .select();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Category ${editingCategory ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  const parentCategories = categories.filter(cat => !cat.parent_id);

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
        <h3 className="text-xl font-semibold">Category Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCategory(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category name" {...field} />
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
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="category-slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Category description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {parentCategories.map((category) => (
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
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem className="flex items-center space-x-2 pt-6">
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded"
                            />
                          </FormControl>
                          <FormLabel>Active</FormLabel>
                        </>
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingCategory ? 'Update Category' : 'Create Category'}
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
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Slug</th>
                  <th className="text-left p-2">Parent</th>
                  <th className="text-left p-2">Sort Order</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        {category.parent_id ? <Folder className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />}
                        <span>{category.name}</span>
                      </div>
                    </td>
                    <td className="p-2 text-gray-600">{category.slug}</td>
                    <td className="p-2">
                      {category.parent_id ? (
                        <Badge variant="outline">
                          {categories.find(c => c.id === category.parent_id)?.name || 'Unknown'}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Root</span>
                      )}
                    </td>
                    <td className="p-2">{category.sort_order}</td>
                    <td className="p-2">
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(category.id)}>
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

export default CategoryManager;
