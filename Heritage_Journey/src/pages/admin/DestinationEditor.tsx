import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { type Database } from '@/integrations/supabase/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Image, Loader2, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Destination = Database['public']['Tables']['destinations']['Row'];
type DestinationInsert = Database['public']['Tables']['destinations']['Insert'];

const DestinationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewDestination = id === 'new';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [published, setPublished] = useState(false);
  const [sortOrder, setSortOrder] = useState<number>(0);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
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
    'align',
    'list', 'bullet',
    'link', 'image'
  ];

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleEditorImageUpload = async (blobInfo: any) => {
    try {
      const file = blobInfo.blob();
      const fileExt = file.name?.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `destination-content/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!isNewDestination) {
      fetchDestination();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchDestination = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setContent(data.content || '');
        setSubtitle(data.subtitle || '');
        setFeaturedImage(data.featured_image_url || null);
        setPublished(data.published || false);
        setSortOrder(data.sort_order || 0);
      }
    } catch (error) {
      console.error('Error fetching destination:', error);
      toast({
        title: 'Error',
        description: 'Failed to load destination',
        variant: 'destructive',
      });
      navigate('/admin/destinations');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    setSlug(slug);
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFeaturedImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFeaturedImage = async (): Promise<string | null> => {
    if (!featuredImageFile) return featuredImage;
    
    try {
      setUploading(true);
      
      const fileExt = featuredImageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `destination-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, featuredImageFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload featured image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const saveDestination = async () => {
    if (!title) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Upload image if needed
      const imageUrl = await uploadFeaturedImage();
      
      const destinationData: DestinationInsert = {
        title,
        slug: slug || title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
        content,
        subtitle,
        featured_image_url: imageUrl,
        created_by: user?.id,
        published,
        sort_order: sortOrder
      };
      
      if (isNewDestination) {
        const { data, error } = await supabase
          .from('destinations')
          .insert(destinationData)
          .select()
          .single();
          
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Destination created successfully',
        });
        
        navigate(`/admin/destinations/${data.id}`);
      } else {
        const { error } = await supabase
          .from('destinations')
          .update({
            ...destinationData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Destination updated successfully',
        });
      }
    } catch (error) {
      console.error('Error saving destination:', error);
      toast({
        title: 'Error',
        description: 'Failed to save destination',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin/destinations')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNewDestination ? 'Create New Destination' : 'Edit Destination'}
            </h1>
          </div>
          
          <Button onClick={saveDestination} disabled={saving || uploading}>
            {(saving || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!saving && !uploading && <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter destination title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => !slug && generateSlug()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    placeholder="Enter destination subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <div className="min-h-[400px]">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={handleContentChange}
                      modules={modules}
                      formats={formats}
                      className="h-[350px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="destination-url-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Published Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this destination visible to visitors
                    </p>
                  </div>
                  <Switch
                    checked={published}
                    onCheckedChange={setPublished}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    placeholder="Enter sort order (lower numbers appear first)"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers will appear first on the destinations page
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                {featuredImage ? (
                  <div className="relative">
                    <img 
                      src={featuredImage} 
                      alt="Featured" 
                      className="w-full h-[200px] object-cover rounded-md mb-4" 
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      onClick={() => {
                        setFeaturedImage(null);
                        setFeaturedImageFile(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                       onClick={() => document.getElementById('featuredImage')?.click()}>
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
                  id="featuredImage"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById('featuredImage')?.click()}
                >
                  Select Image
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DestinationEditor;