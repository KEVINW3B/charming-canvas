import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Target, Award, TrendingUp, CheckCircle } from "lucide-react";
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

const values = [
  "Integrity in all our dealings",
  "Member-centric approach",
  "Transparency and accountability",
  "Innovation and continuous improvement",
  "Community empowerment",
  "Financial prudence"
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          </div>
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                About Us
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                About <span className="text-gradient-gold">RockwellAfrica SACCO</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your trusted financial partner for savings, loans, and investment opportunities. 
                We believe in the power of collective action to achieve financial stability.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-display text-3xl font-bold mb-6">Who We Are</h2>
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
                <Link to="/membership">
                  <Button className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 glow-hover">
                    Become a Member
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
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

        {/* Our Values */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="font-display text-3xl font-bold mb-4">
                Our <span className="text-gradient-gold">Core Values</span>
              </h2>
              <p className="text-muted-foreground">
                The principles that guide everything we do at RockwellAfrica SACCO.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 glass-card p-4"
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary/30">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl font-bold mb-4">
                Ready to <span className="text-gradient-gold">Get Started?</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of members who are building their financial future with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/membership">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover">
                    Join Today
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-foreground/20 hover:border-primary hover:bg-primary/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
