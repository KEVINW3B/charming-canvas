import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Wallet, 
  PiggyBank, 
  TrendingUp, 
  FileText, 
  LogOut, 
  User, 
  Home,
  Bell,
  Loader2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Megaphone,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import logo from "@/assets/logo.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DashboardStats {
  totalInvestments: number;
  totalSavings: number;
  pendingLoans: number;
  approvedLoans: number;
  weeklyDeposits: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string | null;
  created_at: string;
}

interface WeeklyDeposit {
  id: string;
  amount: number;
  week_start: string;
  week_end: string;
  status: string;
  created_at: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meeting_date: string;
  location: string | null;
  is_virtual: boolean;
  meeting_link: string | null;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: string;
  created_at: string;
}

interface LoanApplication {
  id: string;
  amount: number;
  reason: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvestments: 0,
    totalSavings: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    weeklyDeposits: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [weeklyDeposits, setWeeklyDeposits] = useState<WeeklyDeposit[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [myLoans, setMyLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "savings" | "loans" | "deposits" | "meetings" | "notices">("overview");
  
  // Form states
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanReason, setLoanReason] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch investments
      const { data: investments } = await supabase
        .from("investments")
        .select("amount")
        .eq("user_id", user!.id);

      const totalInvestments = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

      // Fetch savings
      const { data: savings } = await supabase
        .from("savings")
        .select("amount")
        .eq("user_id", user!.id);

      const totalSavings = savings?.reduce((sum, sav) => sum + Number(sav.amount), 0) || 0;

      // Fetch loan applications
      const { data: loans } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      const pendingLoans = loans?.filter(l => l.status === "pending").length || 0;
      const approvedLoans = loans?.filter(l => l.status === "approved").reduce((sum, l) => sum + Number(l.amount), 0) || 0;
      setMyLoans((loans as LoanApplication[]) || []);

      // Fetch recent transactions
      const { data: txns } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch weekly deposits
      const { data: deposits } = await supabase
        .from("weekly_deposits")
        .select("*")
        .eq("user_id", user!.id)
        .order("week_start", { ascending: false });

      const weeklyDepositsTotal = deposits?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
      setWeeklyDeposits((deposits as WeeklyDeposit[]) || []);

      // Fetch upcoming meetings
      const { data: meetingsData } = await supabase
        .from("meetings")
        .select("*")
        .gte("meeting_date", new Date().toISOString())
        .order("meeting_date", { ascending: true })
        .limit(5);

      setMeetings((meetingsData as Meeting[]) || []);

      // Fetch active notices
      const { data: noticesData } = await supabase
        .from("notices")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5);

      setNotices((noticesData as Notice[]) || []);

      setStats({ totalInvestments, totalSavings, pendingLoans, approvedLoans, weeklyDeposits: weeklyDepositsTotal });
      setTransactions((txns as Transaction[]) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForLoan = async () => {
    if (!loanAmount || !loanReason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("loan_applications").insert({
        user_id: user!.id,
        amount: parseFloat(loanAmount),
        reason: loanReason,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Loan application submitted successfully",
      });

      setLoanAmount("");
      setLoanReason("");
      setShowLoanForm(false);
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit loan application",
        variant: "destructive",
      });
    }
  };

  const handleRecordDeposit = async () => {
    if (!depositAmount) {
      toast({
        title: "Error",
        description: "Please enter deposit amount",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    try {
      const { error } = await supabase.from("weekly_deposits").insert({
        user_id: user!.id,
        amount: parseFloat(depositAmount),
        week_start: weekStart.toISOString().split('T')[0],
        week_end: weekEnd.toISOString().split('T')[0],
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deposit recorded successfully. Pending confirmation.",
      });

      setDepositAmount("");
      setShowDepositForm(false);
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record deposit",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  // Calculate loan eligibility (3x savings)
  const loanEligibility = stats.totalSavings * 3;
  const isEligibleForLoan = stats.totalSavings >= 5000; // Minimum savings requirement

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Savings", value: `KES ${stats.totalSavings.toLocaleString()}`, icon: PiggyBank, color: "text-accent", bgColor: "bg-accent/10" },
    { title: "Total Investments", value: `KES ${stats.totalInvestments.toLocaleString()}`, icon: TrendingUp, color: "text-primary", bgColor: "bg-primary/10" },
    { title: "Weekly Deposits", value: `KES ${stats.weeklyDeposits.toLocaleString()}`, icon: Wallet, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Loan Limit", value: `KES ${loanEligibility.toLocaleString()}`, icon: CreditCard, color: "text-green-500", bgColor: "bg-green-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="RockwellAfrica SACCO" className="w-10 h-10 object-contain" />
            <span className="font-display text-lg font-bold text-gradient-gold hidden sm:block">
              Member Portal
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                  Admin Panel
                </Button>
              </Link>
            )}
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {notices.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center">
                  {notices.length}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">
            Welcome back, <span className="text-gradient-gold">{user?.user_metadata?.first_name || "Member"}</span>
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your financial portfolio
          </p>
        </motion.div>

        {/* Important Notices */}
        {notices.filter(n => n.priority === 'urgent' || n.priority === 'high').length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {notices.filter(n => n.priority === 'urgent' || n.priority === 'high').slice(0, 1).map(notice => (
              <div key={notice.id} className={`p-4 rounded-xl border ${
                notice.priority === 'urgent' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${notice.priority === 'urgent' ? 'text-red-500' : 'text-yellow-500'}`} />
                  <div>
                    <h3 className="font-semibold">{notice.title}</h3>
                    <p className="text-sm text-muted-foreground">{notice.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "savings", label: "Savings", icon: PiggyBank },
            { id: "loans", label: "Loans", icon: FileText },
            { id: "deposits", label: "Weekly Deposits", icon: Wallet },
            { id: "meetings", label: "Meetings", icon: Calendar },
            { id: "notices", label: "Notices", icon: Megaphone },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={activeTab === tab.id ? "bg-primary text-primary-foreground" : ""}
              size="sm"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-card hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions & Transactions */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <Dialog open={showDepositForm} onOpenChange={setShowDepositForm}>
                      <DialogTrigger asChild>
                        <Button className="h-20 flex-col gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                          <Plus className="w-5 h-5" />
                          <span className="text-sm">Record Deposit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Record Weekly Deposit</DialogTitle>
                          <DialogDescription>
                            Record your weekly savings deposit
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Amount (KES)</Label>
                            <Input
                              type="number"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              placeholder="Enter amount"
                              min="500"
                            />
                            <p className="text-xs text-muted-foreground">Minimum: KES 500</p>
                          </div>
                          <Button onClick={handleRecordDeposit} className="w-full">
                            Submit Deposit
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showLoanForm} onOpenChange={setShowLoanForm}>
                      <DialogTrigger asChild>
                        <Button className="h-20 flex-col gap-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20">
                          <FileText className="w-5 h-5" />
                          <span className="text-sm">Apply for Loan</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply for Loan</DialogTitle>
                          <DialogDescription>
                            {isEligibleForLoan 
                              ? `You are eligible for up to KES ${loanEligibility.toLocaleString()}`
                              : "You need minimum KES 5,000 in savings to apply for a loan"
                            }
                          </DialogDescription>
                        </DialogHeader>
                        {isEligibleForLoan ? (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Amount (KES)</Label>
                              <Input
                                type="number"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                placeholder="Enter amount"
                                max={loanEligibility}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Reason for Loan</Label>
                              <Textarea
                                value={loanReason}
                                onChange={(e) => setLoanReason(e.target.value)}
                                placeholder="Describe why you need this loan..."
                              />
                            </div>
                            <Button onClick={handleApplyForLoan} className="w-full">
                              Submit Application
                            </Button>
                          </div>
                        ) : (
                          <div className="py-4 text-center text-muted-foreground">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                            <p>Build your savings to qualify for loans</p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button 
                      onClick={() => setActiveTab("meetings")} 
                      className="h-20 flex-col gap-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                    >
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">View Meetings</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("notices")}
                      className="h-20 flex-col gap-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border relative"
                    >
                      <Megaphone className="w-5 h-5" />
                      <span className="text-sm">Notices</span>
                      {notices.length > 0 && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center">
                          {notices.length}
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No transactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {transactions.map((txn) => (
                          <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${txn.type === "credit" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                                {txn.type === "credit" ? (
                                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                                ) : (
                                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{txn.description || "Transaction"}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(txn.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className={`font-semibold ${txn.type === "credit" ? "text-green-500" : "text-red-500"}`}>
                              {txn.type === "credit" ? "+" : "-"}KES {Number(txn.amount).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}

        {/* Savings Tab */}
        {activeTab === "savings" && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display text-xl">Your Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-accent/10 border border-accent/20">
                    <PiggyBank className="w-12 h-12 text-accent mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Total Savings</p>
                    <p className="text-4xl font-bold text-accent">KES {stats.totalSavings.toLocaleString()}</p>
                  </div>
                  <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
                    <TrendingUp className="w-12 h-12 text-primary mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Total Investments</p>
                    <p className="text-4xl font-bold text-primary">KES {stats.totalInvestments.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Loan Eligibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-2">You can borrow up to 3x your savings</p>
                  <p className="text-3xl font-bold text-green-500">KES {loanEligibility.toLocaleString()}</p>
                  {!isEligibleForLoan && (
                    <p className="text-sm text-yellow-500 mt-2">
                      Minimum KES 5,000 savings required to apply for loans
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === "loans" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl font-semibold">My Loan Applications</h2>
              <Dialog open={showLoanForm} onOpenChange={setShowLoanForm}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground" disabled={!isEligibleForLoan}>
                    <Plus className="w-4 h-4 mr-2" />
                    Apply for Loan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply for Loan</DialogTitle>
                    <DialogDescription>
                      You are eligible for up to KES {loanEligibility.toLocaleString()}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Amount (KES)</Label>
                      <Input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder="Enter amount"
                        max={loanEligibility}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Loan</Label>
                      <Textarea
                        value={loanReason}
                        onChange={(e) => setLoanReason(e.target.value)}
                        placeholder="Describe why you need this loan..."
                      />
                    </div>
                    <Button onClick={handleApplyForLoan} className="w-full">
                      Submit Application
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="glass-card">
              <CardContent className="pt-6">
                {myLoans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No loan applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myLoans.map((loan) => (
                      <div key={loan.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-2xl font-bold text-primary">KES {Number(loan.amount).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground mt-1">{loan.reason}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Applied: {new Date(loan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            loan.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                            loan.status === "approved" ? "bg-green-500/10 text-green-500" :
                            "bg-red-500/10 text-red-500"
                          }`}>
                            {loan.status === "pending" && <Clock className="w-3 h-3 inline mr-1" />}
                            {loan.status === "approved" && <CheckCircle className="w-3 h-3 inline mr-1" />}
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Weekly Deposits Tab */}
        {activeTab === "deposits" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl font-semibold">Weekly Deposits</h2>
              <Dialog open={showDepositForm} onOpenChange={setShowDepositForm}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Record Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Weekly Deposit</DialogTitle>
                    <DialogDescription>
                      Record your weekly savings deposit
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Amount (KES)</Label>
                      <Input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="500"
                      />
                      <p className="text-xs text-muted-foreground">Minimum: KES 500</p>
                    </div>
                    <Button onClick={handleRecordDeposit} className="w-full">
                      Submit Deposit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="glass-card">
              <CardContent className="pt-6">
                {weeklyDeposits.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No deposits recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {weeklyDeposits.map((deposit) => (
                      <div key={deposit.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-primary">KES {Number(deposit.amount).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              Week: {new Date(deposit.week_start).toLocaleDateString()} - {new Date(deposit.week_end).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            deposit.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                            deposit.status === "confirmed" ? "bg-green-500/10 text-green-500" :
                            "bg-red-500/10 text-red-500"
                          }`}>
                            {deposit.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === "meetings" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display text-xl">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {meetings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming meetings scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <p className="text-sm text-primary mt-1">
                            {new Date(meeting.meeting_date).toLocaleString()}
                          </p>
                          {meeting.location && (
                            <p className="text-sm text-muted-foreground">{meeting.location}</p>
                          )}
                          {meeting.description && (
                            <p className="text-sm mt-2">{meeting.description}</p>
                          )}
                          {meeting.is_virtual && meeting.meeting_link && (
                            <a 
                              href={meeting.meeting_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline mt-2 inline-block"
                            >
                              Join Virtual Meeting →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notices Tab */}
        {activeTab === "notices" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display text-xl">Notices & Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              {notices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notices at this time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div key={notice.id} className={`p-4 rounded-xl border ${
                      notice.priority === 'urgent' ? 'bg-red-500/10 border-red-500/30' :
                      notice.priority === 'high' ? 'bg-yellow-500/10 border-yellow-500/30' :
                      'bg-secondary/50 border-border/50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{notice.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          notice.priority === 'urgent' ? 'bg-red-500/20 text-red-500' :
                          notice.priority === 'high' ? 'bg-yellow-500/20 text-yellow-500' :
                          notice.priority === 'low' ? 'bg-muted text-muted-foreground' :
                          'bg-primary/20 text-primary'
                        }`}>
                          {notice.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notice.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Posted: {new Date(notice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
