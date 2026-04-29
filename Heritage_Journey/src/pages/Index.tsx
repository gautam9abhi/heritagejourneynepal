
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import AboutNepal from '@/components/AboutNepal';
import PopularDestinations from '@/components/PopularDestinations';
import CTABanner from '@/components/CTABanner';
import Newsletter from '@/components/Newsletter';
import DestinationHighlight from '@/components/DestinationHighlight';
import Gallery from '@/components/Gallery';
import FacesOfNepal from '@/components/FacesOfNepal';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <Hero />
      <FacesOfNepal />
      <AboutNepal />
      <DestinationHighlight />
      <PopularDestinations />
      <Gallery limit={6} />
      <div className="text-center mt-6">
        <Link to="/gallery" className="btn-primary">View All Gallery</Link>
      </div><br></br><br></br>
      <CTABanner />
      <Newsletter />
    </Layout>
  );
};

export default Index;
