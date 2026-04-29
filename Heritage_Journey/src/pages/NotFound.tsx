
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found | Heritage Journey Nepal';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-heritage-purple/5 to-heritage-pink/5 px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-8xl font-bold text-heritage-pink mb-6">404</h1>
        <h2 className="text-3xl font-bold text-heritage-brown mb-4">Page Not Found</h2>
        <p className="text-heritage-brown/70 mb-8 text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.history.back()}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <Home className="h-5 w-5" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
