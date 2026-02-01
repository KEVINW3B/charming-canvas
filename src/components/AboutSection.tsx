import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Target, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "Member-Owned",
    description: "A cooperative where every member has a voice and shares in our success."
  },
  {
    icon: Target,
    title: "Financial Inclusion",
    description: "Making quality financial services accessible to all community members."
  },
  {
    icon: Award,
    title: "Trusted Partner",
    description: "15+ years of building trust and delivering on our promises to members."
  },
  {
    icon: TrendingUp,
    title: "Sustainable Growth",
    description: "Consistent growth strategies that ensure long-term stability and returns."
  }
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            About Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            About <span className="text-gradient-gold">RockwellAfrica SACCO</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your trusted financial partner for savings, loans, and investment opportunities. 
            We believe in the power of collective action to achieve financial stability.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-display text-3xl font-bold mb-6">Who We Are</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                RockwellAfrica SACCO is a member-owned financial cooperative dedicated 
                to providing affordable financial services to our members. Established 
                with a vision to empower communities through financial inclusion, we 
                have grown to become a trusted SACCO serving thousands of members 
                across the region.
              </p>
              <p>
                Our mission is to promote thrift, provide credit at competitive rates, 
                and offer financial services that meet the needs of our members while 
                ensuring the long-term sustainability of the SACCO.
              </p>
              <p>
                At RockwellAfrica SACCO, we believe in the power of collective action. 
                By pooling our resources, we can achieve financial stability and growth 
                that would be difficult to attain individually.
              </p>
            </div>
            <Link to="/about">
              <Button 
                className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 glow-hover"
              >
                Learn More About Us
              </Button>
            </Link>
          </motion.div>

          {/* Right Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="glass-card p-6 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
