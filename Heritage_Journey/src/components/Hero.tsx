import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSc71C6J6pFkLcYmP4uuEo9sHXglwK4WiTj_WOvAW32qx4vQYQ/viewform?usp=dialog";

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full"
          style={{
            transform: `translateY(${-scrollPosition * 0.04}px)`,
            filter: 'brightness(0.62) contrast(1.18) saturate(1.05)'
          }}
        >
          <source src="background.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/75 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-orange-300 tracking-[4px] text-sm md:text-base font-medium mb-4"
          >
            HERITAGE JOURNEY • NEPAL
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tighter mb-8"
          >
            Embark on a Journey<br className="hidden md:block" /> of Discovery
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-light"
          >
            Discover the soul of Nepal — from towering Himalayas and sacred temples 
            to vibrant cultures and legendary hospitality.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link
              to="/destinations"
              className="group bg-pink text-white px-10 py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-2xl"
            >
              Discover Destinations
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* New Book Now Button */}
            <motion.a
              href={googleFormLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl"
            >
              <Calendar className="h-6 w-6" />
              Book Now
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollPosition < 100 ? 1 : 0 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
      >
        <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
        <span className="text-white/60 text-xs tracking-[2px] mt-4 font-medium">SCROLL TO EXPLORE</span>
      </motion.div>
    </div>
  );
};

export default Hero;