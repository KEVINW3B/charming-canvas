import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HERO_VIDEO_URL = "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4";

export const HeroSection = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95" />
        <div className="absolute inset-0 hero-gradient opacity-60" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40 + i * 10, 0],
              x: [0, 15 - i * 5, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
            className="absolute rounded-full bg-primary/10 blur-3xl"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              top: `${15 + i * 12}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8 border border-primary/20"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-foreground/80 tracking-wide">Trusted by 10,000+ Members</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 60 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05]"
          >
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gradient-gold block"
            >
              Together
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-foreground block"
            >
              We Grow
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Empowering our members through innovative financial solutions 
            that build wealth and secure futures for generations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/membership">
              <Button 
                size="lg" 
                className="group px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-hover rounded-xl"
              >
                Join Us Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/services">
              <Button 
                size="lg" 
                variant="outline" 
                className="group px-8 py-6 text-lg border-foreground/20 hover:border-primary hover:bg-primary/10 rounded-xl"
              >
                <Play className="mr-2 w-5 h-5" />
                Our Services
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20 max-w-2xl mx-auto"
          >
            {[
              { value: "10K+", label: "Active Members" },
              { value: "KES 500M+", label: "Assets Under Management" },
              { value: "15+", label: "Years of Trust" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.15 }}
                className="text-center glass-card px-4 py-5 rounded-2xl border border-primary/10"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gradient-gold">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
