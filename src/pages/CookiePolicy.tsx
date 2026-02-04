import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cookie, Settings, Shield, BarChart3, Clock } from "lucide-react";

const CookiePolicy = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: "Essential Cookies",
      description: "Required for the website to function properly",
      examples: [
        "Session management and authentication",
        "Security and fraud prevention",
        "Load balancing and server optimization",
      ],
      required: true,
    },
    {
      icon: BarChart3,
      title: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      examples: [
        "Page view tracking",
        "User journey analysis",
        "Performance monitoring",
      ],
      required: false,
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      description: "Enable personalized features and preferences",
      examples: [
        "Language preferences",
        "Theme settings (light/dark mode)",
        "Remembered login details",
      ],
      required: false,
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
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Cookie className="w-4 h-4" />
              <span className="text-sm font-medium">Cookie Information</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Cookie Policy</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg">
              This Cookie Policy explains how RockwellAfrica SACCO uses cookies and similar technologies to recognize you 
              when you visit our website. It explains what these technologies are and why we use them, as well as your 
              rights to control our use of them.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl mb-8">
            <h2 className="font-display text-xl font-semibold mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. 
              They are widely used to make websites work more efficiently, provide a better user experience, and give website owners 
              information about how their site is being used.
            </p>
          </div>

          <h2 className="font-display text-2xl font-semibold mb-6">Types of Cookies We Use</h2>

          <div className="space-y-6 mb-12">
            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={cookie.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <cookie.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold">{cookie.title}</h3>
                  </div>
                  {cookie.required ? (
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      Required
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{cookie.description}</p>
                <ul className="space-y-2">
                  {cookie.examples.map((example, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {example}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="glass-card p-6 rounded-2xl mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold">Cookie Duration</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50">
                <h3 className="font-semibold mb-2">Session Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Temporary cookies that are deleted when you close your browser.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <h3 className="font-semibold mb-2">Persistent Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Remain on your device for a set period or until you delete them.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h2 className="font-display text-xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to decide whether to accept or reject cookies. You can set or amend your web browser 
              controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website 
              though your access to some functionality and areas may be restricted.
            </p>
            <p className="text-muted-foreground">
              Most web browsers allow some control of cookies through browser settings. To find out more about cookies 
              and how to manage them, visit{" "}
              <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                www.allaboutcookies.org
              </a>
            </p>
          </div>

          <div className="mt-12 text-center text-muted-foreground">
            <p>
              For any questions about our use of cookies, please contact us at{" "}
              <a href="mailto:info@rockwellafrica.com" className="text-primary hover:underline">
                info@rockwellafrica.com
              </a>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
