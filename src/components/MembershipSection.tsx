import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Competitive interest rates on savings",
  "Affordable loan products",
  "Democratic governance - one member, one vote",
  "Profit sharing through dividends",
  "Financial education and literacy programs",
  "Access to exclusive member services"
];

export const MembershipSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="membership" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Membership
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
              Join Our <span className="text-gradient-gold">Growing Family</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Become a member today and enjoy access to our comprehensive 
              financial products, competitive rates, and a supportive community 
              committed to your financial success.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground/90">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-hover group"
              >
                Apply for Membership
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-foreground/20 hover:border-primary hover:bg-primary/10"
              >
                Download Forms
              </Button>
            </motion.div>
          </motion.div>

          {/* Right - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-10 relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <h3 className="font-display text-3xl font-bold mb-4">
                  Start Your Journey <span className="text-gradient-gold">Today</span>
                </h3>
                <p className="text-muted-foreground mb-8">
                  Join over 10,000 members who are already building their financial future with us.
                </p>
                
                {/* Requirements */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-lg">Requirements:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Valid National ID or Passport</li>
                    <li>• Registration fee of KES 500</li>
                    <li>• Minimum share capital of KES 5,000</li>
                    <li>• Completed application form</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm text-foreground/80">
                    <span className="text-primary font-semibold">Special Offer:</span> Join this month 
                    and get your first year's membership fee waived!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
