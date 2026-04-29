import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { type Database } from '@/integrations/supabase/types';
import Layout from '@/components/Layout';

type PageContent = Database['public']['Tables']['pages']['Row'];

const AboutUs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    fetchPageContent();
  }, []);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0); // Scroll to top after loading is complete
    }
  }, [loading]);

  const fetchPageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_type', 'about')
        .eq('published', true)
        .single();

      if (error) throw error;
      if (!data) {
        navigate('/');
        return;
      }

      setPageContent(data);
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
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

  if (!pageContent) return null;

  return (
    <Layout>
      {/* Hero Section with Parallax Effect */}
     <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/hero_section/about_us.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover transform scale-110 animate-[slow-pan_30s_ease-in-out_infinite_alternate]"
            style={{ transformOrigin: 'center center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>
       <div className="container-custom relative z-10 text-center text-white py-32">
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            About Us
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 italic mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "Discover the essence of Heritage Journey Nepal, where passion meets expertise"
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 md:py-8">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <div className="page-content quill-content">
              <div 
                dangerouslySetInnerHTML={{ __html: pageContent.content || '' }}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="p-6 rounded-xl bg-white/60 backdrop-blur-md shadow-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-heritage-brown mb-3">Local knowledge and expertise</h3>
                  <p className="text-heritage-brown/80">Our extensive knowledge and expertise about the destination, which can help you to make the most of your trip.</p>
                </div>

                <div className="p-6 rounded-xl bg-white/60 backdrop-blur-md shadow-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-heritage-brown mb-3">Customized itineraries</h3>
                  <p className="text-heritage-brown/80">We create customized itineraries tailored to the specific interests and preferences of yours with a more personalized and enjoyable travel experience.</p>
                </div>

                <div className="p-6 rounded-xl bg-white/60 backdrop-blur-md shadow-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-heritage-brown mb-3">Convenience</h3>
                  <p className="text-heritage-brown/80">We help to simplify the process by handling all the logistics, such as booking flights, accommodations, transportation, and tours.</p>
                </div>

                <div className="p-6 rounded-xl bg-white/60 backdrop-blur-md shadow-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-heritage-brown mb-3">Safety and security</h3>
                  <p className="text-heritage-brown/80">We help to ensure that travelers stay safe and secure during the trip by providing guidance on local safety measures, precautions, and emergency contacts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
