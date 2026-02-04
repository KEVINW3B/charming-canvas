import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText, Users, CreditCard, AlertTriangle, Scale, Clock } from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      icon: Users,
      title: "Membership Terms",
      content: [
        "Membership is open to individuals who meet our eligibility criteria and complete the registration process",
        "Members must provide accurate and truthful information during registration",
        "Each member is responsible for maintaining the confidentiality of their login credentials",
        "Membership may be suspended or terminated for violation of these terms",
      ],
    },
    {
      icon: CreditCard,
      title: "Financial Services",
      content: [
        "All deposits, withdrawals, and transactions are subject to our operational policies",
        "Interest rates on savings and loans are subject to change with prior notice",
        "Loan applications are subject to approval based on eligibility criteria",
        "Members must maintain minimum savings balances as specified in our policies",
      ],
    },
    {
      icon: Scale,
      title: "Member Obligations",
      content: [
        "Pay all dues, contributions, and loan repayments on time",
        "Attend member meetings and participate in SACCO activities",
        "Report any changes in personal or contact information promptly",
        "Comply with all SACCO bylaws, policies, and regulations",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Limitations of Liability",
      content: [
        "The SACCO shall not be liable for losses due to circumstances beyond our control",
        "Investment returns are subject to market conditions and are not guaranteed",
        "Members bear responsibility for decisions made based on information provided",
        "Service interruptions due to maintenance or technical issues",
      ],
    },
    {
      icon: Clock,
      title: "Account Termination",
      content: [
        "Members may voluntarily withdraw by submitting a written request",
        "Outstanding loans must be cleared before membership termination",
        "The SACCO reserves the right to terminate membership for policy violations",
        "Refunds of savings will be processed according to our withdrawal policy",
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
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Legal Agreement</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Terms of Service</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg">
              Welcome to RockwellAfrica SACCO. By accessing and using our services, you agree to be bound by these Terms of Service. 
              Please read them carefully before proceeding with your membership.
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
            <h2 className="font-display text-xl font-semibold mb-4">Amendments</h2>
            <p className="text-muted-foreground">
              RockwellAfrica SACCO reserves the right to modify these terms at any time. Changes will be communicated to members 
              through official channels at least 30 days before taking effect. Continued use of our services after such modifications 
              constitutes your acceptance of the updated terms.
            </p>
          </div>

          <div className="mt-8 glass-card p-6 rounded-2xl">
            <h2 className="font-display text-xl font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms of Service shall be governed by and construed in accordance with the laws of the Republic of Kenya. 
              Any disputes arising from these terms shall be resolved through the appropriate legal channels in Kenya.
            </p>
          </div>

          <div className="mt-12 text-center text-muted-foreground">
            <p>
              For any questions regarding these terms, please contact us at{" "}
              <a href="mailto:legal@rockwellafrica.com" className="text-primary hover:underline">
                legal@rockwellafrica.com
              </a>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
