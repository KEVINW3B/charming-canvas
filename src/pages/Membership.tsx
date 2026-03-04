import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, FileText, Users, Shield, Gift, CreditCard, Building2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  "Competitive interest rates on savings",
  "Affordable loan products (up to 3x savings)",
  "Democratic governance — one member, one vote",
  "Profit sharing through dividends",
  "Financial education and literacy programs",
  "Access to exclusive member services",
  "Benevolent fund support (KES 750/month)",
  "Annual Christmas Boom savings programme",
];

const saccoRequirements = [
  { label: "Membership Fee", amount: "KES 500" },
  { label: "Minimum Monthly Savings", amount: "KES 1,500" },
  { label: "Minimum Capital Shares", amount: "KES 10,000" },
  { label: "By-Law Copy", amount: "KES 500" },
  { label: "Official Regalia", amount: "KES 1,500" },
  { label: "Diaspora Capital Shares", amount: "KES 250,000" },
];

const requirements = [
  { icon: FileText, title: "Valid National ID or Passport", description: "Government-issued identification document" },
  { icon: Gift, title: "Registration Fee", description: "One-time membership fee of KES 500" },
  { icon: Users, title: "Share Capital", description: "Min KES 10,000 in SACCO shares" },
  { icon: Shield, title: "Completed Application Form", description: "Download from our Resources page" },
];

const steps = [
  { step: "01", title: "Download & Fill Form", description: "Get our admission form from the Downloads page and complete all sections" },
  { step: "02", title: "Gather Documents", description: "Prepare your National ID, passport photos, and next of kin details" },
  { step: "03", title: "Pay Fees & Submit", description: "Pay via Co-op Bank (Paybill 400200, A/C 01101086907002) and submit forms" },
  { step: "04", title: "Get Approved", description: "County officials verify your application and you receive your member code" },
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
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
          </div>
          <div className="absolute inset-0 mesh-gradient" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium uppercase tracking-wider mb-6">
                Membership
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-6">
                Join the <span className="text-gradient-gold">RockwellAfrica Family</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Become a member of our Joint Family Tree — access comprehensive financial products, competitive savings rates, and a supportive community committed to your financial freedom.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/downloads">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover group">
                    <Download className="mr-2 w-5 h-5" />
                    Download Application Form
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-foreground/20 hover:border-primary hover:bg-primary/10 group">
                    Contact Admin
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-display text-3xl font-bold mb-4">Member <span className="text-gradient-gold">Benefits</span></h2>
              <p className="text-muted-foreground">Enjoy exclusive benefits as a bona fide member of RockwellAfrica SACCO.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div key={benefit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }} className="flex items-center gap-3 glass-card p-4 hover:border-primary/20 transition-colors">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fee Schedule */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold mb-4">SACCO <span className="text-gradient-gold">Fee Schedule</span></h2>
              <p className="text-muted-foreground">Transparent breakdown of fees to get started</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg">RockwellAfrica SACCO Fees</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {saccoRequirements.map((fee) => (
                  <div key={fee.label} className="flex items-center justify-between py-3 px-4 rounded-xl bg-secondary/50 border border-border/30">
                    <span className="text-sm text-muted-foreground">{fee.label}</span>
                    <span className="text-sm font-bold text-primary">{fee.amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-xs font-semibold text-foreground mb-2">💳 Co-operative Bank</p>
                  <p className="text-xs text-muted-foreground">Paybill: <span className="text-primary font-bold">400200</span></p>
                  <p className="text-xs text-muted-foreground">Account: <span className="text-primary font-bold">01101086907002</span></p>
                </div>
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                  <p className="text-xs font-semibold text-foreground mb-2">📱 M-Pesa (Admin)</p>
                  <p className="text-xs text-muted-foreground">Phone: <span className="text-accent font-bold">0724 936 774</span></p>
                  <p className="text-xs text-muted-foreground">Alt: <span className="text-accent font-bold">0768 830 338</span></p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-display text-3xl font-bold mb-4">What You <span className="text-gradient-gold">Need</span></h2>
              <p className="text-muted-foreground">Here's what to prepare for your membership application.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {requirements.map((req, index) => (
                <motion.div key={req.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="glass-card p-6 text-center hover:border-primary/20 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto mb-4">
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
        <section className="py-16">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-display text-3xl font-bold mb-4">How to <span className="text-gradient-gold">Join</span></h2>
              <p className="text-muted-foreground">Follow these steps to become a bona fide member today.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="glass-card p-6 relative hover:border-primary/20 transition-colors">
                  <div className="text-4xl font-display font-bold text-gradient-gold opacity-50 mb-4">{step.step}</div>
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
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="glass-card p-10 text-center max-w-3xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl font-bold mb-4">Ready to <span className="text-gradient-gold">Join?</span></h2>
                <p className="text-muted-foreground mb-6">
                  Download the application form, fill it in, and submit to the SACCO admin. Start your journey to financial freedom with RockwellAfrica today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/downloads">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover">
                      <Download className="mr-2 w-5 h-5" />
                      Get Forms
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
