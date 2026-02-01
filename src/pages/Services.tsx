import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  PiggyBank, 
  Landmark, 
  TrendingUp, 
  Home, 
  GraduationCap, 
  Shield,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: PiggyBank,
    title: "Savings Accounts",
    description: "Secure savings options with competitive interest rates to help you grow your money safely.",
    features: ["Competitive interest rates up to 7% p.a.", "Flexible withdrawal options", "No minimum balance required", "Mobile and online access"],
    color: "from-amber-500/20 to-yellow-500/20"
  },
  {
    icon: Landmark,
    title: "Loans",
    description: "Accessible loan products with flexible repayment terms to meet your financial needs.",
    features: ["Quick loan approval within 48 hours", "Competitive interest rates", "Flexible repayment terms", "No hidden charges"],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: TrendingUp,
    title: "Investments",
    description: "Diversified investment opportunities to help you build wealth and secure your future.",
    features: ["Fixed deposit accounts", "Share capital investment", "Dividend payouts", "Financial advisory services"],
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: Home,
    title: "Housing",
    description: "Affordable housing solutions and financing to help you own your dream home.",
    features: ["Home purchase loans", "Construction financing", "Land acquisition loans", "Home improvement loans"],
    color: "from-purple-500/20 to-violet-500/20"
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Education financing options to support your academic pursuits and those of your family.",
    features: ["School fees loans", "Higher education financing", "Skill development loans", "Education savings plans"],
    color: "from-pink-500/20 to-rose-500/20"
  },
  {
    icon: Shield,
    title: "Insurance",
    description: "Comprehensive insurance products to protect you and your family against uncertainties.",
    features: ["Life insurance", "Medical cover", "Asset protection", "Funeral cover"],
    color: "from-orange-500/20 to-red-500/20"
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/30" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Our Services
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Comprehensive <span className="text-gradient-gold">Financial Solutions</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover our range of financial products and services designed to meet 
                your unique needs and help you achieve your financial goals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-8 hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Icon Header */}
                  <div className={`w-full h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6`}>
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to="/contact">
                    <Button variant="ghost" className="group p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent">
                      Learn More 
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
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
                Need Help <span className="text-gradient-gold">Choosing?</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Our financial advisors are here to help you find the right products for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover">
                    Get Expert Advice
                  </Button>
                </Link>
                <Link to="/membership">
                  <Button size="lg" variant="outline" className="border-foreground/20 hover:border-primary hover:bg-primary/10">
                    Join Now
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

export default Services;
