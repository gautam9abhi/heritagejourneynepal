
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Pencil, Trash2, EyeIcon } from 'lucide-react';

const Pages = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPages();
    checkAndCreateDefaultPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAndCreateDefaultPages = async () => {
    if (!profile?.id) return;

    try {
      // Check if About page exists
      const { data: aboutPage } = await supabase
        .from('pages')
        .select('*')
        .eq('page_type', 'about')
        .maybeSingle();

      // Check if Contact page exists
      const { data: contactPage } = await supabase
        .from('pages')
        .select('*')
        .eq('page_type', 'contact')
        .maybeSingle();

      // If About page doesn't exist, create it
      if (!aboutPage) {
        const aboutContent = `<h1>About Us</h1>
<p>Heritage Journey is a well-established organization run by a team of professionals who have more than 25 years of experience in the industry. With our expertise, we create unique experiences for its customers that are tailored to their specific needs and preferences. We specialize in offering customized travel packages that include adventure activities, cultural tours, and wildlife safaris, among others. The team has a deep understanding of the local culture and geography, which allows us to provide authentic experiences that immerse travelers in the beauty of Nepal. With a focus on customer satisfaction and a commitment to quality, Heritage Journey is dedicated to providing its clients with unforgettable experiences that will last a lifetime.</p>

<h2>Why Travel with us</h2>
<p>Team of experienced professionals some of have been in the industry for over 25 years with a deep understanding of the local culture, geography, and attractions, which allows us to provide our clients with unique and authentic experiences that they will cherish for a lifetime.</p>

<p>Secondly, we offer customized travel packages that are tailored to our clients' needs and preferences. Whether you are interested in adventure activities, cultural tours, or wildlife safaris, we have a package that is perfect for you. We take the time to understand our clients' interests and create itineraries that are personalized to their liking.</p>

<p>Thirdly, we are committed to providing excellent customer service. From the moment you contact us to the end of your trip, we are always here to assist you with any questions or concerns you may have. Our goal is to make sure that your trip to Nepal is stress-free, enjoyable, and memorable.</p>

<p>In summary, customers choose our travel agency for their trip to Nepal because of our experience, customized packages, and commitment to excellent customer service. We pride ourselves on providing our clients with unforgettable experiences that they will remember for the rest of their lives.</p>

<div class="grid md:grid-cols-3 gap-8 mt-12">
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold mb-3">Local knowledge and expertise</h3>
    <p>Our extensive knowledge and expertise about the destination, which can help you to make the most of your trip.</p>
  </div>
  
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold mb-3">Customized itineraries</h3>
    <p>We create customized itineraries tailored to the specific interests and preferences of yours with a more personalized and enjoyable travel experience.</p>
  </div>
  
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold mb-3">Convenience</h3>
    <p>We help to simplify the process by handling all the logistics, such as booking flights, accommodations, transportation, and tours.</p>
  </div>
  
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold mb-3">Safety and security</h3>
    <p>We help to ensure that travelers stay safe and secure during the trip by providing guidance on local safety measures, precautions, and emergency contacts.</p>
  </div>
</div>`;

        await supabase.from('pages').insert({
          title: 'About Us',
          slug: 'about',
          content: aboutContent,
          page_type: 'about',
          published: true,
          created_by: profile.id,
        });
      }

      // If Contact page doesn't exist, create it
      if (!contactPage) {
        const contactContent = `<h1>Contact Us</h1>
<p>We'd love to hear from you! Whether you have a question about our tours, need help planning your trip, or want to provide feedback, our team is here to assist you.</p>

<p>Fill out the form below and we'll get back to you as soon as possible.</p>`;

        await supabase.from('pages').insert({
          title: 'Contact',
          slug: 'contact',
          content: contactContent,
          page_type: 'contact',
          published: true,
          created_by: profile.id,
        });
      }

      // Refresh the pages list
      fetchPages();
    } catch (error) {
      console.error('Error creating default pages:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPages(pages.filter(page => page.id !== id));
      toast({
        title: 'Success',
        description: 'Page deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete page',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Pages</h1>
          <Button onClick={() => navigate('/admin/pages/new')}>
            <Plus className="mr-2 h-4 w-4" /> New Page
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.length > 0 ? (
                  filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>{page.slug}</TableCell>
                      <TableCell className="capitalize">{page.page_type || 'custom'}</TableCell>
                      <TableCell>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                          page.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.published ? 'Published' : 'Draft'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/admin/pages/${page.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(page.id)}
                            disabled={deletingId === page.id}
                          >
                            {deletingId === page.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-500" />
                            )}
                            <span className="sr-only">Delete</span>
                          </Button>
                          <Link to={`/${page.slug}`} target="_blank">
                            <Button variant="ghost" size="icon">
                              <EyeIcon className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No pages found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Pages;