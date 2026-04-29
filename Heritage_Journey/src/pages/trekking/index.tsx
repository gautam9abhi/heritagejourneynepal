
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface Trek {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  duration: string | null;
  difficulty: string | null;
  max_altitude: string | null;
  featured_image_url: string | null;
}

// Hardcoded trek data
const treks: Trek[] = [
  {
    id: '1',
    title: 'Annapurna Base Camp Trek',
    slug: 'annapurna-base-camp',
    subtitle: 'Into the Shadow of Giants',
    duration: '12-14 Days',
    difficulty: 'Moderate',
    max_altitude: '4,130m',
    featured_image_url: '/images/trekking/abc/annapurna-base-camp.jpg', // Replace with your image path
  },
  {
    id: '2',
    title: 'Round Annapurna Trek',
    slug: 'round-annapurna-trek',
    subtitle: 'A Journey Around the Annapurna Range',
    duration: '14-16 Days',
    difficulty: 'Challenging',
    max_altitude: '5,416m',
    featured_image_url: '/images/trekking/circuit/thorangla-1.jpg', // Replace with your image path
  },
  {
    id: '3',
    title: 'Everest Base Camp Trek',
    slug: 'everest-base-camp-trek',
    subtitle: 'Trekking to the Roof of the World',
    duration: '12-14 Days',
    difficulty: 'Strenuous',
    max_altitude: '5,364m',
    featured_image_url: '/images/trekking/ebc/everest-1.jpg', // Replace with your image path
  },
  {
    id: '4',
    title: 'Langtang Himal Trek',
    slug: 'langtang-himal-trek',
    subtitle: 'Explore the Hidden Valley',
    duration: '10-12 Days',
    difficulty: 'Moderate',
    max_altitude: '4,984m',
    featured_image_url: '/images/trekking/langtang/langtang-3.jpg', // Replace with your image path
  },  {
    id: '5',
    title: 'Upper Mustang Trek',
    slug: 'upper-mustang',
    subtitle: 'A Journey to the Forbidden Kingdom',
    duration: '14-16 Days',
    difficulty: 'Challenging',
    max_altitude: '4,500m',
    featured_image_url: '/images/trekking/upper/upper-3.jpg', // Replace with your image path
  },
  {
    id: '6',
    title: 'Short Duration Treks from Pokhara',
    slug: 'short-duration-treks',
    subtitle: 'Explore the Himalayas on Quick Adventures',
    duration: '2-7 Days',
    difficulty: 'Easy to Moderate',
    max_altitude: '3,660m',
    featured_image_url: '/images/trekking/pokhara/pokhara-short-trek.jpg', // Add a proper image path for short treks
  },
];

const difficultyColor = (difficulty: string | null) => {
  if (!difficulty) return "purple";
  
  switch(difficulty.toLowerCase()) {
    case "easy": return "success";
    case "moderate": return "warning";
    case "challenging": 
    case "strenuous": 
    case "difficult": return "destructive";
    default: return "purple";
  }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const TrekkingPage = () => {
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout>
      {/* Hero Section with Parallax Effect */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video 
            src="/images/hero_section/trekking.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>
       <div className="container-custom relative z-10 text-center text-white py-32">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            Nepal Trekking Adventures
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 italic mb-8"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "Embark on a journey through the majestic Himalayas, where every step unveils breathtaking landscapes and rich cultural heritage"
          </motion.p>
        </div>
      </div>

      {/* Treks Grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-purple"></div>
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {treks.map((trek) => (
                <motion.div key={trek.id} variants={item}>
                  <Link 
                    to={`/trekking/${trek.slug}`}
                    className="group block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {trek.featured_image_url ? (
                        <img
                          src={trek.featured_image_url}
                          alt={trek.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-heritage-brown/10 flex items-center justify-center">
                          <span className="text-heritage-brown/30 text-4xl">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                      <div className="absolute top-4 right-4">
                        <Badge variant={difficultyColor(trek.difficulty)} size="lg" className="backdrop-blur-sm">
                          {trek.difficulty}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300">
                          {trek.title}
                        </h3>
                        <div className="space-y-3">
                          {trek.subtitle && (
                            <p className="text-white/90">
                              {trek.subtitle}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                            {trek.duration && (
                              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span>{trek.duration}</span>
                              </div>
                            )}
                            {trek.max_altitude && (
                              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span>{trek.max_altitude}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TrekkingPage;
