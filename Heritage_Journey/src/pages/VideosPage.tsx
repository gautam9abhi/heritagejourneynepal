import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ─────────────────────────────────────────────────────────────
// Edit this list to add, remove, or reorder videos.
// "src" paths point at the mp4 files already in your /public folder.
// Descriptions can run a few sentences — there's room for it here.
// ─────────────────────────────────────────────────────────────
const videos = [
  {
    id: 'trekking',
    title: 'Life on the Trail',
    src: '/images/hero_section/trekking.mp4',
    poster: '/images/hero_section/hero_section_backup.jpg',
    description:
      "A day among the Annapurna foothills — suspension bridges swaying underfoot, prayer flags catching the wind, and the quiet rhythm of walking with our guides. This is the pace of the trek itself: unhurried mornings, long views, and villages that appear right when you need a cup of tea. Every group moves differently, and our guides adjust the day around that, not the other way around.",
  },
  {
    id: 'destination',
    title: 'Nepal, End to End',
    src: '/images/hero_section/destination.mp4',
    poster: '/images/hero_section/hero_section.jpg',
    description:
      "From the temples of Kathmandu to the terraced hills of Pokhara — a glimpse of the landscapes waiting on every route we run. Nepal changes completely every few hours of driving: dense old-city streets give way to rice terraces, then to pine forest, then to raw mountain rock. This clip moves through a handful of those transitions back to back, the way a first-time visitor actually experiences them.",
  },
  {
    id: 'mice',
    title: 'Groups & Corporate Retreats',
    src: '/mice/mice.mp4',
    poster: '/images/hero_section/about_us.jpg',
    description:
      "How we host teams and incentive groups — from welcome dinners in Thamel to full-day excursions built around your agenda. We've run retreats for teams of six and conferences for two hundred, and the logistics look different every time: private transport, venue scouting, translators, dietary needs, the works. This is a look at what that actually feels like on the ground, not just on a proposal document.",
  },
  {
    id: 'background',
    title: 'Heritage Journey Nepal',
    src: '/background.mp4',
    poster: '/logo.png',
    description:
      "Who we are and what nineteen years of running trips across Nepal, Bhutan, and Tibet has taught us about doing it right. We started as a small team of guides who thought the standard tourist itinerary missed most of what makes this region worth visiting. That's still the thing we care about most — fewer boxes ticked, more time in places that actually mean something.",
  },
];

const VideosPage = () => {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  const [muted, setMuted] = useState<Record<string, boolean>>({});

  const trailRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trailRef,
    offset: ['start center', 'end center'],
  });

  const isPlaying = (id: string) => !!playing[id];
  const isMuted = (id: string) => muted[id] ?? true;

  const togglePlay = (id: string, el: HTMLVideoElement | null) => {
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying((p) => ({ ...p, [id]: true }));
    } else {
      el.pause();
      setPlaying((p) => ({ ...p, [id]: false }));
    }
  };

  const toggleMute = (id: string, el: HTMLVideoElement | null) => {
    if (!el) return;
    el.muted = !el.muted;
    setMuted((m) => ({ ...m, [id]: el.muted }));
  };

  return (
    <div className="min-h-screen bg-heritage-light overflow-x-hidden">
      <Navbar onBookNow={() => navigate('/contact')} />

      {/* ── Header ───────────────────────────────────────────── */}
      <section className="pt-40 pb-20 px-6 md:px-12 bg-heritage-purple">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-7xl mx-auto"
        >
          <p className="text-white uppercase tracking-[0.2em] text-xs font-semibold mb-3">
            Watch
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight max-w-3xl">
            Stories from the trail, told in motion.
          </h1>
          <p className="text-white/80 mt-4 max-w-xl">
            A closer look at where we go and how we travel — before you book, see it for yourself.
          </p>
        </motion.div>
      </section>

      {/* ── Rows, connected by a scroll-drawn trail line ────── */}
      <div ref={trailRef} className="relative">
        {/* Trail line — draws downward as you scroll, like a route on a map */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-heritage-brown/10 z-0">
          <motion.div
            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
            className="absolute inset-0 bg-heritage-pink"
          />
        </div>

        {videos.map((video, index) => {
          const reversed = index % 2 === 1;
          return (
            <section key={video.id} className="relative grid md:grid-cols-2">
              {/* Waypoint dot on the trail */}
              <div
                className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full items-center justify-center bg-heritage-light ring-4 ring-heritage-light`}
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, ease: 'backOut' }}
                  className="w-2.5 h-2.5 rounded-full bg-heritage-pink"
                />
              </div>

              {/* Video */}
              <motion.div
                initial={{ opacity: 0, x: reversed ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`relative aspect-video md:aspect-auto md:h-[560px] bg-zinc-900 overflow-hidden group ${
                  reversed ? 'md:order-2' : 'md:order-1'
                }`}
              >
                <video
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  poster={video.poster}
                  muted={isMuted(video.id)}
                  playsInline
                  onPlay={() => setPlaying((p) => ({ ...p, [video.id]: true }))}
                  onPause={() => setPlaying((p) => ({ ...p, [video.id]: false }))}
                  onEnded={() => setPlaying((p) => ({ ...p, [video.id]: false }))}
                >
                  <source src={video.src} type="video/mp4" />
                </video>

                {/* Controls */}
                <div className="absolute inset-0 flex items-end justify-between p-5 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) =>
                      togglePlay(video.id, (e.currentTarget.closest('.group')?.querySelector('video') as HTMLVideoElement) || null)
                    }
                    aria-label={isPlaying(video.id) ? 'Pause video' : 'Play video'}
                    className="w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                  >
                    {isPlaying(video.id) ? (
                      <Pause className="w-5 h-5 text-heritage-pink" />
                    ) : (
                      <Play className="w-5 h-5 text-heritage-pink ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) =>
                      toggleMute(video.id, (e.currentTarget.closest('.group')?.querySelector('video') as HTMLVideoElement) || null)
                    }
                    aria-label={isMuted(video.id) ? 'Unmute' : 'Mute'}
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                  >
                    {isMuted(video.id) ? (
                      <VolumeX className="w-4 h-4 text-heritage-pink" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-heritage-pink" />
                    )}
                  </button>
                </div>

                {!isPlaying(video.id) && (
                  <button
                    onClick={(e) =>
                      togglePlay(video.id, (e.currentTarget.closest('.group')?.querySelector('video') as HTMLVideoElement) || null)
                    }
                    aria-label="Play video"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-lg">
                      <Play className="w-6 h-6 text-heritage-pink ml-1" />
                    </span>
                  </button>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, x: reversed ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                className={`flex flex-col justify-center px-8 md:px-16 py-16 ${
                  reversed ? 'md:order-1' : 'md:order-2'
                } ${index % 2 === 0 ? 'bg-heritage-light' : 'bg-white'}`}
              >
                <span className="text-heritage-pink font-serif text-6xl leading-none opacity-25 mb-4">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-heritage-brown mb-4">
                  {video.title}
                </h2>
                <p className="text-heritage-brown/70 leading-relaxed max-w-lg">
                  {video.description}
                </p>
              </motion.div>
            </section>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default VideosPage;