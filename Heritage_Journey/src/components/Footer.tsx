import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { SiFacebook, SiInstagram } from 'react-icons/si';

/* Same fonts as Hero: Outfit for headings, Hind for body text */
const HEADING_FONT = "'Outfit', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT = "'Hind', system-ui, -apple-system, 'Segoe UI', sans-serif";

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Hind:wght@400;500;600&display=swap');
      `}</style>

      <footer className="bg-[#0a0a0a] text-white pt-16 pb-8" style={{ fontFamily: BODY_FONT }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-block mb-6">
                <h2
                  className="text-3xl font-bold tracking-tight text-white"
                  style={{ fontFamily: HEADING_FONT }}
                >
                  Heritage Journey Nepal
                </h2>
              </Link>
              <p className="text-white/70 leading-relaxed mb-8 max-w-xs">
                Crafting unforgettable journeys through the heart of the Himalayas.
                Experience Nepal's rich heritage and natural beauty with us.
              </p>

              <div className="flex space-x-4">
                <a href="https://www.facebook.com/travelnepalwithheritagejourney/" target="_blank" rel="noopener noreferrer"
                   className="bg-white/10 hover:bg-heritage-pink p-3 rounded-xl transition-all duration-300">
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/heritage_journey_nepal/" target="_blank" rel="noopener noreferrer"
                   className="bg-white/10 hover:bg-heritage-pink p-3 rounded-xl transition-all duration-300">
                  <SiInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white" style={{ fontFamily: HEADING_FONT }}>Quick Links</h3>
              <ul className="space-y-3 text-white/70">
                <li><Link to="/destinations" className="hover:text-heritage-pink transition-colors">Destinations</Link></li>
                <li><Link to="/trekking" className="hover:text-heritage-pink transition-colors">Trekking Adventures</Link></li>
                <li><Link to="/mice-tours" className="hover:text-heritage-pink transition-colors">MICE Tours</Link></li>
                <li><Link to="/gallery" className="hover:text-heritage-pink transition-colors">Gallery</Link></li>
                <li><Link to="/about" className="hover:text-heritage-pink transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-heritage-pink transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact Info + Foreign Exchange Rate */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white" style={{ fontFamily: HEADING_FONT }}>Get In Touch</h3>
              <ul className="space-y-5 text-white/70 mb-10">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 text-heritage-pink mt-0.5 flex-shrink-0" />
                  <span>City Office, Amrit Marg, Thamel, Kathmandu 44600</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 text-heritage-pink mt-0.5 flex-shrink-0" />
                  <a href="tel:+9779851120262" className="hover:text-white transition-colors">
                    +977 985-1120262
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 text-heritage-pink mt-0.5 flex-shrink-0" />
                  <a href="mailto:info@heritagejourneynepal.com" className="hover:text-white transition-colors">
                    info@heritagejourneynepal.com
                  </a>
                </li>
              </ul>

              {/* Foreign Exchange Rate Box - Below Contact Us */}
              <div>
                <h4 className="font-medium text-white mb-3" style={{ fontFamily: HEADING_FONT }}>Foreign Exchange Rate</h4>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <a
                    href="https://www.nimb.com.np/digital-banking/forex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-heritage-pink transition-colors"
                  >
                    Check Live NIMB Bank Exchange Rates →
                  </a>
                  <p className="text-xs text-white/50 mt-3">
                    Updated daily by Nepal Rastra Bank
                  </p>
                </div>
              </div>
            </div>

            {/* Map + We Accept */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white" style={{ fontFamily: HEADING_FONT }}>Visit Our Office</h3>

              {/* Google Map */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1454264336394!2d85.31240655130317!3d27.712795820752408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b0a9e9f06f%3A0x2cec8203b20ab035!2sHeritage%20Journey%20Nepal%20Travels!5e0!3m2!1sen!2snp!4v1744804097677!5m2!1sen!2snp"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Heritage Journey Nepal Travels Location"
                ></iframe>
                <div className="p-4 text-xs text-white/60 bg-black/30">
                  Amrit Marg, Thamel, Kathmandu
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4 text-white" style={{ fontFamily: HEADING_FONT }}>We Accept</h3>
              <div className="flex flex-wrap gap-4">
                {/* Visa Logo */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/250px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png"
                  alt="Visa"
                  className="h-9 bg-white p-1.5 rounded"
                />

                {/* Mastercard Logo */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/250px-Mastercard_2019_logo.svg.png"
                  alt="Mastercard"
                  className="h-9 bg-white p-1.5 rounded"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16">
          <div className="container-custom py-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
            <p>© {new Date().getFullYear()} Heritage Journey Nepal. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;