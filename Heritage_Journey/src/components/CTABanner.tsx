
import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

const CTABanner = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Nepal Landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-purple/90 to-heritage-pink/80"></div>
      </div>
      
      <div className="container-custom relative z-10 text-white text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
          Ready to Embark on Your Nepal Adventure?
        </h2>
        <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Let us help you create memories that will last a lifetime with our expertly crafted travel experiences.
        </p>
        <Link 
          to="/contact"
          className="bg-white text-heritage-purple hover:bg-heritage-orange hover:text-white font-bold px-8 py-4 rounded-lg transition-colors inline-flex items-center text-lg"
        >
          Start Planning Now
          <Plane className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
};

export default CTABanner;
