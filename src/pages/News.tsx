import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Bell, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const newsItems = [
  {
    title: "RockwellAfrica SACCO Surpasses KES 10 Billion in Assets",
    excerpt: "A milestone achievement reflecting the trust and confidence of our growing membership base. This growth positions us among the top-tier SACCOs in the region.",
    date: "2026-02-20",
    category: "Milestones",
    icon: TrendingUp,
    featured: true,
  },
  {
    title: "Annual General Meeting 2026 Scheduled",
    excerpt: "Members are invited to the upcoming AGM scheduled for March 15, 2026. Key agenda items include dividend declaration and board elections.",
    date: "2026-02-15",
    category: "Events",
    icon: Users,
  },
  {
    title: "New Mobile Banking Features Launched",
    excerpt: "We've enhanced our mobile platform with loan applications, real-time balance checks, and instant transfer capabilities for all members.",
    date: "2026-02-10",
    category: "Updates",
    icon: Bell,
  },
  {
    title: "Youth Empowerment Program Graduates 200 Students",
    excerpt: "Our TKB Trust Foundation vocational training program has successfully graduated another cohort of 200 young professionals.",
    date: "2026-01-28",
    category: "Community",
    icon: Award,
  },
  {
    title: "Interest Rate Update for Q1 2026",
    excerpt: "We're pleased to announce competitive rates for all our loan products this quarter. Normal loans at 12% p.a., development loans at 14% p.a.",
    date: "2026-01-15",
    category: "Finance",
    icon: TrendingUp,
  },
  {
    title: "New Branch Opening in Westlands",
    excerpt: "To better serve our members in the Nairobi metropolitan area, we're opening a new branch in Westlands, scheduled for Q2 2026.",
    date: "2026-01-10",
    category: "Expansion",
    icon: Users,
  },
];

const announcements = [
  "Dividend rate for FY 2025: 14% on deposits",
  "Loan processing time reduced to 48 hours",
  "New partnership with leading insurance provider",
  "Member education workshops every Saturday",
];

const News = () => {
  const featuredItem = newsItems.find((n) => n.featured);
  const regularItems = newsItems.filter((n) => !n.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">Stay Informed</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Information <span className="text-gradient-gold">Centre</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Latest news, updates, announcements, and insights from RockwellAfrica SACCO.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Announcements Ticker */}
        <section className="py-4 border-y border-border bg-secondary/20">
          <div className="container">
            <div className="flex items-center gap-4 overflow-hidden">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider whitespace-nowrap flex items-center gap-2">
                <Bell className="w-3.5 h-3.5" /> Announcements
              </span>
              <div className="flex gap-6 overflow-x-auto no-scrollbar">
                {announcements.map((a, i) => (
                  <span key={i} className="text-sm text-muted-foreground whitespace-nowrap">• {a}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured + Grid */}
        <section className="py-16">
          <div className="container max-w-6xl">
            {/* Featured */}
            {featuredItem && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-card p-8 mb-12 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                      Featured
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {featuredItem.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(featuredItem.date).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">{featuredItem.title}</h2>
                  <p className="text-muted-foreground max-w-2xl">{featuredItem.excerpt}</p>
                </div>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {regularItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="glass-card p-6 group hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.excerpt}</p>
                  <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="container max-w-3xl text-center">
            <div className="glass-card p-8">
              <h3 className="font-display text-xl font-bold mb-3">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Login to your member portal to receive personalized notifications and updates.
              </p>
              <Link to="/auth">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Member Login <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;
