/* ── DESIGN TOKENS (same as Hero) ─────────────────── */
const C = {
  ink: '#0c1626',
  snow: '#f3f6f9',
  saffron: '#f5a81c',
  flagRed: '#d63a32',
};

const HEADING_FONT = "'Outfit', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT = "'Hind', system-ui, -apple-system, 'Segoe UI', sans-serif";

const AboutNepal = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Hind:wght@400;500;600&display=swap');
      `}</style>

      <section
        aria-labelledby="about-nepal-heading"
        className="relative w-full overflow-hidden"
        style={{ fontFamily: BODY_FONT, backgroundColor: C.ink }}
      >
        {/* Background image */}
        <img
          src="/background_image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Light overlay so the photo stays visible; just enough shade behind the title */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(12,22,38,0.55), rgba(12,22,38,0.15) 60%, rgba(12,22,38,0.05))' }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
          <h2
            id="about-nepal-heading"
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: C.snow,
              textShadow: '0 2px 24px rgba(12,22,38,0.6)',
            }}
            className="mb-10 lg:mb-12"
          >
            About Nepal
          </h2>

          {/* Text card, same cut corner as the Trending tours card in the hero */}
          <div style={{ filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.35))' }}>
            <div
              className="p-7 sm:p-10 grid md:grid-cols-2 gap-8 lg:gap-14"
              style={{
                backgroundColor: C.snow,
                color: C.ink,
                clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%)',
              }}
            >
              <div>
                <h3
                  style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.02em' }}
                  className="text-[1.6rem] sm:text-[1.9rem] font-semibold leading-tight mb-4"
                >
                  Land of Himalayas
                </h3>
                <p className="text-[17px] leading-relaxed" style={{ color: 'rgba(12,22,38,0.85)' }}>
                  Nepal is a landlocked country located in South Asia, famously known as the home of the world's highest mountain,
                  Mount Everest (8,848.86m). From the snow-capped peaks of the Himalayas in the north to the flat Terai plains in the south,
                  Nepal offers breathtaking geographical diversity. It is blessed with 8 of the 10 highest mountains in the world.
                </p>
              </div>

              <div>
                <h3
                  style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.02em' }}
                  className="text-[1.6rem] sm:text-[1.9rem] font-semibold leading-tight mb-4"
                >
                  Cultural &amp; Spiritual Heart
                </h3>
                <p className="text-[17px] leading-relaxed" style={{ color: 'rgba(12,22,38,0.85)' }}>
                  Nepal is a melting pot of diverse cultures, ethnic groups, and religions. With over 125 ethnic groups and 123 spoken languages,
                  it proudly celebrates "Unity in Diversity". Ancient temples like Pashupatinath, Boudhanath Stupa, and vibrant festivals such as
                  Dashain, Tihar, and Losar make Nepal a living cultural museum. It is also the birthplace of Lord Buddha.
                </p>
              </div>
            </div>
          </div>

          <p
            className="mt-10 max-w-2xl text-[17px] sm:text-lg leading-relaxed"
            style={{ color: C.snow, textShadow: '0 2px 16px rgba(12,22,38,0.6)' }}
          >
            A small country with a big heart — where mountains touch the sky and traditions touch the soul.
          </p>
        </div>
      </section>
    </>
  );
};

export default AboutNepal;