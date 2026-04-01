import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=400&fit=crop",
    title: "Community Banking",
    description: "Building financial futures together",
  },
  {
    src: "https://images.unsplash.com/photo-1553729459-uj3t8aLOpjQ?w=600&h=400&fit=crop",
    title: "Savings Growth",
    description: "Your money, growing every day",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
    title: "Business Empowerment",
    description: "Fueling entrepreneurial dreams",
  },
  {
    src: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop",
    title: "Family Security",
    description: "Protecting what matters most",
  },
  {
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
    title: "Partnership",
    description: "Stronger together in unity",
  },
  {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
    title: "Financial Planning",
    description: "Expert guidance for your goals",
  },
];

export const AnimatedGallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-secondary/20" />

      <div className="container relative z-10 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Our Impact
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-5">
            Empowering <span className="text-gradient-gold">Communities</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            See how RockwellAfrica transforms lives through financial inclusion and community empowerment.
          </p>
        </motion.div>

        {/* Gallery Grid — responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {galleryImages.map((img, index) => (
            <motion.div
              key={img.title}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: index * 0.12, type: "spring", stiffness: 80 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                activeIndex === index ? "ring-2 ring-primary/50 shadow-lg" : ""
              }`}
              style={{ aspectRatio: "3/2" }}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Active indicator */}
              <motion.div
                initial={false}
                animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 20 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-0 left-0 right-0 p-4 sm:p-5"
              >
                <h3 className="font-display text-lg font-bold text-foreground">{img.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{img.description}</p>
              </motion.div>

              {/* Hover overlay text (always visible on hover) */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="font-display text-lg font-bold text-foreground">{img.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{img.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
