import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, Download, FileSpreadsheet, BookOpen, Shield, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const documents = [
  {
    category: "Membership",
    items: [
      { title: "Membership Application Form", description: "New member registration form", icon: ClipboardList, type: "PDF" },
      { title: "Account Opening Form", description: "Open a savings or investment account", icon: FileText, type: "PDF" },
      { title: "Nomination Form", description: "Nominate your beneficiaries", icon: FileText, type: "PDF" },
    ],
  },
  {
    category: "Loans",
    items: [
      { title: "Loan Application Form", description: "Apply for any of our loan products", icon: FileSpreadsheet, type: "PDF" },
      { title: "Guarantor Form", description: "Loan guarantee agreement", icon: Shield, type: "PDF" },
      { title: "Loan Repayment Schedule", description: "Sample repayment schedule template", icon: FileSpreadsheet, type: "XLSX" },
    ],
  },
  {
    category: "Reports & Policies",
    items: [
      { title: "Annual Report 2024", description: "Financial statements and performance review", icon: BookOpen, type: "PDF" },
      { title: "By-Laws & Constitution", description: "SACCO governance documents", icon: Shield, type: "PDF" },
      { title: "Dividend Policy", description: "How dividends are calculated and distributed", icon: FileText, type: "PDF" },
    ],
  },
];

const Downloads = () => {
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
              <span className="text-primary text-sm font-medium uppercase tracking-wider">Resources</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Downloads & <span className="text-gradient-gold">Resources</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Access all the forms, documents, and resources you need. Download, print, and submit at your convenience.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Documents */}
        <section className="py-16">
          <div className="container max-w-5xl">
            {documents.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.15 }}
                className="mb-12"
              >
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  {section.category}
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {section.items.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIndex * 0.15 + index * 0.08 }}
                      className="glass-card p-5 group hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">{item.type}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Download className="w-3.5 h-3.5 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Note */}
        <section className="py-8">
          <div className="container max-w-3xl">
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Need help?</strong> If you have trouble downloading or filling out any form, 
                please visit our nearest branch or contact our support team for assistance.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Downloads;
