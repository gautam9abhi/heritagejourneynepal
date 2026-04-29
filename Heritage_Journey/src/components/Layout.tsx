import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppChat from './WhatsAppChat';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppChat />  
    </div>
  );
};

export default Layout;
