import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Calculator, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const loanProducts = [
  { name: "Normal Loan", maxMultiplier: 3, maxTerm: 48, rate: 12, description: "Up to 3x your savings" },
  { name: "Emergency Loan", maxMultiplier: 1, maxTerm: 12, rate: 12, description: "Quick access, up to 1x savings" },
  { name: "Development Loan", maxMultiplier: 4, maxTerm: 60, rate: 14, description: "For projects, up to 4x savings" },
  { name: "School Fees Loan", maxMultiplier: 2, maxTerm: 12, rate: 10, description: "Education financing, up to 2x savings" },
];

const LoanCalculator = () => {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [rate, setRate] = useState("12");
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const n = parseInt(months);
    const r = parseFloat(rate) / 100 / 12;
    if (!P || !n || !r) return;

    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - P;
    setResult({ monthly, total, interest });
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
              <span className="text-primary text-sm font-medium uppercase tracking-wider">Financial Tools</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Loan <span className="text-gradient-gold">Calculator</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Plan your finances with our easy-to-use loan calculator. Get instant estimates on monthly repayments, total cost, and interest.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glass-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-display">
                      <Calculator className="w-6 h-6 text-primary" />
                      Calculate Your Loan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Loan Amount (KES)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 500,000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-secondary/50 border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Repayment Period (Months)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 24"
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                        className="bg-secondary/50 border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Interest Rate (% per annum)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 12"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="bg-secondary/50 border-border"
                      />
                    </div>
                    <Button onClick={calculate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Calculate Repayment
                    </Button>
                  </CardContent>
                </Card>

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-4 mt-6"
                  >
                    {[
                      { label: "Monthly Payment", value: result.monthly, icon: Calendar },
                      { label: "Total Payable", value: result.total, icon: DollarSign },
                      { label: "Total Interest", value: result.interest, icon: TrendingUp },
                    ].map((item) => (
                      <Card key={item.label} className="glass-card border-border text-center p-4">
                        <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="font-display font-bold text-lg text-primary">
                          KES {item.value.toLocaleString("en-KE", { maximumFractionDigits: 0 })}
                        </p>
                      </Card>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Loan Products */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="font-display text-xl font-semibold mb-4">Our Loan Products</h3>
                {loanProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="glass-card p-5 cursor-pointer hover:border-primary/20 transition-colors"
                    onClick={() => setRate(String(product.rate))}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{product.name}</h4>
                      <span className="text-primary font-display font-bold text-sm">{product.rate}% p.a.</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Max term: {product.maxTerm} months</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8">
          <div className="container max-w-3xl">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This calculator provides estimates only. Actual loan terms, rates, and repayments may vary based on your financial profile, savings balance, and approval status. Contact us for a personalized quote.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LoanCalculator;
