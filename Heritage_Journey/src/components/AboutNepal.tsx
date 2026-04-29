import { motion } from 'framer-motion';

const AboutNepal = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden py-16">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/background_image.png" 
          alt="Nepal Landscape" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/65"></div>
      </div>

      <div className="container-custom relative z-10 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-white text-center mb-16 tracking-tight"
          >
            About Nepal
          </motion.h2>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 text-white"
            >
              <h3 className="text-2xl font-semibold mb-6 text-orange-300">Land of Himalayas</h3>
              <p className="text-lg leading-relaxed">
                Nepal is a landlocked country located in South Asia, famously known as the home of the world's highest mountain, 
                Mount Everest (8,848.86m). From the snow-capped peaks of the Himalayas in the north to the flat Terai plains in the south, 
                Nepal offers breathtaking geographical diversity. It is blessed with 8 of the 10 highest mountains in the world.
              </p>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 text-white"
            >
              <h3 className="text-2xl font-semibold mb-6 text-orange-300">Cultural & Spiritual Heart</h3>
              <p className="text-lg leading-relaxed">
                Nepal is a melting pot of diverse cultures, ethnic groups, and religions. With over 125 ethnic groups and 123 spoken languages, 
                it proudly celebrates "Unity in Diversity". Ancient temples like Pashupatinath, Boudhanath Stupa, and vibrant festivals such as 
                Dashain, Tihar, and Losar make Nepal a living cultural museum. It is also the birthplace of Lord Buddha.
              </p>
            </motion.div>

          </div>

          {/* Optional Bottom Quote */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white/80 italic text-xl mt-16 max-w-3xl mx-auto font-serif"
          >
            "A small country with a big heart — where mountains touch the sky and traditions touch the soul."
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default AboutNepal;