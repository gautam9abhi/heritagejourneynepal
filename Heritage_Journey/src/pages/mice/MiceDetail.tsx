import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Users, Clock, Sparkles, ScrollText, Building, ArrowLeft, ChevronRight } from 'lucide-react';

interface MiceTour {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  type: string;
  capacity: string;
  duration: string;
  services: string;
  amenities: string;
  featuredImageUrl: string;
  description: string[];
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const MiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState<MiceTour | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  // Hardcoded MICE tours data
  const miceCategories: MiceTour[] = [
    {
      id: '1',
      title: 'Conference / Exhibition / Corporate Meeting',
      slug: 'mice',
      subtitle: 'Comprehensive Meetings, Incentives, Conferences, and Exhibitions Experiences in Nepal',
      type: 'MICE',
      capacity: 'Venues accommodate from 50 to over 1,000 participants',
      duration: 'Flexible (1 to 7 days)',
      services: 'Venue booking, catering, technical support, event management, translation services',
      amenities: 'Wi-Fi, parking, shuttle services, audio-visual equipment, on-site technical staff',
      description: [
        'MICE (Meetings, Incentives, Conferences, and Exhibitions) tours in Nepal are rapidly gaining recognition as a premier destination combining business with breathtaking natural beauty and rich cultural heritage. Nepal offers an unparalleled blend of modern conference facilities alongside ancient traditions, providing a truly unique backdrop for any professional event.',
        'The capital city, Kathmandu, serves as the vibrant hub for MICE activities, hosting numerous international conferences and exhibitions. It boasts state-of-the-art convention centers, luxury hotels, and resorts equipped with cutting-edge technology such as high-speed internet, advanced audiovisual setups, and flexible event spaces suitable for small meetings to large-scale gatherings.',
        'Participants enjoy a holistic experience with easy access to sightseeing tours showcasing UNESCO World Heritage Sites, traditional markets, and cultural performances. The majestic Himalayas provide inspiring views and opportunities for adventure-based team-building activities like trekking, rafting, and mountain biking.',
        'Nepal\'s strategic location and Tribhuvan International Airport offer excellent connectivity with direct flights from Asia, Europe, and the Middle East, simplifying travel logistics for global delegates.'
      ],
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
      amenities: 'Transportation, professional guides, catering, luxury or boutique accommodation',
      description: [
        'Nepal offers a wide array of incentive programs designed to inspire, reward, and engage corporate teams. These incentive tours blend immersive cultural experiences with thrilling outdoor activities to foster teamwork, boost morale, and create lasting memories.',
        'Participants can enjoy exclusive cultural tours visiting heritage sites, traditional villages, and artisan workshops, gaining deep insights into Nepal\'s diverse ethnic cultures. Adventure incentives include Himalayan trekking, white-water rafting on pristine rivers, mountain biking, paragliding, and even jungle safaris to spot wildlife in their natural habitats.',
        'Our incentive packages emphasize personalized experiences, from private dinners in historic palaces to guided excursions in the Annapurna and Everest regions. These rewarding experiences are supported by excellent hospitality, ensuring smooth logistics, comfortable accommodations, and attentive service.',
        'Nepal\'s competitive pricing makes it an attractive option for organizations looking to maximize value without compromising quality. Additionally, Nepal is committed to sustainable tourism, allowing your team to contribute positively to local communities and environmental conservation during their stay.'
      ],
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
      amenities: 'Meals, equipment rental, safety gear, cultural experiences, language support',
      description: [
        'Nepal\'s diverse landscapes, cultures, and traditions make it an exceptional destination for special interest tours that cater to a wide spectrum of traveler passions. Whether your visitors seek cultural immersion, thrilling adventures, wildlife exploration, spiritual journeys, or culinary delights, Nepal offers tailored itineraries to fulfill every interest.',
        'Cultural Tours: Explore ancient temples, royal palaces, and vibrant festivals that reveal the soul of Nepal\'s many ethnic groups. Visitors can participate in traditional ceremonies, arts and crafts workshops, and community visits that provide authentic cultural encounters.',
        'Adventure Tours: Nepal is a global hotspot for outdoor enthusiasts. Tailor tours from beginner-friendly treks to advanced mountaineering expeditions. Activities include paragliding over the Pokhara valley, bungee jumping near the Bhote Koshi river, and white-water rafting on Himalayan rivers.',
        'Wildlife Tours: Discover Nepal\'s extraordinary biodiversity in national parks like Chitwan and Bardia. Enjoy safaris spotting Bengal tigers, one-horned rhinos, elephants, and over 500 bird species in their natural environments.',
        'Spiritual Tours: Visit sacred pilgrimage sites such as Lumbini, the birthplace of Buddha, and the Pashupatinath Temple. Yoga retreats and meditation centers provide tranquility for those seeking spiritual growth and wellness.',
        'Photography Tours: Capture Nepal\'s stunning mountain panoramas, bustling street markets, and rich cultural festivals with guided photo excursions led by expert photographers.',
        'Food Tours: Experience Nepalese cuisine through market visits, cooking classes, and food tastings that highlight the fusion of Himalayan, Tibetan, and South Asian flavors.',
        'Volunteer Tours: Engage in meaningful community projects like teaching, healthcare, and conservation, offering visitors the chance to give back while exploring the country.',
        'Each special interest tour is fully customizable, with expert guides delivering in-depth knowledge and personalized service. These tours emphasize sustainability by supporting local communities and eco-friendly practices.'
      ],
      featuredImageUrl: '/images/mice/mice-special.jpg'
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = miceCategories.find(item => item.slug === slug);
    if (found) {
      setTour(found);
    } else {
      navigate('/mice-tours');
    }
    setLoading(false);
  }, [slug, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would handle the form submission, such as sending the data to your backend
    alert('Thank you for your interest! We will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: ''
    });
  };

  const renderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mice': return <Building className="h-6 w-6 text-heritage-purple" />;
      case 'incentives': return <Sparkles className="h-6 w-6 text-heritage-purple" />;
      case 'special interest': return <Users className="h-6 w-6 text-heritage-purple" />;
      default: return <Clock className="h-6 w-6 text-heritage-purple" />;
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

  if (!tour) return null;

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {tour.featuredImageUrl ? (
            <motion.img 
              src={tour.featuredImageUrl}
              alt={tour.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.05 }}
              animate={{ 
                scale: 1.12,
                transition: { 
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-heritage-brown/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        </div>

        <div className="container-custom relative z-10 text-center text-white py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 mb-6"
          >
            {tour.type}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            {tour.title}
          </motion.h1>
          {tour.subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              {tour.subtitle}
            </motion.p>
          )}
        </div>
      </div>

      <div className="bg-white sticky top-[72px] z-20 shadow-md py-4 backdrop-blur-lg bg-opacity-80">
        <div className="container-custom">
          <Link 
            to="/mice-tours" 
            className="inline-flex items-center text-heritage-purple hover:underline text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to All MICE Tours
          </Link>
        </div>
      </div>

      {/* Tour Details */}
      <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="container-custom max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >                <div className="prose prose-lg max-w-none">
                  {/* First paragraph gets special styling as an intro */}
                  {tour.description.length > 0 && (
                    <p className="text-lg font-medium text-heritage-brown/90 leading-relaxed mb-8 border-l-4 border-heritage-purple pl-5 py-2">
                      {tour.description[0]}
                    </p>
                  )}
                  
                  {/* For Special Interest Tours with many sections */}
                  {tour.slug === 'special-interest' ? (
                    <div className="space-y-8">
                      {tour.description.slice(1).map((paragraph, idx) => {
                        // Check if paragraph is a section header (contains a colon)
                        if (paragraph.includes(':') && paragraph.split(':')[0].length < 30) {
                          const [header, content] = paragraph.split(':');
                          return (
                            <div key={idx} className="bg-white/80 rounded-lg p-4 border-l-4 border-heritage-purple/60">
                              <h3 className="text-xl font-semibold text-heritage-purple mb-3">{header}</h3>
                              <p className="text-heritage-brown/80">{content}</p>
                            </div>
                          );
                        }
                        
                        return idx === 0 ? null : (
                          <p key={idx} className="text-heritage-brown/80 leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    // For other tour types
                    <div className="space-y-6">
                      {tour.description.slice(1).map((paragraph, idx) => (
                        <p key={idx} className="text-heritage-brown/80 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>              </motion.div>

              {/* Features Grid */}
              <motion.div 
                className="mt-8" 
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-heritage-brown mb-6">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tour.services && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-heritage-purple/10 rounded-full p-3">
                          <Sparkles className="h-6 w-6 text-heritage-purple" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-heritage-brown mb-2">Services</h3>
                          <p className="text-heritage-brown/80">{tour.services}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {tour.amenities && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-heritage-purple/10 rounded-full p-3">
                          <ScrollText className="h-6 w-6 text-heritage-purple" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-heritage-brown mb-2">Amenities</h3>
                          <p className="text-heritage-brown/80">{tour.amenities}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 space-y-6"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-bold text-heritage-brown border-b pb-2">
                  Quick Overview
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-heritage-purple/10 rounded-full p-3 flex-shrink-0">
                      {renderIcon(tour.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-heritage-brown">Category</h4>
                      <p className="text-heritage-brown/80">{tour.type}</p>
                    </div>
                  </div>

                  {tour.capacity && (
                    <div className="flex items-start gap-4">
                      <div className="bg-heritage-purple/10 rounded-full p-3 flex-shrink-0">
                        <Users className="h-6 w-6 text-heritage-purple" />
                      </div>
                      <div>
                        <h4 className="font-medium text-heritage-brown">Capacity</h4>
                        <p className="text-heritage-brown/80">{tour.capacity}</p>
                      </div>
                    </div>
                  )}

                  {tour.duration && (
                    <div className="flex items-start gap-4">
                      <div className="bg-heritage-purple/10 rounded-full p-3 flex-shrink-0">
                        <Clock className="h-6 w-6 text-heritage-purple" />
                      </div>
                      <div>
                        <h4 className="font-medium text-heritage-brown">Duration</h4>
                        <p className="text-heritage-brown/80">{tour.duration}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Related Tours */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-heritage-brown mb-4">
                  Related Tours
                </h3>
                <div className="space-y-4">
                  {miceCategories
                    .filter(item => item.slug !== slug)
                    .map(item => (
                      <Link 
                        key={item.id} 
                        to={`/mice-tours/${item.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-heritage-purple/5 transition-colors"
                      >
                        <div className="bg-heritage-purple/10 rounded-full p-2 flex-shrink-0">
                          {renderIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-heritage-brown line-clamp-1">{item.title}</h4>
                          <p className="text-sm text-heritage-brown/70">{item.type}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 ml-auto text-heritage-purple/50" />
                      </Link>
                    ))}
                </div>
              </motion.div>
            </div>
          </div>
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

export default MiceDetail;