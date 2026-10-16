import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { type Database } from '@/integrations/supabase/types';
import Layout from '@/components/Layout';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

type PageContent = Database['public']['Tables']['pages']['Row'];

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
  { num: '15+', label: 'Years of experience' },
  { num: '800+', label: 'Happy travellers' },
  { num: '15+', label: 'Destinations' },
  { num: '100%', label: 'Local expertise' },
];

const strengths = [
  {
    title: 'Local knowledge and expertise',
    text: 'Our extensive knowledge and expertise about the destination, which can help you to make the most of your trip.',
  },
  {
    title: 'Customized itineraries',
    text: 'We create customized itineraries tailored to the specific interests and preferences of yours with a more personalized and enjoyable travel experience.',
  },
  {
    title: 'Convenience',
    text: 'We help to simplify the process by handling all the logistics, such as booking flights, accommodations, transportation, and tours.',
  },
  {
    title: 'Safety and security',
    text: 'We help to ensure that travelers stay safe and secure during the trip by providing guidance on local safety measures, precautions, and emergency contacts.',
  },
];

const AboutUs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetchPageContent();
  }, []);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0); // Scroll to top after loading is complete
    }
  }, [loading]);

  const fetchPageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_type', 'about')
        .eq('published', true)
        .single();

      if (error) throw error;
      if (!data) {
        navigate('/');
        return;
      }

      setPageContent(data);
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
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

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-label="Loading">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: C.flagRed }} />
        </div>
      </Layout>
    );
  }

  if (!pageContent) return null;

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Hind:wght@400;500;600&display=swap');

        /* Headings inside the CMS-written content follow the site type system */
        .about-rich h1, .about-rich h2, .about-rich h3, .about-rich h4 {
          font-family: ${HEADING_FONT};
          color: ${C.ink};
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }
        .about-rich p, .about-rich li { color: rgba(12,22,38,0.8); }
        .about-rich a { color: ${C.flagRed}; text-decoration-color: ${C.saffron}; text-underline-offset: 3px; }
        .about-rich strong { color: ${C.ink}; }
      `}</style>

      {/* ── HERO — full screen, centered copy, stats strip at the base ── */}
      <div
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ fontFamily: BODY_FONT, backgroundColor: C.ink }}
      >
        {/* Background Image */}
        <img
          src="/images/hero_section/about_us.jpg"
          alt="About Heritage Journey Nepal"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 animate-[slow-pan_30s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
          style={{ transformOrigin: 'center center', filter: 'brightness(0.95) contrast(1.06) saturate(0.95)' }}
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
            Our Story
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
            About Us
          </motion.h1>

          <motion.p
            variants={item}
            className="text-[17px] md:text-lg max-w-xl leading-relaxed mb-10"
            style={{ color: 'rgba(243,246,249,0.86)' }}
          >
            Discover the essence of Heritage Journey Nepal, where passion meets expertise
          </motion.p>

          <motion.a
            variants={item}
            href="#about-content"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-lg font-semibold text-base transition-colors duration-200 hover:bg-[#ffb92e] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ backgroundColor: C.saffron, color: C.ink }}
          >
            Learn Our Story
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
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
          Who we are
        </span>
        <span className="text-sm" style={{ color: 'rgba(12,22,38,0.55)' }}>
          Scroll down to learn more about us
        </span>
      </div>

      {/* ── CONTENT ────────────────────────────────── */}
      <section
        id="about-content"
        className="py-16 md:py-20"
        style={{ backgroundColor: C.snow, fontFamily: BODY_FONT, color: C.ink }}
      >
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <div className="page-content quill-content about-rich">
              <div dangerouslySetInnerHTML={{ __html: pageContent.content || '' }} />

              {/* not-prose keeps the typography plugin from restyling the cards */}
              <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
                {strengths.map(({ title, text }) => (
                  <div
                    key={title}
                    className="p-6 md:p-7 rounded-lg bg-white border"
                    style={{ borderColor: 'rgba(12,22,38,0.1)' }}
                  >
                    <h3
                      className="text-[1.35rem] font-semibold mb-2"
                      style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.02em', lineHeight: 1.2, color: C.ink }}
                    >
                      {title}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: 'rgba(12,22,38,0.7)' }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;