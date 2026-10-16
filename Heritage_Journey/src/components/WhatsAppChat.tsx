import React, { useEffect, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WHATSAPP_NUMBER = '+9779851020177';
const PREFILLED_MESSAGE =
  "Hello Heritage Journey Nepal, I'd like to enquire about planning a trip to Nepal.";
const WA_FONT = "'Segoe UI', Helvetica, 'Helvetica Neue', Arial, sans-serif";

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  // Gentle one-time nudge instead of a permanent bounce loop
  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(
    PREFILLED_MESSAGE
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      {isOpen && (
        <div
          className="w-[320px] sm:w-[360px] rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/5 overflow-hidden animate-[fadeSlide_0.25s_ease-out]"
          role="dialog"
          aria-label="Chat with Heritage Journey Nepal"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-[#1F6B4C] to-[#144D37] px-5 pt-5 pb-6 text-white">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div
                  className="h-11 w-11 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-lg tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  HJ
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#25D366] ring-2 ring-[#1F6B4C]" />
              </div>
              <div>
                <p
                  className="text-[18px] leading-tight tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Heritage Journey Nepal
                </p>
                <p className="text-[12px] text-white/75 mt-0.5" style={{ fontFamily: WA_FONT }}>
                  Usually replies within an hour
                </p>
              </div>
            </div>
          </div>

          {/* Message thread */}
          <div className="px-4 pt-4 pb-2 bg-[#F7F5F0]">
            <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm" style={{ fontFamily: WA_FONT }}>
              <p className="text-[13.5px] leading-snug text-gray-800">
                Namaste! 🙏 How can we help you plan your journey to Nepal —
                treks, cultural tours, or a custom itinerary?
              </p>
              <span className="block text-right text-[10px] text-gray-400 mt-1">
                10:30 AM
              </span>
            </div>
          </div>

          {/* CTA footer */}
          <div className="px-4 pb-4 pt-2 bg-[#F7F5F0]" style={{ fontFamily: WA_FONT }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] hover:bg-[#1EBE5A] text-white text-sm font-medium py-2.5 shadow-sm transition-colors"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Continue on WhatsApp
            </a>
            <p className="text-center text-[10.5px] text-gray-400 mt-2">
              Opens in WhatsApp &middot; Heritage Journey Nepal
            </p>
          </div>
        </div>
      )}

      {/* Floating action button */}
      <div className="relative">
        {!isOpen && showGreeting && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white text-[13px] text-gray-700 px-3.5 py-2 rounded-full shadow-md ring-1 ring-black/5 animate-[fadeSlide_0.3s_ease-out]" style={{ fontFamily: WA_FONT }}>
            Need help planning your trip?
          </div>
        )}

        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
        )}

        <button
          onClick={() => {
            setIsOpen((v) => !v);
            setShowGreeting(false);
          }}
          className="relative h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5A] text-white shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-colors"
          aria-label={isOpen ? 'Close chat' : 'Open WhatsApp chat'}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppChat;