
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-72 sm:w-80 animate-fade-in">
          <div className="bg-[#25D366] text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-bold text-lg">Heritage Journey Nepal</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 bg-[#E5DDD5] h-72">
            <div className="bg-white rounded-lg p-3 mb-3 max-w-[80%] shadow-sm">
              <p className="text-sm mb-1">Hello! 👋</p>
              <p className="text-sm">How can we help you plan your journey to Nepal?</p>
              <span className="text-[10px] text-gray-500 block text-right mt-1">10:30 AM</span>
            </div>
          </div>
          
          <div className="p-3 border-t border-gray-200">
            <a 
              href="https://wa.me/+9779851020177?text=Hi%20Heritage%20Journey%20Nepal%2C%20I%27m%20interested%20in%20planning%20a%20trip%20to%20Nepal." 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white w-full py-2 rounded flex justify-center items-center transition-colors"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Continue to WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors animate-bounce"
          aria-label="Open WhatsApp chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default WhatsAppChat;
