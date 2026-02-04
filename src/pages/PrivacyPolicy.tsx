import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Database, Share2, Clock } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal identification information (name, email address, phone number, national ID)",
        "Financial information (account balances, transaction history, loan applications)",
        "Contact information and communication preferences",
        "Device and browser information when accessing our services",
      ],
    },
    {
      icon: Lock,
      title: "How We Protect Your Data",
      content: [
        "All data is encrypted using industry-standard SSL/TLS encryption",
        "Access to personal data is restricted to authorized personnel only",
        "Regular security audits and vulnerability assessments",
        "Two-factor authentication for sensitive operations",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Processing your membership applications and managing your account",
        "Providing savings, loans, and investment services",
        "Communicating important updates about your account and our services",
        "Improving our services and developing new features",
      ],
    },
    {
      icon: Share2,
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "Data may be shared with regulatory authorities as required by law",
        "Service providers who assist in our operations (under strict confidentiality)",
        "With your explicit consent for specific purposes",
      ],
    },
    {
      icon: Clock,
      title: "Data Retention",
      content: [
        "Account information is retained for the duration of your membership",
        "Transaction records are kept for a minimum of 7 years as required by law",
        "You may request deletion of certain data subject to legal requirements",
        "Inactive accounts are reviewed and archived after 5 years of inactivity",
      ],
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
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Your Privacy Matters</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Privacy Policy</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg">
              RockwellAfrica SACCO is committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-semibold">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 glass-card p-6 rounded-2xl">
            <h2 className="font-display text-xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Under applicable data protection laws, you have the right to:
            </p>
            <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Access your personal data
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Correct inaccurate data
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Request data deletion
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Object to data processing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Data portability
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Withdraw consent
              </li>
            </ul>
          </div>

          <div className="mt-12 text-center text-muted-foreground">
            <p>
              For any privacy-related inquiries, please contact us at{" "}
              <a href="mailto:privacy@rockwellafrica.com" className="text-primary hover:underline">
                privacy@rockwellafrica.com
              </a>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
