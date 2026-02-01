import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, FileText, Users, Shield, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  "Competitive interest rates on savings",
  "Affordable loan products",
  "Democratic governance - one member, one vote",
  "Profit sharing through dividends",
  "Financial education and literacy programs",
  "Access to exclusive member services",
  "Mobile banking access",
  "Free financial advisory"
];

const requirements = [
  { icon: FileText, title: "Valid National ID or Passport", description: "A government-issued identification document" },
  { icon: Gift, title: "Registration Fee", description: "One-time fee of KES 500" },
  { icon: Users, title: "Share Capital", description: "Minimum of KES 5,000 in shares" },
  { icon: Shield, title: "Application Form", description: "Completed membership application" }
];

const steps = [
  { step: "01", title: "Download & Fill Form", description: "Get our membership application form and fill in your details" },
  { step: "02", title: "Gather Documents", description: "Prepare your ID, passport photos, and proof of income" },
  { step: "03", title: "Submit Application", description: "Visit our office or submit online with required documents" },
  { step: "04", title: "Get Approved", description: "Receive confirmation and start enjoying member benefits" }
];

const Membership = () => {
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
                Membership
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Join Our <span className="text-gradient-gold">Growing Family</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Become a member today and enjoy access to our comprehensive 
                financial products, competitive rates, and a supportive community 
                committed to your financial success.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover group">
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="font-display text-3xl font-bold mb-4">
                Member <span className="text-gradient-gold">Benefits</span>
              </h2>
              <p className="text-muted-foreground">
                Enjoy exclusive benefits when you become a member of RockwellAfrica SACCO.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-center gap-3 glass-card p-4"
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="font-display text-3xl font-bold mb-4">
                Membership <span className="text-gradient-gold">Requirements</span>
              </h2>
              <p className="text-muted-foreground">
                Here's what you need to become a member.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {requirements.map((req, index) => (
                <motion.div
                  key={req.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <req.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{req.title}</h4>
                  <p className="text-sm text-muted-foreground">{req.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Join */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="font-display text-3xl font-bold mb-4">
                How to <span className="text-gradient-gold">Join</span>
              </h2>
              <p className="text-muted-foreground">
                Follow these simple steps to become a member.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 relative"
                >
                  <div className="text-4xl font-display font-bold text-primary/20 mb-4">
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-10 text-center max-w-3xl mx-auto relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl font-bold mb-4">
                  Special <span className="text-gradient-gold">Offer</span>
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join this month and get your first year's membership fee waived! 
                  Start your journey to financial freedom today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover">
                      Apply for Membership
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button size="lg" variant="outline" className="border-foreground/20 hover:border-primary hover:bg-primary/10">
                      View Our Services
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Membership;
