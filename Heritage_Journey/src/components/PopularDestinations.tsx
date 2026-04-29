
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { type Database } from '@/integrations/supabase/types';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

type Destination = Database['public']['Tables']['destinations']['Row'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PopularDestinations = () => {
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationClick = () => {
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-purple"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title text-center text-heritage-brown">Popular Destinations</h2>
          <p className="section-subtitle text-center text-3xl font-serif font-bold tracking-wide text-heritage-brown mb-4">
            Discover the most visited places in Nepal
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {destinations.map((destination) => (
            <motion.div key={destination.id} variants={item}>
              <Link 
                to={`/destinations/${destination.slug}`}
                className="group block"
                onClick={handleDestinationClick}
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-500">
                  {destination.featured_image_url ? (
                    <img
                      src={destination.featured_image_url}
                      alt={destination.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-heritage-brown/10 flex items-center justify-center">
                      <span className="text-heritage-brown/30 text-4xl">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-heritage-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                      {destination.title}
                    </h3>
                    {destination.subtitle && (
                      <p className="text-white/90 mb-3">
                        {destination.subtitle}
                      </p>
                    )}
                    <Badge 
                      variant="glass" 
                      className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      Explore Now
                    </Badge>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/destinations"
            className="btn-primary inline-flex items-center gap-2 hover:scale-105 transition-all duration-300"
            onClick={handleDestinationClick}
          >
            View All Destinations
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularDestinations;
