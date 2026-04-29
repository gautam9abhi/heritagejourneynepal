import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { type Database } from '@/integrations/supabase/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

type Destination = Database['public']['Tables']['destinations']['Row'];

const Destinations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetchDestinations();
  }, []);
  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load destinations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDestination = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Destination deleted successfully',
      });

      fetchDestinations();
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete destination',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Destinations</h1>
          <Button onClick={() => navigate('/admin/destinations/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Destination
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : destinations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No destinations yet</h3>
              <p className="text-sm text-gray-500">
                Create your first destination to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden">
                <div className="relative h-48">
                  {destination.featured_image_url ? (
                    <img
                      src={destination.featured_image_url}
                      alt={destination.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => navigate(`/admin/destinations/${destination.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteDestination(destination.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{destination.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500 truncate">
                      {destination.subtitle || 'No subtitle'}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      destination.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {destination.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                      Order: {(destination as any).sort_order || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Destinations;