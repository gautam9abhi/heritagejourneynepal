
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  FolderOpen, 
  Image as ImageIcon, 
  FileText as FileIcon, 
  Search, 
  Trash2, 
  Pencil,
  X, 
  Copy, 
  CheckCheck,
  Loader2
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  size: number;
  alt_text: string | null;
  created_at: string;
}

const Media = () => {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [altText, setAltText] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    // Filter media items based on search term
    if (searchTerm) {
      setFilteredItems(
        mediaItems.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.alt_text && item.alt_text.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredItems(mediaItems);
    }
  }, [searchTerm, mediaItems]);

  // Setup drag and drop handlers
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragOver = (e: DragEvent) => {
      preventDefault(e);
      dropArea.classList.add('bg-gray-100', 'border-blue-500');
    };

    const handleDragLeave = (e: DragEvent) => {
      preventDefault(e);
      dropArea.classList.remove('bg-gray-100', 'border-blue-500');
    };

    const handleDrop = (e: DragEvent) => {
      preventDefault(e);
      dropArea.classList.remove('bg-gray-100', 'border-blue-500');
      
      if (e.dataTransfer?.files) {
        handleFiles(e.dataTransfer.files);
      }
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMediaItems(data || []);
      setFilteredItems(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
          
        // Insert into the media table
        const { error: insertError } = await supabase.from('media').insert({
          name: file.name,
          file_url: publicUrlData.publicUrl,
          file_type: file.type,
          size: file.size,
          uploaded_by: user?.id,
          alt_text: file.name
        });
        
        if (insertError) throw insertError;
        
        return true;
      });
      
      await Promise.all(uploadPromises);
      
      toast({
        title: 'Success',
        description: `${files.length} file(s) uploaded successfully`,
      });
      
      fetchMedia(); // Refresh the media list
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const openEditDialog = (item: MediaItem) => {
    setSelectedItem(item);
    setAltText(item.alt_text || '');
    setEditDialogOpen(true);
  };

  const updateAltText = async () => {
    if (!selectedItem) return;
    
    try {
      const { error } = await supabase
        .from('media')
        .update({ alt_text: altText })
        .eq('id', selectedItem.id);
        
      if (error) throw error;
      
      // Update the local state
      setMediaItems(mediaItems.map(item => 
        item.id === selectedItem.id ? { ...item, alt_text: altText } : item
      ));
      
      toast({
        title: 'Success',
        description: 'Alt text updated successfully',
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating alt text:', error);
      toast({
        title: 'Error',
        description: 'Failed to update alt text',
        variant: 'destructive',
      });
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media file? This action cannot be undone.')) {
      return;
    }
    
    try {
      const item = mediaItems.find(item => item.id === id);
      if (!item) return;
      
      // Extract the path from the URL
      const url = new URL(item.file_url);
      const pathMatch = url.pathname.match(/media\/(.+)$/);
      
      if (pathMatch && pathMatch[1]) {
        const storagePath = decodeURIComponent(pathMatch[1]);
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('media')
          .remove([storagePath]);
          
        if (storageError) {
          console.error('Error deleting from storage:', storageError);
          // Continue anyway to delete from database
        }
      }
      
      // Delete from database
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setMediaItems(mediaItems.filter(item => item.id !== id));
      
      toast({
        title: 'Success',
        description: 'Media deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete media',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (type: string): boolean => {
    return type.startsWith('image/');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload Files
            </Button>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div 
          ref={dropAreaRef}
          className="border-2 border-dashed rounded-md p-8 text-center transition-colors"
        >
          <FolderOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Drag and drop files here</h3>
          <p className="mt-1 text-xs text-gray-500">
            Or <button className="text-blue-500 hover:text-blue-700" onClick={() => fileInputRef.current?.click()}>browse</button> to upload
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium">No media found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload some files to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative bg-gray-100 h-40 flex items-center justify-center">
                  {isImageFile(item.file_type) ? (
                    <img
                      src={item.file_url}
                      alt={item.alt_text || item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileIcon className="h-16 w-16 text-gray-400" />
                      <span className="text-xs mt-2 text-gray-500">
                        {item.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-white hover:bg-gray-100"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-white hover:bg-gray-100 text-red-500 hover:text-red-700"
                      onClick={() => deleteMedia(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="truncate text-sm font-medium">{item.name}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{formatFileSize(item.size)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(item.file_url)}
                    >
                      {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media Details</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex justify-center">
                {isImageFile(selectedItem.file_type) ? (
                  <img
                    src={selectedItem.file_url}
                    alt={selectedItem.alt_text || selectedItem.name}
                    className="max-h-48 object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <FileIcon className="h-16 w-16 text-gray-400" />
                    <span className="text-sm mt-2 text-gray-500">
                      {selectedItem.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Filename</Label>
                <Input
                  id="name"
                  value={selectedItem.name}
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alt-text">Alt Text</Label>
                <Textarea
                  id="alt-text"
                  placeholder="Describe this media for accessibility"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Describe the appearance and function of the image for users who cannot see it.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <div className="flex">
                  <Input
                    id="url"
                    value={selectedItem.file_url}
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button
                    variant="outline"
                    className="rounded-l-none border-l-0"
                    onClick={() => copyToClipboard(selectedItem.file_url)}
                  >
                    {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>File Type</Label>
                  <p className="text-sm text-gray-600">{selectedItem.file_type}</p>
                </div>
                <div>
                  <Label>Size</Label>
                  <p className="text-sm text-gray-600">{formatFileSize(selectedItem.size)}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={updateAltText}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Media;
