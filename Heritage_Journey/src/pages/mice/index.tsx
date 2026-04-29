import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Building, Users, Clock, Sparkles, ChevronRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

interface MiceCategory {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  type: string;
  capacity: string;
  duration: string;
  services: string;
  description: string;
  featuredImageUrl: string;
}

const MicePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Ensure page scrolls to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hardcoded MICE tours data
  const miceCategories: MiceCategory[] = [
    {
      id: '1',
      title: 'Conference / Exhibition / Corporate Meeting',
      slug: 'mice',
      subtitle: 'Comprehensive Meetings, Incentives, Conferences, and Exhibitions Experiences in Nepal',
      type: 'MICE',
      capacity: 'Venues accommodate from 50 to over 1,000 participants',
      duration: 'Flexible (1 to 7 days)',
      services: 'Venue booking, catering, technical support, event management, translation services',
      description: 'MICE tours in Nepal are rapidly gaining recognition as a premier destination combining business with breathtaking natural beauty and rich cultural heritage.',
      featuredImageUrl: '/images/mice/mice-conference.jpg'
    },
    {
      id: '2',
      title: 'Incentive Tour / Team Building',
      slug: 'incentives',
      subtitle: 'Rewarding and Motivational Programs Tailored for Corporate Teams',
      type: 'Incentives',
      capacity: 'Typically 20 to 100 participants',
      duration: 'Customizable, generally 3 to 7 days',
      services: 'Adventure activities, cultural tours, hospitality management, event planning',
      description: 'Nepal offers a wide array of incentive programs designed to inspire, reward, and engage corporate teams.',
      featuredImageUrl: '/images/mice/mice-incentive.jpg'
    },
    {
      id: '3',
      title: 'Special Interest / Cultural / Adventure / Spiritual / Volunteer',
      slug: 'special-interest',
      subtitle: "Tailored Experiences for Every Traveler's Unique Passion in Nepal",
      type: 'Special Interest',
      capacity: 'Small groups of 5 to 30 participants for personalized attention',
      duration: 'Flexible from 1 day to 2 weeks or more',
      services: 'Customized itineraries, expert guides, local transportation, accommodation arrangements',
      description: "Nepal's diverse landscapes, cultures, and traditions make it an exceptional destination for special interest tours that cater to a wide spectrum of traveler passions.",
      featuredImageUrl: '/images/mice/mice-special.jpg'
    }
  ];

  const renderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mice': return <Building className="h-6 w-6" />;
      case 'incentives': return <Sparkles className="h-6 w-6" />;
      case 'special interest': return <Users className="h-6 w-6" />;
      default: return <Clock className="h-6 w-6" />;
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video 
            src="/images/hero_section/mice.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>
        <motion.div 
          className="container-custom relative z-10 text-center text-white py-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            MICE & Special Tours
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 italic mb-8 max-w-4xl mx-auto"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "Experience the best of Nepal with our tailored MICE tours, designed to meet your unique needs and preferences"
          </p>
        </motion.div>
      </div>

      {/* Category Pills */}
      <div className="bg-white sticky top-[72px] z-20 shadow-md py-4 backdrop-blur-lg bg-opacity-80">
        <div className="container-custom">
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-heritage-purple text-white shadow-lg shadow-heritage-purple/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </motion.button>
            {miceCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.type)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.type
                    ? 'bg-heritage-purple text-white shadow-lg shadow-heritage-purple/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.type}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {miceCategories
              .filter(tour => selectedCategory === null || tour.type === selectedCategory)
              .map((tour) => (
                <motion.div
                  key={tour.id}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-xl shadow-xl bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3]">
                      <img
                        src={tour.featuredImageUrl || "/placeholder.svg"}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        {renderIcon(tour.type)}
                      </div>
                    </div>

                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 p-6"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-heritage-purple-light transition-colors">
                        {tour.title}
                      </h3>
                      <p className="text-white/90 line-clamp-2 mb-3">
                        {tour.subtitle}
                      </p>
                      <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                        <span className="bg-heritage-purple/30 backdrop-blur-sm px-3 py-1 rounded-full">
                          {tour.type}
                        </span>
                        {tour.capacity && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/50"></span>
                            <span className="line-clamp-1 text-xs">{tour.capacity}</span>
                          </>
                        )}
                      </div>

                      <Link
                        to={`/mice-tours/${tour.slug}`}
                        className="inline-flex items-center text-white bg-heritage-purple/80 hover:bg-heritage-purple px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm"
                      >
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-1">Duration</h4>
                      <p className="text-sm text-gray-600">{tour.duration}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-1">Features & Amenities</h4>
                      <p className="text-sm text-gray-600">{tour.services}</p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 border-t border-gray-200 pt-4"
                    >
                      <Link
                        to={`/mice-tours/${tour.slug}`}
                        className="inline-flex items-center text-heritage-purple hover:underline text-sm font-medium"
                      >
                        Request More Information <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-heritage-brown/5">
        <div className="container-custom">
          <motion.div 
            className="bg-white rounded-2xl overflow-hidden shadow-xl relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-heritage-purple/20 to-heritage-brown/20 backdrop-blur-md"></div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Need a Custom MICE Solution?</h2>
                <p className="text-gray-600 mb-6 max-w-2xl">
                  Our team of experts can craft a personalized MICE experience tailored to your organization's specific requirements and objectives.
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-heritage-purple hover:bg-heritage-purple/90 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Contact Our MICE Specialists
                </Link>
              </div>
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <Building className="w-20 h-20 text-heritage-purple" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MicePage;
