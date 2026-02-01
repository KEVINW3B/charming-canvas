import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

const services = [
  {
    icon: PiggyBank,
    title: "Savings Accounts",
    description: "Secure savings options with competitive interest rates to help you grow your money safely.",
    color: "from-amber-500/20 to-yellow-500/20"
  },
  {
    icon: Landmark,
    title: "Loans",
    description: "Accessible loan products with flexible repayment terms to meet your financial needs.",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: TrendingUp,
    title: "Investments",
    description: "Diversified investment opportunities to help you build wealth and secure your future.",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: Home,
    title: "Housing",
    description: "Affordable housing solutions and financing to help you own your dream home.",
    color: "from-purple-500/20 to-violet-500/20"
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Education financing options to support your academic pursuits and those of your family.",
    color: "from-pink-500/20 to-rose-500/20"
  },
  {
    icon: Shield,
    title: "Insurance",
    description: "Comprehensive insurance products to protect you and your family against uncertainties.",
    color: "from-orange-500/20 to-red-500/20"
  }
];

export const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
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
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            Comprehensive <span className="text-gradient-gold">Financial Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover our range of financial products and services designed to meet 
            your unique needs and help you achieve your financial goals.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group service-card"
            >
              {/* Icon Header */}
              <div className={`service-icon w-full h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6`}>
                <service.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Learn More Link */}
              <Button 
                variant="ghost" 
                className="group/btn p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent"
              >
                Learn More 
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
