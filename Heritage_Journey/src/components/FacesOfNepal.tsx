/* ── DESIGN TOKENS (same as Hero) ─────────────────── */
const C = {
  ink: '#0c1626',
  snow: '#f3f6f9',
  saffron: '#f5a81c',
  flagRed: '#d63a32',
};

const HEADING_FONT = "'Outfit', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT = "'Hind', system-ui, -apple-system, 'Segoe UI', sans-serif";

const ethnicGroups = [
  { name: 'Sherpa', imagePath: '/images/faces/sherpa.jpg', region: 'Himalayas', desc: 'Guardians of Everest' },
  { name: 'Newar', imagePath: '/images/faces/newar.jpg', region: 'Kathmandu Valley', desc: 'Masters of Art & Craft' },
  { name: 'Festive', imagePath: '/images/faces/festive.jpg', region: 'Across Nepal', desc: 'Soul of Festivals' },
  { name: 'Madhesi', imagePath: '/images/faces/madhesi.jpg', region: 'Terai Plains', desc: 'Vibrant Plains Culture' },
  { name: 'Tamang', imagePath: '/images/faces/tamang.jpg', region: 'Hills', desc: 'Music & Tradition' },
  { name: 'Tharu', imagePath: '/images/faces/tharu.jpg', region: 'Terai', desc: 'Indigenous Pride' },
  { name: 'Magar', imagePath: '/images/faces/magar.jpg', region: 'Mid-Hills', desc: 'Brave Warriors' },
  { name: 'Brahman-Chhetri', imagePath: '/images/faces/brahman.jpg', region: 'Hills', desc: 'Keepers of Knowledge' },
];

const FacesOfNepal = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Hind:wght@400;500;600&display=swap');
      `}</style>

      <section
        aria-labelledby="faces-heading"
        style={{ backgroundColor: C.snow, color: C.ink, fontFamily: BODY_FONT }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
          {/* Heading */}
          <div className="mb-10 lg:mb-14">
            <h2
              id="faces-heading"
              style={{
                fontFamily: HEADING_FONT,
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
              className="mb-4"
            >
              Faces of Nepal
            </h2>
            <p className="text-[17px] sm:text-lg" style={{ color: 'rgba(12,22,38,0.65)' }}>
              Our beautiful diversity
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 items-start gap-x-4 sm:gap-x-6 gap-y-10">
            {ethnicGroups.map((group) => (
              <div key={group.name}>
                {/* Same-size frame for every photo, filled edge to edge.
                    object-top keeps faces in view; edges may be trimmed if a photo isn't 4:5. */}
                <div className="aspect-[4/5] w-full overflow-hidden mb-4">
                  <img
                    src={group.imagePath}
                    alt={group.name}
                    onError={handleImageError}
                    loading="lazy"
                    className="w-full h-full object-cover object-top block"
                  />
                </div>

                <h3
                  style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.02em' }}
                  className="text-[1.3rem] sm:text-[1.5rem] font-semibold leading-tight"
                >
                  {group.name}
                </h3>
                <p className="text-[14px] sm:text-[15px] mt-1" style={{ color: C.flagRed }}>
                  {group.region}
                </p>
                <p
                  className="text-[15px] sm:text-[16px] leading-snug mt-1"
                  style={{ color: 'rgba(12,22,38,0.75)' }}
                >
                  {group.desc}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mt-14 text-[17px] sm:text-lg"
            style={{ color: 'rgba(12,22,38,0.75)' }}
          >
            Many faces, one beautiful Nepal.
          </p>
        </div>
      </section>
    </>
  );
};

export default FacesOfNepal;