import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { type Database } from '@/integrations/supabase/types';
import Layout from '@/components/Layout';

type Destination = Database['public']['Tables']['destinations']['Row'];

const DestinationDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDestination();
  }, [slug]);

  const fetchDestination = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      if (!data) {
        navigate('/destinations');
        return;
      }

      setDestination(data);
    } catch (error) {
      console.error('Error:', error);
      navigate('/destinations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-purple"></div>
        </div>
      </Layout>
    );
  }

  if (!destination) return null;

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0">
          {destination.featured_image_url ? (
            <img 
              src={destination.featured_image_url}
              alt={destination.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-heritage-brown/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>

        <div className="container-custom relative z-10 text-center text-white py-20">
          <h1 className="text-4xl text-white/90 md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {destination.title}
          </h1>
          {destination.subtitle && (
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {destination.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <div 
              className="destination-content quill-content"
              dangerouslySetInnerHTML={{ __html: destination.content || '' }}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DestinationDetail;