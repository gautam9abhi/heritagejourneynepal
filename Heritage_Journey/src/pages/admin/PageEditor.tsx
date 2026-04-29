import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ImageIcon, Save, Trash2, Image } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface PageFormData {
  title: string;
  slug: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  featured_image_url?: string;
  published: boolean;
  page_type: string;
}

const PageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const isNew = id === 'new';

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PageFormData>({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      meta_title: '',
      meta_description: '',
      featured_image_url: '',
      published: false,
      page_type: 'about'
    }
  });

  const featuredImageUrl = watch('featured_image_url');
  const pageType = watch('page_type');
  const contentValue = watch('content') || '';

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setValue('title', data.title);
        setValue('slug', data.slug);
        setValue('content', data.content || '');
        setValue('meta_title', data.meta_title || '');
        setValue('meta_description', data.meta_description || '');
        setValue('featured_image_url', data.featured_image_url || '');
        setValue('published', !!data.published);
        setValue('page_type', data.page_type || 'about');
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturedImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadImage(file);
      setValue('featured_image_url', imageUrl);
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `pages/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    if (profile?.id) {
      await supabase.from('media').insert({
        name: file.name,
        file_url: data.publicUrl,
        file_type: file.type,
        size: file.size,
        uploaded_by: profile.id,
        alt_text: ''
      });
    }

    return data.publicUrl;
  };

  const handleContentChange = (value: string) => {
    setValue('content', value);
  };

  const onSubmit = async (formData: PageFormData) => {
    if (!profile?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      
      const content = formData.content;
      
      if (isNew) {
        const { error } = await supabase
          .from('pages')
          .insert({
            ...formData,
            content,
            created_by: profile.id,
          });

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Page created successfully',
        });
      } else {
        const { error } = await supabase
          .from('pages')
          .update({
            ...formData,
            content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Page updated successfully',
        });
      }

      navigate('/admin/pages');
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: 'Error',
        description: 'Failed to save page',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/admin/pages')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNew ? 'Create New Page' : 'Edit Page'}
            </h1>
          </div>
          <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter page title" 
                      {...register('title', { required: 'Title is required' })}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input 
                      id="slug" 
                      placeholder="enter-slug" 
                      {...register('slug', { required: 'Slug is required' })}
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-500">{errors.slug.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="page_type">Page Type</Label>
                    <Select 
                      value={pageType} 
                      onValueChange={(value) => setValue('page_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select page type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="about">About</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                        <SelectItem value="privacy">Privacy Policy</SelectItem>
                        <SelectItem value="terms">Terms and Conditions</SelectItem>
                        <SelectItem value="custom">Custom Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <div className="min-h-[400px]">
                      <ReactQuill
                        theme="snow"
                        value={contentValue}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        className="h-[350px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Publication Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="published" 
                        checked={watch('published')}
                        onCheckedChange={(checked) => setValue('published', checked)}
                      />
                      <Label htmlFor="published" className="cursor-pointer">
                        {watch('published') ? 'Published' : 'Draft'}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>Featured Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                    {featuredImageUrl ? (
                      <div className="relative">
                        <img 
                          src={featuredImageUrl} 
                          alt="Featured" 
                          className="rounded-md w-full h-auto max-h-[200px] object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          onClick={() => setValue('featured_image_url', '')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => document.getElementById('featuredImage')?.click()}
                      >
                        <Image className="mx-auto h-12 w-12 text-gray-300" />
                        <div className="mt-2">
                          <p className="text-sm font-medium">
                            Drag and drop or click to upload
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      id="featuredImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFeaturedImageUpload}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && (
                      <div className="flex items-center justify-center mt-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="ml-2 text-sm">Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>SEO Settings</Label>
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input 
                      id="meta_title" 
                      placeholder="Enter meta title" 
                      {...register('meta_title')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea 
                      id="meta_description" 
                      placeholder="Enter meta description" 
                      className="min-h-[100px]"
                      {...register('meta_description')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PageEditor;