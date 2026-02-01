import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Shield, Clock, Globe } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Mobile Banking",
    description: "Access your account, transfer funds, and manage your finances from anywhere."
  },
  {
    icon: Shield,
    title: "Secure Access",
    description: "Bank-grade security with two-factor authentication to protect your account."
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access your account anytime, day or night, from any device."
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Manage your finances whether you're at home or abroad."
  }
];

const Portal = () => {
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
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Members Portal
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Welcome to Your <span className="text-gradient-gold">Digital Banking</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Access your accounts, apply for loans, track your investments, and manage 
                your financial life all in one secure place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover group">
                  Login to Portal
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to="/membership">
                  <Button size="lg" variant="outline" className="border-foreground/20 hover:border-primary hover:bg-primary/10">
                    Not a Member? Join Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="font-display text-3xl font-bold mb-4">
                Portal <span className="text-gradient-gold">Features</span>
              </h2>
              <p className="text-muted-foreground">
                Everything you need to manage your finances online.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 text-center hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Login Form Preview */}
        <section className="py-16">
          <div className="container max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-8"
            >
              <h3 className="font-display text-2xl font-bold text-center mb-6">
                Member <span className="text-gradient-gold">Login</span>
              </h3>
              <p className="text-center text-muted-foreground mb-6">
                The Members Portal is coming soon! Contact us for account inquiries.
              </p>
              <Link to="/contact">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Contact Support
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Portal;
