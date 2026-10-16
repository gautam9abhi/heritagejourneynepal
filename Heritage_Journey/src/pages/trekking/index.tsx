import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { motion, useReducedMotion } from 'framer-motion';

interface Trek {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  duration: string | null;
  difficulty: string | null;
  max_altitude: string | null;
  featured_image_url: string | null;
}

// Hardcoded trek data
const treks: Trek[] = [
  {
    id: '1',
    title: 'Annapurna Base Camp Trek',
    slug: 'annapurna-base-camp',
    subtitle: 'Into the Shadow of Giants',
    duration: '12-14 Days',
    difficulty: 'Moderate',
    max_altitude: '4,130m',
    featured_image_url: '/images/trekking/abc/annapurna-base-camp.jpg',
  },
  {
    id: '2',
    title: 'Round Annapurna Trek',
    slug: 'round-annapurna-trek',
    subtitle: 'A Journey Around the Annapurna Range',
    duration: '14-16 Days',
    difficulty: 'Challenging',
    max_altitude: '5,416m',
    featured_image_url: '/images/trekking/circuit/thorangla-1.jpg',
  },
  {
    id: '3',
    title: 'Everest Base Camp Trek',
    slug: 'everest-base-camp-trek',
    subtitle: 'Trekking to the Roof of the World',
    duration: '12-14 Days',
    difficulty: 'Strenuous',
    max_altitude: '5,364m',
    featured_image_url: '/images/trekking/ebc/everest-1.jpg',
  },
  {
    id: '4',
    title: 'Langtang Himal Trek',
    slug: 'langtang-himal-trek',
    subtitle: 'Explore the Hidden Valley',
    duration: '10-12 Days',
    difficulty: 'Moderate',
    max_altitude: '4,984m',
    featured_image_url: '/images/trekking/langtang/langtang-3.jpg',
  },
  {
    id: '5',
    title: 'Upper Mustang Trek',
    slug: 'upper-mustang',
    subtitle: 'A Journey to the Forbidden Kingdom',
    duration: '14-16 Days',
    difficulty: 'Challenging',
    max_altitude: '4,500m',
    featured_image_url: '/images/trekking/upper/upper-3.jpg',
  },
  {
    id: '6',
    title: 'Short Duration Treks from Pokhara',
    slug: 'short-duration-treks',
    subtitle: 'Explore the Himalayas on Quick Adventures',
    duration: '2-7 Days',
    difficulty: 'Easy to Moderate',
    max_altitude: '3,660m',
    featured_image_url: '/images/trekking/pokhara/pokhara-short-trek.jpg',
  },
  {
    id: '7',
    title: 'Manaslu Circuit Trek',
    slug: 'manaslu-circuit-trek',
    subtitle: 'In the Shadow of the Spirit Mountain',
    duration: '14-16 Days',
    difficulty: 'Challenging',
    max_altitude: '5,106m',
    featured_image_url: '/images/trekking/manaslu/manaslu-1.jpg',
  },
];

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

/* Difficulty colour carries real information (green / amber / red),
   so it is used on the label dot and the altitude bars. */
const difficultyAccent = (difficulty: string | null) => {
  if (!difficulty) return 'rgba(12,22,38,0.35)';
  const d = difficulty.toLowerCase();
  if (d === 'easy') return '#2f8f5b';
  if (d === 'easy to moderate' || d.includes('moderate')) return '#d98e0b';
  return C.flagRed; // challenging / strenuous
};

const parseAltitude = (alt: string | null) => {
  if (!alt) return 0;
  return parseInt(alt.replace(/[^0-9]/g, ''), 10) || 0;
};

const filterOptions = ['All', 'Easy', 'Moderate', 'Challenging', 'Strenuous'];

const stats = [
  { num: '7+', label: 'Trek routes' },
  { num: '5,416m', label: 'Highest pass' },
  { num: '500+', label: 'Trekkers guided' },
  { num: '100%', label: 'Licensed guides' },
];

const TrekkingPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredAlt, setHoveredAlt] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredTreks = treks.filter((t) => {
    if (activeFilter === 'All') return true;
    return (t.difficulty || '').toLowerCase().includes(activeFilter.toLowerCase());
  });

  const sortedByAltitude = [...treks].sort((a, b) => parseAltitude(b.max_altitude) - parseAltitude(a.max_altitude));
  const maxAlt = parseAltitude(sortedByAltitude[0]?.max_altitude || '0');

  const scrollToCard = (id: string) => {
    cardRefs.current[id]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
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

      {/* ── HERO — full screen, centered copy, stats strip at the base ── */}
      <div
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ fontFamily: BODY_FONT, backgroundColor: C.ink }}
      >
        <video
          src="/images/hero_section/trekking.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transform scale-105 animate-[slow-pan_30s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
          style={{ transformOrigin: 'center center', filter: 'brightness(0.95) contrast(1.06) saturate(0.95)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(12,22,38,0.45), rgba(12,22,38,0.75))' }}
        />

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
            Himalayan Trekking
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
            Trekking
          </motion.h1>

          <motion.p
            variants={item}
            className="text-[17px] md:text-lg max-w-xl leading-relaxed mb-10"
            style={{ color: 'rgba(243,246,249,0.86)' }}
          >
            Embark on a journey through the majestic Himalayas, where every step unveils breathtaking landscapes and rich cultural heritage
          </motion.p>

          <motion.a
            variants={item}
            href="#treks-content"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-lg font-semibold text-base no-underline transition-colors duration-200 hover:bg-[#ffb92e] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ backgroundColor: C.saffron, color: C.ink, textDecoration: 'none' }}
          >
            Explore Our Trails
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
          Choose your trail
        </span>
        <span className="text-sm" style={{ color: 'rgba(12,22,38,0.55)' }}>
          Scroll down to explore our routes
        </span>
      </div>

      {/* ── BODY ───────────────────────────────────── */}
      <section
        id="treks-content"
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
              Seven routes, one range of giants
            </h2>
            <p className="leading-relaxed text-[17px]" style={{ color: 'rgba(12,22,38,0.72)' }}>
              Every trek below is guided by our licensed, English-speaking team and built around
              acclimatization-first pacing. Filter by difficulty, compare routes by altitude, or
              simply scroll to find the trail that matches how you want to experience Nepal.
            </p>
          </div>

          {/* ── Altitude at a glance ── */}
          <div
            className="bg-white rounded-lg border p-6 md:p-8 mb-14"
            style={{ borderColor: 'rgba(12,22,38,0.1)' }}
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.02em' }}
                >
                  Altitude at a glance
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'rgba(12,22,38,0.55)' }}>
                Tap a trek to jump to its details.
              </p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
              {sortedByAltitude.map((t) => {
                const alt = parseAltitude(t.max_altitude);
                const pct = maxAlt ? Math.max((alt / maxAlt) * 100, 8) : 8;
                const isHovered = hoveredAlt === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => scrollToCard(t.id)}
                    onMouseEnter={() => setHoveredAlt(t.id)}
                    onMouseLeave={() => setHoveredAlt(null)}
                    onFocus={() => setHoveredAlt(t.id)}
                    onBlur={() => setHoveredAlt(null)}
                    className="flex flex-col items-center shrink-0 w-[120px] snap-start rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d63a32]"
                  >
                    <div
                      className="h-28 w-full flex items-end justify-center mb-3 border-b"
                      style={{ borderColor: 'rgba(12,22,38,0.35)' }}
                    >
                      <div
                        className="w-5 transition-colors duration-300"
                        style={{
                          height: pct + '%',
                          backgroundColor: isHovered ? C.ink : 'rgba(12,22,38,0.55)',
                        }}
                      />
                    </div>
                    <span className="text-[14px] font-medium mb-0.5">
                      {t.max_altitude}
                    </span>
                    <span
                      className="text-[13px] text-center leading-snug"
                      style={{ color: 'rgba(12,22,38,0.65)' }}
                    >
                      {t.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter treks by difficulty">
            {filterOptions.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  aria-pressed={active}
                  className="px-5 h-11 rounded-lg text-[15px] font-semibold border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d63a32]"
                  style={
                    active
                      ? { backgroundColor: C.ink, color: C.snow, borderColor: C.ink }
                      : { backgroundColor: '#ffffff', color: 'rgba(12,22,38,0.75)', borderColor: 'rgba(12,22,38,0.18)' }
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Trek list */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="space-y-8"
          >
            {filteredTreks.map((trek, idx) => {
              const reversed = idx % 2 === 1;
              return (
                <motion.div
                  key={trek.id}
                  variants={item}
                  ref={(el) => {
                    cardRefs.current[trek.id] = el;
                  }}
                >
                  <Link
                    to={`/trekking/${trek.slug}`}
                    className="group grid grid-cols-1 md:grid-cols-5 bg-white rounded-lg overflow-hidden border no-underline transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d63a32]"
                    style={{ borderColor: 'rgba(12,22,38,0.1)', textDecoration: 'none' }}
                  >
                    {/* Image */}
                    <div
                      className={`relative md:col-span-2 aspect-[4/3] md:aspect-auto overflow-hidden ${
                        reversed ? 'md:order-2' : ''
                      }`}
                    >
                      {trek.featured_image_url ? (
                        <img
                          src={trek.featured_image_url}
                          alt={trek.title}
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
                      {trek.difficulty && (
                        <span
                          className="inline-flex items-center gap-2 w-fit mb-3 px-3 py-1 rounded-full border text-[13px] font-semibold"
                          style={{ borderColor: 'rgba(12,22,38,0.15)', backgroundColor: C.snow }}
                        >
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: difficultyAccent(trek.difficulty) }}
                            aria-hidden="true"
                          />
                          {trek.difficulty}
                        </span>
                      )}
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
                        {trek.title}
                      </h3>
                      {trek.subtitle && (
                        <p className="text-base mb-5" style={{ color: 'rgba(12,22,38,0.62)' }}>
                          {trek.subtitle}
                        </p>
                      )}

                      <p className="mb-6 text-sm" style={{ color: 'rgba(12,22,38,0.7)' }}>
                        {[trek.duration, trek.max_altitude ? `Up to ${trek.max_altitude}` : null]
                          .filter(Boolean)
                          .join('  ·  ')}
                      </p>

                      <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold w-fit">
                        View trek route
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

            {filteredTreks.length === 0 && (
              <div className="text-center py-20">
                <p style={{ color: 'rgba(12,22,38,0.6)' }}>No treks match this difficulty — try another filter.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <div
        className="px-6 md:px-10 py-16 md:py-24 text-center"
        style={{ backgroundColor: C.ink, color: C.snow, fontFamily: BODY_FONT }}
      >
        <h2
          className="mb-4"
          style={{
            fontFamily: HEADING_FONT,
            fontSize: 'clamp(2rem, 6vw, 3.4rem)',
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
          }}
        >
          Not sure which trail is right for you?
        </h2>
        <p className="text-[17px] md:text-lg max-w-lg mx-auto mb-9 leading-relaxed" style={{ color: 'rgba(243,246,249,0.8)' }}>
          Tell us your fitness level, available time, and what you want to see — our guides will
          recommend the perfect route.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-lg font-semibold text-base no-underline transition-colors duration-200 hover:bg-[#ffb92e] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ backgroundColor: C.saffron, color: C.ink, textDecoration: 'none' }}
        >
          Talk to a guide
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Layout>
  );
};

export default TrekkingPage;