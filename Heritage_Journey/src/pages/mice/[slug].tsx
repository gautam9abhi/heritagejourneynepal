
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Building, Clock, Users, Map, Calendar, Mail, ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';

// Animation variants
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

const MiceDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  // Hardcoded content based on slug
  const getContent = () => {
    switch (slug) {
      case 'mice':
        return {
          title: 'Conference / Exhibition / Corporate Meeting',
          subtitle: 'Comprehensive Meetings, Incentives, Conferences, and Exhibitions Experiences in Nepal',
          description: `
            <p>MICE (Meetings, Incentives, Conferences, and Exhibitions) tours in Nepal are rapidly gaining recognition as a premier destination combining business with breathtaking natural beauty and rich cultural heritage. Nepal offers an unparalleled blend of modern conference facilities alongside ancient traditions, providing a truly unique backdrop for any professional event.</p>
            
            <p>The capital city, Kathmandu, serves as the vibrant hub for MICE activities, hosting numerous international conferences and exhibitions. It boasts state-of-the-art convention centers, luxury hotels, and resorts equipped with cutting-edge technology such as high-speed internet, advanced audiovisual setups, and flexible event spaces suitable for small meetings to large-scale gatherings.</p>
            
            <p>Participants enjoy a holistic experience with easy access to sightseeing tours showcasing UNESCO World Heritage Sites, traditional markets, and cultural performances. The majestic Himalayas provide inspiring views and opportunities for adventure-based team-building activities like trekking, rafting, and mountain biking.</p>
            
            <p>Nepal's strategic location and Tribhuvan International Airport offer excellent connectivity with direct flights from Asia, Europe, and the Middle East, simplifying travel logistics for global delegates.</p>
          `,
          features: {
            services: 'Venue booking, catering, technical support, event management, translation services',
            amenities: 'Wi-Fi, parking, shuttle services, audio-visual equipment, on-site technical staff',
            capacity: 'Venues accommodate from 50 to over 1,000 participants',
            duration: 'Flexible (1 to 7 days)'
          },
          icon: <Building className="w-8 h-8" />,
          images: [
            '/images/mice/mice-conference.jpg',
            '/images/mice/mice-meeting.jpg',
            '/images/mice/mice-exhibition.jpg',
          ],
          color: 'heritage-purple'
        };
      case 'incentives':
        return {
          title: 'Incentive Tour / Team Building',
          subtitle: 'Rewarding and Motivational Programs Tailored for Corporate Teams',
          description: `
            <p>Nepal offers a wide array of incentive programs designed to inspire, reward, and engage corporate teams. These incentive tours blend immersive cultural experiences with thrilling outdoor activities to foster teamwork, boost morale, and create lasting memories.</p>
            
            <p>Participants can enjoy exclusive cultural tours visiting heritage sites, traditional villages, and artisan workshops, gaining deep insights into Nepal's diverse ethnic cultures. Adventure incentives include Himalayan trekking, white-water rafting on pristine rivers, mountain biking, paragliding, and even jungle safaris to spot wildlife in their natural habitats.</p>
            
            <p>Our incentive packages emphasize personalized experiences, from private dinners in historic palaces to guided excursions in the Annapurna and Everest regions. These rewarding experiences are supported by excellent hospitality, ensuring smooth logistics, comfortable accommodations, and attentive service.</p>
            
            <p>Nepal's competitive pricing makes it an attractive option for organizations looking to maximize value without compromising quality. Additionally, Nepal is committed to sustainable tourism, allowing your team to contribute positively to local communities and environmental conservation during their stay.</p>
          `,
          features: {
            services: 'Adventure activities, cultural tours, hospitality management, event planning',
            amenities: 'Transportation, professional guides, catering, luxury or boutique accommodation',
            capacity: 'Typically 20 to 100 participants',
            duration: 'Customizable, generally 3 to 7 days'
          },
          icon: <Users className="w-8 h-8" />,
          images: [
            '/images/mice/mice-incentive.jpg',
            '/images/mice/mice-teambuilding.jpg',
            '/images/mice/mice-adventure.jpg',
          ],
          color: 'heritage-yellow'
        };
      case 'special-interest':
        return {
          title: 'Special Interest / Cultural / Adventure / Spiritual / Volunteer',
          subtitle: "Tailored Experiences for Every Traveler's Unique Passion in Nepal",
          description: `
            <p>Nepal's diverse landscapes, cultures, and traditions make it an exceptional destination for special interest tours that cater to a wide spectrum of traveler passions. Whether your visitors seek cultural immersion, thrilling adventures, wildlife exploration, spiritual journeys, or culinary delights, Nepal offers tailored itineraries to fulfill every interest.</p>
            
            <p><strong>Cultural Tours:</strong> Explore ancient temples, royal palaces, and vibrant festivals that reveal the soul of Nepal's many ethnic groups. Visitors can participate in traditional ceremonies, arts and crafts workshops, and community visits that provide authentic cultural encounters.</p>
            
            <p><strong>Adventure Tours:</strong> Nepal is a global hotspot for outdoor enthusiasts. Tailor tours from beginner-friendly treks to advanced mountaineering expeditions. Activities include paragliding over the Pokhara valley, bungee jumping near the Bhote Koshi river, and white-water rafting on Himalayan rivers.</p>
            
            <p><strong>Wildlife Tours:</strong> Discover Nepal's extraordinary biodiversity in national parks like Chitwan and Bardia. Enjoy safaris spotting Bengal tigers, one-horned rhinos, elephants, and over 500 bird species in their natural environments.</p>
            
            <p><strong>Spiritual Tours:</strong> Visit sacred pilgrimage sites such as Lumbini, the birthplace of Buddha, and the Pashupatinath Temple. Yoga retreats and meditation centers provide tranquility for those seeking spiritual growth and wellness.</p>
            
            <p><strong>Photography Tours:</strong> Capture Nepal's stunning mountain panoramas, bustling street markets, and rich cultural festivals with guided photo excursions led by expert photographers.</p>
            
            <p><strong>Food Tours:</strong> Experience Nepalese cuisine through market visits, cooking classes, and food tastings that highlight the fusion of Himalayan, Tibetan, and South Asian flavors.</p>
            
            <p><strong>Volunteer Tours:</strong> Engage in meaningful community projects like teaching, healthcare, and conservation, offering visitors the chance to give back while exploring the country.</p>
            
            <p>Each special interest tour is fully customizable, with expert guides delivering in-depth knowledge and personalized service. These tours emphasize sustainability by supporting local communities and eco-friendly practices.</p>
          `,
          features: {
            services: 'Customized itineraries, expert guides, local transportation, accommodation arrangements',
            amenities: 'Meals, equipment rental, safety gear, cultural experiences, language support',
            capacity: 'Small groups of 5 to 30 participants for personalized attention',
            duration: 'Flexible from 1 day to 2 weeks or more'
          },
          icon: <Map className="w-8 h-8" />,
          images: [
            '/images/mice/mice-special.jpg',
            '/images/mice/mice-cultural.jpg',
            '/images/mice/mice-spiritual.jpg',
          ],
          color: 'heritage-brown'
        };
      default:
        // Default fallback content
        return {
          title: 'MICE & Special Tours',
          subtitle: 'Experience the best of Nepal with our tailored tours',
          description: '<p>Please select a specific category to view detailed information.</p>',
          features: {
            services: 'Various services available',
            amenities: 'Multiple amenities provided',
            capacity: 'Accommodates various group sizes',
            duration: 'Flexible duration options'
          },
          icon: <Building className="w-8 h-8" />,
          images: ['/hero_section.jpg'],
          color: 'heritage-purple'
        };
    }
  };

  const content = getContent();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: ''
    });
    // Show success message
    alert('Thank you! Your inquiry has been submitted. Our team will get back to you within 24 hours.');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img 
            src={content.images[0]}
            alt={content.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ 
              scale: 1.1,
              transition: { 
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        </div>
        <div className="container-custom relative z-10 text-white py-20">
          <Link 
            to="/mice" 
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Categories
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <div className={`bg-${content.color} bg-opacity-20 backdrop-blur-sm p-3 rounded-full mr-4`}>
                {content.icon}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {content.title}
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mt-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              {content.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <motion.div 
              className="lg:col-span-2"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content.description }} />
              
              {/* Features */}
              <motion.div 
                className="mt-12"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-2xl font-bold mb-6">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    variants={fadeIn}
                    className="bg-white rounded-xl shadow-md p-6 border-l-4 border-heritage-purple"
                  >
                    <h3 className="font-medium text-lg mb-2 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-heritage-purple" /> 
                      Services
                    </h3>
                    <p className="text-gray-600">{content.features.services}</p>
                  </motion.div>
                  
                  <motion.div 
                    variants={fadeIn}
                    className="bg-white rounded-xl shadow-md p-6 border-l-4 border-heritage-yellow"
                  >
                    <h3 className="font-medium text-lg mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-heritage-yellow" /> 
                      Amenities
                    </h3>
                    <p className="text-gray-600">{content.features.amenities}</p>
                  </motion.div>
                  
                  <motion.div 
                    variants={fadeIn}
                    className="bg-white rounded-xl shadow-md p-6 border-l-4 border-heritage-brown"
                  >
                    <h3 className="font-medium text-lg mb-2 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-heritage-brown" /> 
                      Duration
                    </h3>
                    <p className="text-gray-600">{content.features.duration}</p>
                  </motion.div>
                  
                  <motion.div 
                    variants={fadeIn}
                    className="bg-white rounded-xl shadow-md p-6 border-l-4 border-heritage-green"
                  >
                    <h3 className="font-medium text-lg mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-heritage-green" /> 
                      Capacity
                    </h3>
                    <p className="text-gray-600">{content.features.capacity}</p>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Gallery */}
              {content.images.length > 1 && (
                <motion.div 
                  className="mt-12"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                >
                  <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {content.images.map((img, index) => (
                      <motion.div 
                        key={index}
                        className="aspect-[4/3] overflow-hidden rounded-lg"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img 
                          src={img} 
                          alt={`${content.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Request Info Form */}
            <motion.div 
              className="bg-white rounded-xl shadow-xl p-6 lg:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="sticky top-28">
                <h2 className="text-2xl font-bold mb-6">Request More Information</h2>
                <p className="text-gray-600 mb-6">Our team will get back to you within 24 hours with detailed information about our {content.title} options.</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name*</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-purple focus:border-heritage-purple transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-purple focus:border-heritage-purple transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-purple focus:border-heritage-purple transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-purple focus:border-heritage-purple transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Requirements*</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-purple focus:border-heritage-purple transition-colors"
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full bg-heritage-purple text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center hover:bg-heritage-purple/90 transition-colors`}
                  >
                    Submit Request <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.button>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    By submitting this form, you agree to our privacy policy and consent to being contacted regarding your inquiry.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related MICE Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.h2 
            className="text-3xl font-bold mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore Other MICE Categories
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >            {['mice', 'incentives', 'special-interest'].filter(s => s !== slug).map((relatedSlug, index) => {
              // For each related slug, we need to manually call the getContent function
              // with the appropriate content based on the relatedSlug
              const getRelatedContent = () => {
                switch (relatedSlug) {
                  case 'mice':
                    return {
                      title: 'Conference / Exhibition / Corporate Meeting',
                      subtitle: 'Comprehensive Meetings, Incentives, Conferences, and Exhibitions Experiences',
                      images: ['/images/mice/mice-conference.jpg'],
                      icon: <Building className="w-8 h-8" />
                    };
                  case 'incentives':
                    return {
                      title: 'Incentive Tour / Team Building',
                      subtitle: 'Rewarding and Motivational Programs Tailored for Corporate Teams',
                      images: ['/images/mice/mice-incentive.jpg'],
                      icon: <Sparkles className="w-8 h-8" />
                    };
                  case 'special-interest':
                    return {
                      title: 'Special Interest Tours',
                      subtitle: "Tailored Experiences for Every Traveler's Unique Passion",
                      images: ['/images/mice/mice-special.jpg'],
                      icon: <Map className="w-8 h-8" />
                    };
                  default:
                    return {
                      title: 'MICE & Special Tours',
                      subtitle: 'Experience the best of Nepal with our tailored tours',
                      images: ['/hero_section.jpg'],
                      icon: <Building className="w-8 h-8" />
                    };
                }
              };
              
              const relatedContent = getRelatedContent();
              return (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/mice/${relatedSlug}`} className="block">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={relatedContent.images[0]} 
                        alt={relatedContent.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white mb-2">{relatedContent.title}</h3>
                        <p className="text-white/80 line-clamp-2">{relatedContent.subtitle}</p>
                      </div>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                        {relatedContent.icon}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
          
          <div className="mt-12 text-center">
            <Link to="/mice">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-heritage-purple/10 text-heritage-purple py-3 px-8 rounded-full font-medium flex items-center justify-center hover:bg-heritage-purple/20 transition-colors mx-auto"
              >
                View All MICE Categories <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MiceDetails;
