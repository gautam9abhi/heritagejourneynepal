import { useState, useEffect, useCallback } from 'react';

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

const CATEGORIES = ['All', 'Mountains', 'Culture', 'Trekking', 'Wildlife', 'Cities'];
const getCategory = (index: number) => CATEGORIES[(index % (CATEGORIES.length - 1)) + 1];

const Gallery = ({ limit }: { limit?: number }) => {
  const [images, setImages] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const extensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
      const imagePaths: string[] = [];
      for (let i = 1; i <= 110; i++) {
        for (const ext of extensions) {
          const path = `/images/gallery/${i}.${ext}`;
          try {
            const response = await fetch(path, { method: 'HEAD' });
            if (response.ok) { imagePaths.push(path); break; }
          } catch {}
        }
      }
      const final = limit ? imagePaths.slice(0, limit) : imagePaths;
      setImages(final);
      setFiltered(final);
      setLoading(false);
    };
    fetchImages();
  }, [limit]);

  useEffect(() => {
    setFiltered(activeFilter === 'All' ? images : images.filter((_, i) => getCategory(i) === activeFilter));
    setVisibleCount(12);
  }, [activeFilter, images]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (lightbox === null) return;
    if (e.key === 'ArrowRight') setLightbox(prev => prev !== null ? Math.min(prev + 1, filtered.length - 1) : null);
    if (e.key === 'ArrowLeft') setLightbox(prev => prev !== null ? Math.max(prev - 1, 0) : null);
    if (e.key === 'Escape') setLightbox(null);
  }, [lightbox, filtered.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const visibleImages = filtered.slice(0, visibleCount);

  return (
    <section className="pb-24" style={{ backgroundColor: C.snow, fontFamily: BODY_FONT, color: C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Hind:wght@400;500;600&display=swap');
      `}</style>

      {/* ── Header ── */}
      <div className="text-center pt-16 pb-12 px-6">
        <h2
          className="mb-4"
          style={{
            fontFamily: HEADING_FONT,
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
          }}
        >
          Photo gallery
        </h2>
        <p className="text-[17px] max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(12,22,38,0.72)' }}>
          Explore the beauty of Nepal through our curated collection of moments
        </p>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex justify-center items-center py-24" role="status" aria-label="Loading photos">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: C.flagRed }}
          />
        </div>
      )}

      {/* ── Grid — uniform 4-col, equal aspect ratio ── */}
      {!loading && (
        <>
          {visibleImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4 md:px-6">
              {visibleImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setLightbox(index)}
                  aria-label={`Open photo ${index + 1}`}
                  className="relative group cursor-pointer overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d63a32]"
                  style={{ aspectRatio: '4/3' }}
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center py-16" style={{ color: 'rgba(12,22,38,0.6)' }}>
              No images found in this category.
            </p>
          )}

          {/* ── Load more ── */}
          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleCount(v => v + 12)}
                className="px-8 h-12 rounded-lg text-[15px] font-semibold border transition-colors duration-200 hover:bg-[#0c1626] hover:text-[#f3f6f9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d63a32]"
                style={{ backgroundColor: '#ffffff', color: C.ink, borderColor: C.ink }}
              >
                Load more photos
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            aria-label="Close"
            className="absolute top-4 right-5 text-white/80 hover:text-white text-4xl leading-none px-2 transition-colors"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>

          {lightbox > 0 && (
            <button
              aria-label="Previous photo"
              className="absolute left-3 md:left-6 text-white/70 hover:text-white text-5xl leading-none px-3 py-2 transition-colors"
              onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1); }}
            >
              ‹
            </button>
          )}

          <img
            src={filtered[lightbox]}
            alt={`Gallery ${lightbox + 1}`}
            className="max-h-[88vh] max-w-[88vw] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {lightbox < filtered.length - 1 && (
            <button
              aria-label="Next photo"
              className="absolute right-3 md:right-6 text-white/70 hover:text-white text-5xl leading-none px-3 py-2 transition-colors"
              onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1); }}
            >
              ›
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;