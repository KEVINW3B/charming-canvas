import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, Download, FileSpreadsheet, BookOpen, Shield, ClipboardList, Phone, Mail, MapPin, Building2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const documents = [
  {
    category: "Membership & Registration",
    items: [
      { title: "Membership Application Form", description: "Full admission form — personal info, next of kin, clan, county, occupation, and official use section", icon: ClipboardList, type: "PDF", size: "310 KB" },
      { title: "KYC / ID Verification Form", description: "Know Your Customer — attach National ID or Passport copy", icon: Shield, type: "PDF", size: "150 KB" },
      { title: "Nomination / Next of Kin Form", description: "Nominate beneficiaries for your SACCO contributions", icon: FileText, type: "PDF", size: "120 KB" },
      { title: "Account Opening Form", description: "Open a savings or investment account with RockwellAfrica SACCO", icon: FileText, type: "PDF", size: "180 KB" },
    ],
  },
  {
    category: "Loans & Finance",
    items: [
      { title: "Loan Application Form", description: "Apply for personal, business, or emergency loans — KES 150 processing fee", icon: FileSpreadsheet, type: "PDF", size: "320 KB" },
      { title: "Guarantor Form", description: "Loan guarantee agreement — must be signed by two guarantors", icon: Shield, type: "PDF", size: "195 KB" },
      { title: "Loan Repayment Schedule", description: "Sample repayment template with interest breakdown", icon: FileSpreadsheet, type: "XLSX", size: "85 KB" },
      { title: "Loan Clearance Form", description: "Request clearance certificate after full repayment", icon: FileText, type: "PDF", size: "110 KB" },
    ],
  },
  {
    category: "Reports, By-Laws & Policies",
    items: [
      { title: "SACCO By-Laws & Constitution", description: "Governance documents, member rights — KES 500 per copy", icon: Shield, type: "PDF", size: "1.1 MB" },
      { title: "Annual Report 2024", description: "Financial statements, auditor's report, and performance review", icon: BookOpen, type: "PDF", size: "2.4 MB" },
      { title: "Dividend Policy", description: "How dividends are calculated and distributed to members", icon: FileText, type: "PDF", size: "95 KB" },
      { title: "Privacy & Data Policy", description: "How we handle and protect your personal information", icon: Shield, type: "PDF", size: "140 KB" },
    ],
  },
];

const saccoFees = [
  { label: "Membership Fee", amount: "KES 500" },
  { label: "Monthly Savings (Min)", amount: "KES 1,500" },
  { label: "Capital Shares (Min)", amount: "KES 10,000" },
  { label: "Loan Application Form", amount: "KES 150" },
  { label: "Constitution Copy", amount: "KES 500" },
  { label: "Official Regalia", amount: "KES 1,500" },
  { label: "Lateness / Absenteeism Penalty", amount: "KES 250" },
  { label: "Cheque Leaf", amount: "KES 100" },
];

const groupFinanceFees = [
  { label: "Entrance Fee", amount: "KES 500" },
  { label: "Membership Fee", amount: "KES 500" },
  { label: "Profile File Fee", amount: "KES 400" },
  { label: "Monthly Savings (Min)", amount: "KES 1,500" },
  { label: "Capital Shares (Min)", amount: "KES 250,000" },
  { label: "Pass Book Fee", amount: "KES 500" },
  { label: "Loan Application Form", amount: "KES 75" },
  { label: "Loan Processing Fee", amount: "KES 100" },
  { label: "Constitution Fee", amount: "KES 300" },
  { label: "Annual Renewal Fee", amount: "KES 350" },
  { label: "Official Attire", amount: "KES 850" },
  { label: "Meeting Absence Penalty", amount: "KES 200" },
  { label: "Benevolent Fund (Monthly)", amount: "KES 750" },
  { label: "Christmas Boom (Daily Min)", amount: "KES 75" },
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
          <div className="absolute inset-0 mesh-gradient" />
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium uppercase tracking-wider mb-6">Resources Centre</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-6">
                Downloads & <span className="text-gradient-gold">Resources</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Access all the forms, documents, fee schedules, and payment details you need. Download, fill in, and submit to our admin office.
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
                className="mb-14"
              >
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-accent" />
                  {section.category}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.items.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIndex * 0.15 + index * 0.08 }}
                      className="glass-card p-5 group hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded bg-secondary border border-border/50">{item.type}</span>
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

        {/* Fee Schedules */}
        <section className="py-16 bg-secondary/20">
          <div className="container max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium uppercase tracking-wider mb-4">Fee Structure</span>
              <h2 className="font-display text-3xl font-bold">
                Sources of <span className="text-gradient-gold">Revenue</span>
              </h2>
              <p className="text-muted-foreground mt-3">Transparent breakdown of all membership and service fees</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* SACCO Fees */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">RockwellAfrica SACCO</h3>
                    <p className="text-xs text-muted-foreground">Savings & Credit Co-operative</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {saccoFees.map((fee) => (
                    <div key={fee.label} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                      <span className="text-sm text-muted-foreground">{fee.label}</span>
                      <span className="text-sm font-semibold text-primary">{fee.amount}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-xs font-semibold text-foreground mb-1">💳 Payment Details — Co-operative Bank</p>
                  <p className="text-xs text-muted-foreground">Paybill: <span className="text-primary font-bold">400200</span></p>
                  <p className="text-xs text-muted-foreground">Account: <span className="text-primary font-bold">01101086907002</span></p>
                </div>
              </motion.div>

              {/* Group Finance Fees */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Group Finance Investors</h3>
                    <p className="text-xs text-muted-foreground">Table Banking Division</p>
                  </div>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {groupFinanceFees.map((fee) => (
                    <div key={fee.label} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                      <span className="text-sm text-muted-foreground">{fee.label}</span>
                      <span className="text-sm font-semibold text-accent">{fee.amount}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/10">
                  <p className="text-xs font-semibold text-foreground mb-1">💳 Payment Details — Post Bank</p>
                  <p className="text-xs text-muted-foreground">Paybill: <span className="text-accent font-bold">200999</span></p>
                  <p className="text-xs text-muted-foreground">Account: <span className="text-accent font-bold">0001042229028</span></p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Admin Contact for Form Submission */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-gradient"
            >
              <div className="p-8 rounded-3xl">
                <div className="text-center mb-8">
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Submit Forms to <span className="text-gradient-gold">SACCO Admin</span>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    After downloading and filling out the forms, submit them through any of these channels:
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-secondary/50 border border-border/50 hover:border-primary/20 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold mb-1">WhatsApp / Call</p>
                    <p className="text-primary font-bold text-base">0724 936 774</p>
                    <p className="text-primary font-bold text-base">0768 830 338</p>
                    <p className="text-xs text-muted-foreground mt-1">Mon - Fri, 8AM - 5PM</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-secondary/50 border border-border/50 hover:border-primary/20 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold mb-1">Email</p>
                    <p className="text-primary font-bold text-sm">makosangessmbarari5@gmail.com</p>
                    <p className="text-xs text-muted-foreground mt-1">Response within 24hrs</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-secondary/50 border border-border/50 hover:border-primary/20 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold mb-1">SACCO CEO</p>
                    <p className="text-primary font-bold text-sm">Rev. Dr. George Makosa Ngessmbarare</p>
                    <p className="text-xs text-muted-foreground mt-1">Founder & Hon. Secretary</p>
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
                please call our admin at <span className="text-primary font-semibold">0724 936 774</span> or <span className="text-primary font-semibold">0768 830 338</span> for assistance.
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
