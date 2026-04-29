import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ethnicGroups = [
  { name: "Festive", imagePath: "images/faces/festive.jpg"},
  { name: "Sherpa", imagePath: "/images/faces/sherpa.jpg" },
  { name: "Tamang", imagePath: "/images/faces/tamang.jpg" },
  { name: "Newar", imagePath: "/images/faces/newar.jpg" },
  { name: "Brahman-Chhetri", imagePath: "/images/faces/brahman.jpg" },
  { name: "Magar", imagePath: "/images/faces/magar.jpg" },
  { name: "Tharu", imagePath: "/images/faces/tharu.jpg" },
  { name: "Madhesi", imagePath: "/images/faces/madhesi.jpg" },
];

const FacesOfNepal = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleImageError = (e) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <section className="bg-[#fffaf0] py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-bold text-[#9c2a2a] tracking-tight">Faces of Nepal</h2>
          <p className="text-4xl font-serif text-orange-700 mt-3">Where Every Smile Tells a Story</p>
        </motion.div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#9c2a2a] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {ethnicGroups.map((group, index) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, scale: 0.7, y: 60 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -12,
                  transition: { duration: 0.4 }
                }}
                viewport={{ once: true }}
                className="relative group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-[4/5] 
                              ring-1 ring-orange-100 hover:ring-orange-300 transition-all duration-500">

                  <img 
                    src={group.imagePath}
                    alt={group.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Hover Overlay with Name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                    <div>
                      <p className="text-white text-4xl font-bold tracking-wide">
                        {group.name}
                      </p>
                      <div className="mt-2 h-1 w-12 bg-orange-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-rose-400 to-purple-500 
                                  opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10 rounded-3xl"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quote */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-20 text-[#9c2a2a] italic text-2xl max-w-3xl mx-auto font-serif"
        >
          "Unity in diversity is the strength of Nepal, where hundreds of ethnicities come together to form one beautiful nation."
        </motion.p>
      </div>
    </section>
  );
};

export default FacesOfNepal;