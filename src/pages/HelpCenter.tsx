import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  CreditCard,
  PiggyBank,
  Calendar,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HelpCenter = () => {
  const helpCategories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "New to RockwellAfrica SACCO? Learn how to become a member and set up your account.",
      link: "/faqs",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: PiggyBank,
      title: "Savings & Deposits",
      description: "Learn about savings accounts, weekly deposits, and how to grow your wealth.",
      link: "/faqs",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: CreditCard,
      title: "Loans & Credit",
      description: "Understand loan types, eligibility, application process, and repayment options.",
      link: "/faqs",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Shield,
      title: "Account Security",
      description: "Keep your account safe with security best practices and privacy settings.",
      link: "/faqs",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Calendar,
      title: "Meetings & Events",
      description: "Stay updated on upcoming meetings, AGMs, and SACCO events.",
      link: "/faqs",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: FileText,
      title: "Documents & Forms",
      description: "Download forms, statements, and other important documents.",
      link: "/contact",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our support team",
      contact: "+254 700 000 000",
      action: "tel:+254700000000",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Get help via email",
      contact: "support@rockwellafrica.com",
      action: "mailto:support@rockwellafrica.com",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with us online",
      contact: "Available 8AM - 6PM",
      action: "/contact",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Help Center</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">How Can We Help?</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers, guides, and support to help you make the most of your SACCO membership.
            </p>
          </div>

          {/* Quick Links to FAQs */}
          <Link to="/faqs" className="block mb-12">
            <div className="glass-card p-6 rounded-2xl hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <HelpCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Browse Frequently Asked Questions</h3>
                    <p className="text-muted-foreground">Find quick answers to common questions</p>
                  </div>
                </div>
                <span className="text-primary">→</span>
              </div>
            </div>
          </Link>

          {/* Help Categories */}
          <h2 className="font-display text-2xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {helpCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={category.link}>
                  <Card className="glass-card h-full hover:-translate-y-1 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <div className={`p-3 rounded-xl ${category.bgColor} w-fit mb-2`}>
                        <category.icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <CardTitle className="font-display text-lg">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Contact Methods */}
          <h2 className="font-display text-2xl font-semibold mb-6">Contact Us Directly</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl text-center hover:-translate-y-1 hover:border-primary/50 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                <p className="text-primary font-medium">{method.contact}</p>
              </motion.a>
            ))}
          </div>

          {/* Office Hours */}
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="font-display text-2xl font-semibold mb-6 text-center">Office Hours</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <h3 className="font-semibold mb-2">Weekdays</h3>
                <p className="text-primary text-lg font-medium">8:00 AM - 6:00 PM</p>
                <p className="text-sm text-muted-foreground">Monday to Friday</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <h3 className="font-semibold mb-2">Saturdays</h3>
                <p className="text-primary text-lg font-medium">9:00 AM - 1:00 PM</p>
                <p className="text-sm text-muted-foreground">Half day service</p>
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-6">
              Closed on Sundays and Public Holidays
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
