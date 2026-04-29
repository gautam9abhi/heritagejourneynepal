import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';

interface Destination {
  id: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  slug: string;
  featured_image_url: string | null;
  created_at: string;
  updated_at: string | null;
  created_by: string;
  published: boolean;
}

const Destinations = () => {
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDestinations();
  }, []);
  
  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section with Parallax Effect */}
      <div className="relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video 
            src="/images/hero_section/destination.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>
        <div className="container-custom relative z-10 text-center text-white py-24 md:py-32">
          <h1 
            className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 animate-fade-in pt-12 md:pt-0"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            Destinations
          </h1>
          <p 
            className="text-lg md:text-2xl text-white/90 italic mb-6 md:mb-8 animate-fade-in px-4 md:px-0"
            style={{ animationDelay: '0.2s', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "From the majestic Himalayas, uncover the world’s most breathtaking destinations"
          </p>
        </div>
      </div>

      {/* Destinations Grid */}
      <section className="py-10 md:py-16">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-purple"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {destinations.map((destination) => (
                <Link 
                  key={destination.id} 
                  to={`/destinations/${destination.slug}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                    {destination.featured_image_url ? (
                      <img
                        src={destination.featured_image_url}
                        alt={destination.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-heritage-brown/10 flex items-center justify-center">
                        <span className="text-heritage-brown/30 text-4xl">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
                        {destination.title}
                      </h3>
                      {destination.subtitle && (
                        <p className="text-white/90 text-sm md:text-base">
                          {destination.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Destinations;
