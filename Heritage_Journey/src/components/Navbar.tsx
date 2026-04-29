import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';   // ← Added this

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Trekking', path: '/trekking' },
    { name: 'MICE', path: '/mice-tours' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSc71C6J6pFkLcYmP4uuEo9sHXglwK4WiTj_WOvAW32qx4vQYQ/viewform?usp=dialog";

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-2'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-heritage-pink via-heritage-purple to-heritage-orange transition-all duration-300"
        style={{ width: `${scrollProgress}%`, opacity: isScrolled ? 1 : 0 }}
      ></div>
      
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="z-50 flex items-center gap-2 sm:gap-4 px-2 sm:px-5 py-2.5 -ml-2 sm:-ml-6 transition-all duration-300"
        >
          <img 
            src="/logo.png" 
            alt="Heritage Journey Nepal" 
            className="h-10 sm:h-20 w-auto"
          />
          <h1 className={`text-lg sm:text-2xl font-bold whitespace-nowrap transition-colors ${
            isScrolled ? 'text-heritage-brown' : 'text-white'
          }`}>
            <span className="xs:hidden">HJN</span>
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center pl-24">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link 
                to={link.path} 
                className={`text-base font-medium transition-colors ${
                  isScrolled ? 'text-heritage-brown hover:text-heritage-pink' : 'text-white hover:text-heritage-pink'
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-heritage-pink group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          ))}

          {/* Book Now Button - Added Here */}
          <motion.a
            href={googleFormLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#FDFBD4] hover:bg-[#7f1f1f] text-black font-semibold px-7 py-2.5 rounded-2xl text-sm transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2"
          >
            Book here!
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`lg:hidden z-50 transition-colors ${
            isScrolled ? 'text-heritage-brown' : 'text-white'
          }`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`
        fixed inset-0 bg-white/95 backdrop-blur-lg z-40 transition-transform duration-300 lg:hidden
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full mt-24 px-8 pb-8 overflow-y-auto">
          {navLinks.map((link, index) => (
            <Link 
              key={link.name}
              to={link.path} 
              className="py-4 text-xl font-medium text-heritage-brown hover:text-heritage-pink border-b border-gray-100"
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}

          {/* Book Now in Mobile Menu */}
          <a
            href={googleFormLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mt-8 bg-[#FDFBD4] text-black font-semibold py-4 px-8 rounded-2xl text-center text-lg flex items-center justify-center gap-3"
          >
             Book Here!
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;