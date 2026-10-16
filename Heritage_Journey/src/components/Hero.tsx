import { ArrowRight, ArrowUpRight, Calendar, Search, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import Navbar from './Navbar';
import BookingModal from './BookingModal';

/* ── DESIGN TOKENS ───────────────────────────────────
   Night-indigo sky, cool snow white, saffron action colour, prayer-flag red accent. */
const C = {
  ink: '#0c1626',
  snow: '#f3f6f9',
  saffron: '#f5a81c',
  flagRed: '#d63a32',
};

/* ── FONTS ───────────────────────────────────────────
   Outfit: clean geometric sans for the headline, card title and numerals.
   Hind: designed for Devanagari + Latin, used for body text. */
const HEADING_FONT = "'Outfit', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT = "'Hind', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* Pulled from tours.ts — hrefs use ?tour=<id> so Tours.tsx opens that
   tour's detail overlay directly instead of just landing on the grid */
const trendingTours = [
  { name: 'Nepal Highlights: Kathmandu, Chitwan & Pokhara', days: 8, tag: 'Best of Nepal', href: '/tours?tour=9' },
  { name: 'Odyssey in Himalayas: Heritage, Wildlife, Lakes & Himalayan Trails', days: 12, tag: 'Signature odyssey', href: '/tours?tour=12' },
  { name: 'Kathmandu Valley Heritage Tour', days: 4, tag: 'Best introduction', href: '/tours?tour=3' },
];

const Hero = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/tours');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* One orchestrated entrance: everything rises in sequence, once. */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  };
  const item = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
      };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Hind:wght@400;500;600&display=swap');
      `}</style>

      <Navbar onBookNow={openModal} />

      <div
        className="relative min-h-screen w-full overflow-hidden flex flex-col"
        style={{ fontFamily: BODY_FONT, backgroundColor: C.ink }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
            style={{
              transform: `translateY(${-scrollPosition * 0.04}px)`,
              filter: 'brightness(0.95) contrast(1.06) saturate(0.95)',
            }}
          >
            <source src="background.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Night-indigo overlay — deepest on the left where the text sits */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to right, rgba(12,22,38,0.88), rgba(12,22,38,0.5) 55%, rgba(12,22,38,0.2))' }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to top, rgba(12,22,38,0.7), transparent 45%, rgba(12,22,38,0.25))' }}
        />

        {/* Content */}
        <div className="relative z-20 flex-1 flex items-center pt-36 sm:pt-40 lg:pt-32 pb-16">
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center"
            >
              {/* ── LEFT: text block ─────────────────── */}
              <div className="text-left">
                <motion.p
                  variants={item}
                  className="text-[15px] font-medium mb-5"
                  style={{ color: C.snow }}
                >
                  Heritage journeys in Nepal
                </motion.p>

                <motion.h1
                  variants={item}
                  style={{
                    fontFamily: HEADING_FONT,
                    fontSize: 'clamp(2.8rem, 6.6vw, 5.4rem)',
                    fontWeight: 600,
                    lineHeight: 1.04,
                    letterSpacing: '-0.03em',
                    color: C.snow,
                    textShadow: '0 2px 24px rgba(12,22,38,0.5)',
                  }}
                  className="mb-7"
                >
                  Embark on a <br />
                  Journey of <br />
                  Discovery
                </motion.h1>

                <motion.p
                  variants={item}
                  className="text-[17px] sm:text-lg max-w-md leading-relaxed mb-8"
                  style={{ color: 'rgba(243,246,249,0.86)' }}
                >
                  Discover the soul of Nepal — from towering Himalayas and sacred temples to vibrant cultures and legendary hospitality.
                </motion.p>

                {/* Compact search */}
                <motion.form
                  variants={item}
                  onSubmit={handleSearch}
                  role="search"
                  className="relative max-w-md mb-5"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} aria-hidden="true" />
                  <input
                    type="text"
                    aria-label="Search tours"
                    placeholder="Search tours"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-11 pr-32 rounded-lg text-base border-0 placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a81c]"
                    style={{ backgroundColor: C.snow, color: C.ink }}
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-md font-semibold text-[15px] transition-colors hover:bg-[#ffb92e] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    style={{ backgroundColor: C.saffron, color: C.ink }}
                  >
                    Search
                  </button>
                </motion.form>

                {/* CTA Buttons */}
                <motion.div variants={item} className="flex flex-wrap gap-3 sm:gap-4 mb-10">
                  <Link
                    to="/destinations"
                    className="group px-6 sm:px-7 h-14 rounded-lg font-semibold text-[15px] sm:text-base flex items-center justify-center gap-2 border-2 border-white/70 text-white hover:bg-white hover:text-[#0c1626] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a81c]"
                  >
                    Discover Destinations
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>

                  <motion.button
                    onClick={openModal}
                    whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    className="px-6 sm:px-7 h-14 rounded-lg font-semibold text-[15px] sm:text-base flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-[#ffb92e] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    style={{ backgroundColor: C.saffron, color: C.ink }}
                  >
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    Book Now
                  </motion.button>
                </motion.div>

                {/* Trust strip */}
                <motion.div
                  variants={item}
                  className="flex flex-wrap items-center gap-y-3 text-[14px] sm:text-[15px]"
                  style={{ color: 'rgba(243,246,249,0.8)' }}
                >
                  <span className="pr-5">15+ years guiding Nepal</span>
                  <span className="sm:pl-5 sm:border-l border-white/25">Locally owned and operated</span>
                </motion.div>
              </div>

              {/* ── RIGHT: trending-tours card ── */}
              <motion.div variants={item} className="hidden lg:block">
                {/* drop-shadow on the wrapper so the cut corner keeps its shadow */}
                <div style={{ filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.4))' }}>
                  <div
                    className="p-6 pb-5"
                    style={{
                      backgroundColor: C.snow,
                      color: C.ink,
                      clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%)',
                    }}
                  >
                    <h3
                      style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.02em' }}
                      className="text-[1.9rem] font-semibold leading-none mb-4"
                    >
                      Trending tours
                    </h3>

                    <div className="flex flex-col">
                      {trendingTours.map((tour) => (
                        <Link
                          key={tour.name}
                          to={tour.href}
                          className="group grid grid-cols-[3.4rem_1fr_auto] items-center gap-3 px-2 py-3.5 border-t first:border-t-0 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d63a32]"
                          style={{ borderColor: 'rgba(12,22,38,0.14)' }}
                        >
                          <div
                            className="text-center leading-none"
                            style={{ fontFamily: HEADING_FONT, color: C.flagRed }}
                          >
                            <span className="block text-[2.4rem] font-semibold">{tour.days}</span>
                            <span className="block text-[12px] font-medium mt-1" style={{ fontFamily: BODY_FONT, color: 'rgba(12,22,38,0.6)' }}>
                              days
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-[15px] leading-snug">{tour.name}</div>
                            <div className="text-[13px] mt-0.5" style={{ color: 'rgba(12,22,38,0.62)' }}>{tour.tag}</div>
                          </div>
                          <ArrowUpRight
                            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            style={{ color: C.flagRed }}
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>

                    <Link
                      to="/tours"
                      className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold no-underline hover:text-[#d63a32] transition-colors"
                    >
                      View all tours <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollPosition < 100 ? 1 : 0 }}
          className="relative z-20 pb-8 flex flex-col items-center"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
          <span className="text-[13px] mt-3 font-medium" style={{ color: 'rgba(243,246,249,0.65)' }}>
            Scroll to explore
          </span>
        </motion.div>
      </div>

      {/* ── STRATEGIC PARTNERSHIP ───────────────────────── */}
      <section
        aria-labelledby="partnership-heading"
        style={{ backgroundColor: C.snow, color: C.ink, fontFamily: BODY_FONT }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
            {/* LEFT: heading, set like the hero headline */}
            <div>
              <h2
                id="partnership-heading"
                style={{
                  fontFamily: HEADING_FONT,
                  fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                }}
                className="mb-5"
              >
                Strategic <br />
                Partnership
              </h2>
              <p
                className="text-[17px] sm:text-lg leading-snug"
                style={{ color: 'rgba(12,22,38,0.65)' }}
              >
                Heritage Nepal Journey &amp; Distinct Destinations
              </p>

              {/* Partner logos — replace the src paths with your files in /public/logos */}
              <div className="flex items-center gap-8 mt-8">
                <img
                  src="/public/logo.png"
                  alt="Heritage Nepal Journey"
                  className="h-14 sm:h-16 w-auto object-contain"
                />
                <img
                  src="/public/images/hero_section/DD- color logo.svg"
                  alt="Distinct Destinations"
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
            </div>

            {/* RIGHT: copy */}
            <div className="max-w-2xl">
              <p
                className="text-[17px] sm:text-lg leading-relaxed mb-5"
                style={{ color: 'rgba(12,22,38,0.85)' }}
              >
                Distinct Destinations Private Limited is our strategic business partner in Nepal,
                with their dedicated joint setup managing and delivering its business in the
                country. Our dedicated team, experienced tour managers and exclusive on-ground
                operations ensure consistent quality, seamless coordination and personalised,
                high-quality travel services.
              </p>
              <p
                className="text-[17px] sm:text-lg leading-relaxed"
                style={{ color: 'rgba(12,22,38,0.85)' }}
              >
                Heritage Nepal Journey and Distinct Destinations share a common vision and
                commitment to exceptional customer service, attention to detail and creating truly
                immersive, experiential travel experiences. Together, we combine local expertise
                with international service standards to deliver seamless, authentic and memorable
                journeys for every traveller.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Hero;