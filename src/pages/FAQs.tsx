import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HelpCircle, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      category: "Membership",
      questions: [
        {
          question: "How do I become a member of RockwellAfrica SACCO?",
          answer: "To become a member, you need to contact our office or express interest through our website. An admin will then add you to the system, authorize your email, and send you a unique login code to access the member portal.",
        },
        {
          question: "What are the membership requirements?",
          answer: "You must be at least 18 years old, provide valid identification (National ID or Passport), and complete the registration documents provided by our office. All new members receive an orientation session.",
        },
        {
          question: "Is there a membership fee?",
          answer: "Yes, there is a one-time registration fee and minimum share capital requirement. Contact our office for current rates and payment options.",
        },
        {
          question: "Can I terminate my membership?",
          answer: "Yes, you can voluntarily withdraw from the SACCO by submitting a written request. However, all outstanding loans must be cleared before your savings can be refunded.",
        },
      ],
    },
    {
      category: "Savings",
      questions: [
        {
          question: "What types of savings accounts are available?",
          answer: "We offer regular savings accounts, fixed deposit accounts, and goal-based savings (education, holiday, emergency fund). Each has different interest rates and terms.",
        },
        {
          question: "What is the minimum savings amount?",
          answer: "The minimum weekly deposit is KES 500. You can save more than this amount at any time. Regular savings help you qualify for larger loans.",
        },
        {
          question: "How is interest calculated on my savings?",
          answer: "Interest is calculated monthly on your average balance and credited to your account at the end of each financial year. Current rates are displayed in your member portal.",
        },
        {
          question: "Can I withdraw my savings anytime?",
          answer: "Regular savings can be withdrawn with 7 days notice. Fixed deposits have lock-in periods, and early withdrawal may incur penalties.",
        },
      ],
    },
    {
      category: "Loans",
      questions: [
        {
          question: "What types of loans do you offer?",
          answer: "We offer emergency loans, development loans, school fees loans, and business loans. Each has different terms, interest rates, and eligibility requirements.",
        },
        {
          question: "How much can I borrow?",
          answer: "Loan amounts are based on your savings history, repayment capacity, and guarantor availability. Generally, you can borrow up to 3 times your savings balance.",
        },
        {
          question: "What is the interest rate on loans?",
          answer: "Our loan interest rates are competitive and vary by loan type. Current rates range from 12% to 18% per annum on reducing balance. Check the portal for current rates.",
        },
        {
          question: "How long does loan approval take?",
          answer: "Emergency loans are processed within 24-48 hours. Regular loans typically take 3-5 working days depending on the amount and required documentation.",
        },
        {
          question: "What happens if I miss a loan repayment?",
          answer: "Late payments incur a penalty fee. Continued non-payment may affect your guarantors and your ability to access future loans. Contact us early if you're facing difficulties.",
        },
      ],
    },
    {
      category: "Member Portal",
      questions: [
        {
          question: "How do I access the member portal?",
          answer: "After your membership is approved by an admin, you'll receive an email with your login credentials. Use your registered email and the provided login code to access the portal.",
        },
        {
          question: "I forgot my login credentials. What do I do?",
          answer: "Use the 'Forgot Password' option on the login page to reset your password. If you've forgotten your login code, contact the admin to resend it.",
        },
        {
          question: "What can I do on the member portal?",
          answer: "You can view your savings balance, track weekly deposits, check loan eligibility, apply for loans, view meeting schedules, and receive important notices.",
        },
        {
          question: "Is my information secure on the portal?",
          answer: "Yes, we use industry-standard encryption and security measures to protect your data. All connections are secured with SSL, and we follow strict data protection protocols.",
        },
      ],
    },
    {
      category: "Meetings & Events",
      questions: [
        {
          question: "How often are member meetings held?",
          answer: "We hold monthly member meetings, quarterly review meetings, and an Annual General Meeting (AGM). Meeting schedules are posted on the portal and sent via email.",
        },
        {
          question: "Are meetings mandatory?",
          answer: "While not all meetings are mandatory, regular participation is encouraged. The AGM is particularly important for voting on key decisions and electing officials.",
        },
        {
          question: "Can meetings be attended virtually?",
          answer: "Yes, we offer virtual attendance options for most meetings. Links are shared through the member portal before each meeting.",
        },
      ],
    },
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

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
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Help Center</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Frequently Asked Questions</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-secondary/50 border-border"
            />
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFAQs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <h2 className="font-display text-2xl font-semibold mb-4 text-gradient-gold">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.category}-${index}`}
                      className="glass-card rounded-xl border-border/50 overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/30">
                        <span className="text-left font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No questions found matching your search.</p>
            </div>
          )}

          <div className="mt-12 glass-card p-8 rounded-2xl text-center">
            <h2 className="font-display text-xl font-semibold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQs;
