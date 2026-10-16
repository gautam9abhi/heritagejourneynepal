import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { motion, useReducedMotion } from 'framer-motion';

interface Destination {
  id: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  slug: string;
  featured_image_url: string | null;
  created_at: string;
  updated_at: string | null;
  created_by: string;
  published: boolean;
}

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

const regions = [
  { name: 'Nepal', label: 'Himalayan Kingdom' },
  { name: 'Bhutan', label: 'Land of the Thunder Dragon' },
  { name: 'Tibet', label: 'Roof of the World' },
  { name: '100%', label: 'Curated Experiences' },
];

const Destinations = () => {
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* ── HERO — full screen ─────────────────────── */}
      <div
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ fontFamily: BODY_FONT, backgroundColor: C.ink }}
      >
        {/* Background Video */}
        <video
          src="/images/hero_section/destination.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.95) contrast(1.06) saturate(0.95)' }}
        />

        {/* Night-indigo overlay */}
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
            Explore Nepal &amp; Beyond
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
            Destinations
          </motion.h1>

          <motion.p
            variants={item}
            className="text-[17px] md:text-lg max-w-xl leading-relaxed mb-10"
            style={{ color: 'rgba(243,246,249,0.86)' }}
          >
            From the majestic Himalayas, uncover the world's most breathtaking destinations
          </motion.p>

          <motion.a
            variants={item}
            href="#destinations-grid"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-lg font-semibold text-base no-underline transition-colors duration-200 hover:bg-[#ffb92e] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ backgroundColor: C.saffron, color: C.ink, textDecoration: 'none' }}
          >
            Explore Destinations
            <span aria-hidden="true">→</span>
          </motion.a>
        </motion.div>

        {/* Regions strip — locked to the bottom of the hero */}
        <div
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          {regions.map(({ name, label }) => (
            <div
              key={label}
              className="text-center py-5 px-3"
              style={{ backgroundColor: C.ink }}
            >
              <div
                className="text-2xl font-semibold leading-none mb-1.5"
                style={{ fontFamily: HEADING_FONT, color: C.snow, letterSpacing: '-0.01em' }}
              >
                {name}
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
          Where to next
        </span>
        <span className="text-sm" style={{ color: 'rgba(12,22,38,0.55)' }}>
          Scroll down to explore destinations
        </span>
      </div>

      {/* ── BODY — destination list ─────────────────── */}
      <section
        id="destinations-grid"
        className="py-16 md:py-24"
        style={{ backgroundColor: C.snow, fontFamily: BODY_FONT, color: C.ink }}
      >
        <div className="container-custom max-w-7xl">

          {/* Intro */}
          <div className="max-w-2xl mb-14">
            <h2
              className="mb-5"
              style={{
                fontFamily: HEADING_FONT,
                fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
              }}
            >
              Every place, a world of its own
            </h2>
            <p className="leading-relaxed text-[17px]" style={{ color: 'rgba(12,22,38,0.72)' }}>
              From the high Himalaya to the valleys and kingdoms beyond, each destination below is
              curated by our team on the ground. Scroll through to find where your next journey begins.
            </p>
          </div>

          {/* Destination list */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]" role="status" aria-label="Loading destinations">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: C.flagRed }}
              />
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              className="space-y-8"
            >
              {destinations.map((destination, idx) => {
                const reversed = idx % 2 === 1;
                return (
                  <motion.div key={destination.id} variants={item}>
                    <Link
                      to={`/destinations/${destination.slug}`}
                      className="group grid grid-cols-1 md:grid-cols-5 bg-white rounded-lg overflow-hidden border no-underline transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d63a32]"
                      style={{ borderColor: 'rgba(12,22,38,0.1)', textDecoration: 'none' }}
                    >
                      {/* Image */}
                      <div
                        className={`relative md:col-span-2 aspect-[4/3] md:aspect-auto overflow-hidden ${
                          reversed ? 'md:order-2' : ''
                        }`}
                      >
                        {destination.featured_image_url ? (
                          <img
                            src={destination.featured_image_url}
                            alt={destination.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(12,22,38,0.06)' }}
                          >
                            <span className="text-2xl" style={{ color: 'rgba(12,22,38,0.35)' }}>No image</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className={`md:col-span-3 p-7 md:p-10 flex flex-col justify-center ${reversed ? 'md:order-1' : ''}`}>
                        <h3
                          className="mb-2 transition-colors duration-300 group-hover:text-[#d63a32]"
                          style={{
                            fontFamily: HEADING_FONT,
                            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                            fontWeight: 600,
                            lineHeight: 1.15,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {destination.title}
                        </h3>
                        {destination.subtitle && (
                          <p className="text-base mb-6" style={{ color: 'rgba(12,22,38,0.62)' }}>
                            {destination.subtitle}
                          </p>
                        )}

                        <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold w-fit">
                          Explore destination
                          <span
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {destinations.length === 0 && (
                <div className="text-center py-20">
                  <p style={{ color: 'rgba(12,22,38,0.6)' }}>No destinations published yet — check back soon.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Destinations;