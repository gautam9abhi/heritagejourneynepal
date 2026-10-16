import { useEffect } from 'react';
import Layout from '@/components/Layout';
import Gallery from '@/components/Gallery';
import { motion, useReducedMotion } from 'framer-motion';

/* ── DESIGN TOKENS (shared with Hero.tsx) ─────────── */
const C = {
  ink: '#0c1626',
  snow: '#f3f6f9',
  saffron: '#f5a81c',
  flagRed: '#d63a32',
};

/* Outfit for headings, Hind for body — same pairing as the home hero */
const HEADING_FONT = "'Outfit', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT = "'Hind', system-ui, -apple-system, 'Segoe UI', sans-serif";

const stats = [
  { num: '15+', label: 'Destinations' },
  { num: '200+', label: 'Photos' },
  { num: '8+', label: 'Years' },
  { num: '500+', label: 'Travellers' },
];

const GalleryPage = () => {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const item = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
      };

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Hind:wght@400;500;600&display=swap');
      `}</style>

      {/* ── HERO — full screen, centered copy, stats strip at the base ── */}
      <div
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ fontFamily: BODY_FONT, backgroundColor: C.ink }}
      >
        {/* Background Image */}
        <img
          src="/images/hero_section/gallery.jpg"
          alt="Nepal Gallery"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 animate-[slow-pan_30s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
          style={{ transformOrigin: 'center center', filter: 'brightness(0.95) contrast(1.06) saturate(0.95)' }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(12,22,38,0.45), rgba(12,22,38,0.75))' }}
        />

        {/* Center content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28"
        >
          <motion.p
            variants={item}
            className="text-[15px] font-medium mb-4"
            style={{ color: 'rgba(243,246,249,0.8)' }}
          >
            Our Visual Stories
          </motion.p>

          <motion.h1
            variants={item}
            className="mb-5"
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 'clamp(3.2rem, 9vw, 7rem)',
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: C.snow,
              textShadow: '0 2px 24px rgba(12,22,38,0.5)',
            }}
          >
            Gallery
          </motion.h1>

          <motion.p
            variants={item}
            className="text-[17px] md:text-lg max-w-xl leading-relaxed mb-10"
            style={{ color: 'rgba(243,246,249,0.86)' }}
          >
            Breathtaking moments from across Nepal
          </motion.p>

          <motion.a
            variants={item}
            href="#gallery"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-lg font-semibold text-base no-underline transition-colors duration-200 hover:bg-[#ffb92e] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ backgroundColor: C.saffron, color: C.ink, textDecoration: 'none' }}
          >
            Explore Photos
            <span aria-hidden="true">→</span>
          </motion.a>
        </motion.div>

        {/* Stats strip — locked to the bottom of the hero */}
        <div
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          {stats.map(({ num, label }) => (
            <div key={label} className="text-center py-5 px-3" style={{ backgroundColor: C.ink }}>
              <div
                className="text-2xl font-semibold leading-none mb-1.5"
                style={{ fontFamily: HEADING_FONT, color: C.snow, letterSpacing: '-0.01em' }}
              >
                {num}
              </div>
              <div className="text-[13px]" style={{ color: 'rgba(243,246,249,0.65)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-8 md:px-16 py-4 flex items-center justify-between border-b"
        style={{ backgroundColor: '#ffffff', borderColor: 'rgba(12,22,38,0.1)', fontFamily: BODY_FONT }}
      >
        <span className="text-[15px] font-semibold" style={{ color: C.ink }}>
          Browse the collection
        </span>
        <span className="text-sm" style={{ color: 'rgba(12,22,38,0.55)' }}>
          Scroll down to explore all photos
        </span>
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="bg-white min-h-screen">
        <Gallery />
      </div>
    </Layout>
  );
};

export default GalleryPage;