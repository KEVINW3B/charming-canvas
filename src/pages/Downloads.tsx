import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, Download, FileSpreadsheet, BookOpen, Shield, ClipboardList, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const documents = [
  {
    category: "Membership",
    items: [
      { title: "Membership Application Form", description: "New member registration form — fill in personal details, next of kin, and employment info", icon: ClipboardList, type: "PDF", size: "245 KB" },
      { title: "Account Opening Form", description: "Open a savings or investment account with RockwellAfrica SACCO", icon: FileText, type: "PDF", size: "180 KB" },
      { title: "Nomination Form", description: "Nominate your beneficiaries for your SACCO contributions", icon: FileText, type: "PDF", size: "120 KB" },
      { title: "KYC / ID Verification Form", description: "Know Your Customer form for identity verification", icon: Shield, type: "PDF", size: "150 KB" },
    ],
  },
  {
    category: "Loans",
    items: [
      { title: "Loan Application Form", description: "Apply for any of our loan products — personal, business, or emergency", icon: FileSpreadsheet, type: "PDF", size: "320 KB" },
      { title: "Guarantor Form", description: "Loan guarantee agreement — must be signed by two guarantors", icon: Shield, type: "PDF", size: "195 KB" },
      { title: "Loan Repayment Schedule", description: "Sample repayment schedule template with interest breakdown", icon: FileSpreadsheet, type: "XLSX", size: "85 KB" },
      { title: "Loan Clearance Form", description: "Request for loan clearance certificate after full repayment", icon: FileText, type: "PDF", size: "110 KB" },
    ],
  },
  {
    category: "Reports & Policies",
    items: [
      { title: "Annual Report 2024", description: "Financial statements, auditor's report, and performance review", icon: BookOpen, type: "PDF", size: "2.4 MB" },
      { title: "By-Laws & Constitution", description: "SACCO governance documents and member rights", icon: Shield, type: "PDF", size: "1.1 MB" },
      { title: "Dividend Policy", description: "How dividends are calculated and distributed to members", icon: FileText, type: "PDF", size: "95 KB" },
      { title: "Privacy & Data Policy", description: "How we handle and protect your personal information", icon: Shield, type: "PDF", size: "140 KB" },
    ],
  },
];

const Downloads = () => {
  const { toast } = useToast();

  const handleDownload = (title: string) => {
    toast({
      title: "Download Started",
      description: `${title} is being downloaded. Once filled, submit to the admin contact below.`,
    });
  };

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
                Access all the forms, documents, and resources you need. Download, fill in, and submit to our admin office.
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
                <div className="grid md:grid-cols-2 gap-4">
                  {section.items.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIndex * 0.15 + index * 0.08 }}
                      className="glass-card p-5 group hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded bg-secondary">{item.type}</span>
                              <span className="text-xs text-muted-foreground">{item.size}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10 font-semibold"
                              onClick={() => handleDownload(item.title)}
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

        {/* Admin Contact for Form Submission */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-gradient"
            >
              <div className="p-8 rounded-3xl">
                <div className="text-center mb-6">
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Where to Submit <span className="text-gradient-gold">Filled Forms</span>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    After downloading and filling out the forms, submit them to the SACCO admin through any of the following channels:
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/50">
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-semibold mb-1">WhatsApp / Call</p>
                    <p className="text-primary font-bold text-lg">+254 700 000 000</p>
                    <p className="text-xs text-muted-foreground mt-1">Mon - Fri, 8AM - 5PM</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/50">
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-semibold mb-1">Email</p>
                    <p className="text-primary font-bold text-sm">admin@rockwellafrica.co.ke</p>
                    <p className="text-xs text-muted-foreground mt-1">Response within 24hrs</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/50">
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-semibold mb-1">Visit Our Office</p>
                    <p className="text-primary font-bold text-sm">Nairobi, Kenya</p>
                    <p className="text-xs text-muted-foreground mt-1">Walk-in: Mon - Fri</p>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">📋 Important:</strong> Ensure all forms are filled completely and signed before submission. 
                    Incomplete forms will be returned. Attach a copy of your National ID or Passport.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Help Note */}
        <section className="py-8">
          <div className="container max-w-3xl">
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Need help?</strong> If you have trouble downloading or filling out any form, 
                please call our admin at <span className="text-primary font-semibold">+254 700 000 000</span> or visit our nearest branch for assistance.
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
