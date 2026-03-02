import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stories = [
  {
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&h=400&fit=crop",
    title: "Why SACCOs Matter",
    excerpt: "SACCOs empower communities by pooling savings and providing affordable credit. Unlike traditional banks, every member has a voice — creating financial inclusion from the ground up.",
    category: "Community Impact"
  },
  {
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
    title: "Building Wealth Together",
    excerpt: "Our members have collectively saved over KES 500M, proving that financial growth isn't reserved for the wealthy — it's achievable through discipline and cooperative effort.",
    category: "Success Story"
  },
  {
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
    title: "From Dreams to Homes",
    excerpt: "Through our housing finance program, over 200 families have realized their dream of homeownership. Affordable rates and flexible repayment make it possible.",
    category: "Housing"
  },
];

const testimonials = [
  {
    quote: "Joining RockwellAfrica SACCO was the best financial decision I ever made. My savings have grown 3x in just 2 years.",
    author: "Jane Wanjiku",
    role: "Member since 2019"
  },
  {
    quote: "The loan I received helped me expand my business. The interest rates are fair and repayment terms are flexible.",
    author: "David Ochieng",
    role: "Small Business Owner"
  }
];

export const BankingStoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-accent text-sm font-medium uppercase tracking-wider">
            Stories & Impact
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            Real Stories, <span className="text-gradient-gold">Real Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover how our members are transforming their financial futures and 
            why a SACCO is the smartest financial move you can make.
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {stories.map((story, index) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group glass-card overflow-hidden"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium backdrop-blur-md border border-primary/20">
                  {story.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {story.excerpt}
                </p>
                <Link to="/news">
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:bg-transparent text-sm">
                    Read More <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 + index * 0.2 }}
              className="glass-card p-8 relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              <p className="text-foreground/90 text-lg leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
