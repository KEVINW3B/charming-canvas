import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import SettingsTab from "@/components/SettingsTab";
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
  Wallet, PiggyBank, TrendingUp, FileText, LogOut, Home, Bell, Loader2, Plus,
  ArrowUpRight, ArrowDownRight, Calendar, Megaphone, CreditCard, AlertCircle,
  CheckCircle, Clock, X, Settings, LayoutDashboard
} from "lucide-react";
import logo from "@/assets/logo.png";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

interface DashboardStats {
  totalInvestments: number;
  totalSavings: number;
  pendingLoans: number;
  approvedLoans: number;
  weeklyDeposits: number;
  loanEligible: boolean;
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
  interest_rate: number | null;
  created_at: string;
}

interface MemberNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvestments: 0, totalSavings: 0, pendingLoans: 0, approvedLoans: 0, weeklyDeposits: 0, loanEligible: false,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [weeklyDeposits, setWeeklyDeposits] = useState<WeeklyDeposit[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [myLoans, setMyLoans] = useState<LoanApplication[]>([]);
  const [notifications, setNotifications] = useState<MemberNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "savings" | "loans" | "deposits" | "meetings" | "notices" | "settings">("overview");
  const [showNotifications, setShowNotifications] = useState(false);
  
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
    if (user) { fetchDashboardData(); }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: investments } = await supabase.from("investments").select("amount").eq("user_id", user!.id);
      const totalInvestments = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
      const { data: savings } = await supabase.from("savings").select("amount").eq("user_id", user!.id);
      const totalSavings = savings?.reduce((sum, sav) => sum + Number(sav.amount), 0) || 0;
      const { data: loans } = await supabase.from("loan_applications").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
      const pendingLoans = loans?.filter(l => l.status === "pending").length || 0;
      const approvedLoans = loans?.filter(l => l.status === "approved").reduce((sum, l) => sum + Number(l.amount), 0) || 0;
      setMyLoans((loans as LoanApplication[]) || []);
      const { data: txns } = await supabase.from("transactions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(5);
      const { data: deposits } = await supabase.from("weekly_deposits").select("*").eq("user_id", user!.id).order("week_start", { ascending: false });
      const weeklyDepositsTotal = deposits?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
      setWeeklyDeposits((deposits as WeeklyDeposit[]) || []);
      const { data: meetingsData } = await supabase.from("meetings").select("*").gte("meeting_date", new Date().toISOString()).order("meeting_date", { ascending: true }).limit(5);
      setMeetings((meetingsData as Meeting[]) || []);
      const { data: noticesData } = await supabase.from("notices").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(5);
      setNotices((noticesData as Notice[]) || []);
      const { data: memberNotifications } = await supabase.from("member_notifications").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(10);
      setNotifications((memberNotifications as MemberNotification[]) || []);
      const { data: memberCode } = await supabase.from("member_codes").select("loan_eligible").eq("email", user!.email?.toLowerCase()).maybeSingle();
      setStats({ totalInvestments, totalSavings, pendingLoans, approvedLoans, weeklyDeposits: weeklyDepositsTotal, loanEligible: memberCode?.loan_eligible || false });
      setTransactions((txns as Transaction[]) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForLoan = async () => {
    if (!loanAmount || !loanReason) { toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" }); return; }
    try {
      const { error } = await supabase.from("loan_applications").insert({ user_id: user!.id, amount: parseFloat(loanAmount), reason: loanReason, status: "pending" });
      if (error) throw error;
      toast({ title: "Success", description: "Loan application submitted successfully" });
      setLoanAmount(""); setLoanReason(""); setShowLoanForm(false); fetchDashboardData();
    } catch (error) { toast({ title: "Error", description: "Failed to submit loan application", variant: "destructive" }); }
  };

  const handleRecordDeposit = async () => {
    if (!depositAmount) { toast({ title: "Error", description: "Please enter deposit amount", variant: "destructive" }); return; }
    const today = new Date();
    const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
    try {
      const { error } = await supabase.from("weekly_deposits").insert({ user_id: user!.id, amount: parseFloat(depositAmount), week_start: weekStart.toISOString().split('T')[0], week_end: weekEnd.toISOString().split('T')[0], status: "pending" });
      if (error) throw error;
      toast({ title: "Success", description: "Deposit recorded successfully. Pending confirmation." });
      setDepositAmount(""); setShowDepositForm(false); fetchDashboardData();
    } catch (error) { toast({ title: "Error", description: "Failed to record deposit", variant: "destructive" }); }
  };

  const handleSignOut = async () => { const { error } = await signOut(); if (error) { toast({ title: "Error", description: "Failed to sign out", variant: "destructive" }); } else { navigate("/"); } };
  const loanEligibility = stats.totalSavings * 3;
  const isEligibleForLoan = stats.loanEligible && stats.totalSavings >= 5000;
  const handleMarkNotificationRead = async (notificationId: string) => { try { await supabase.from("member_notifications").update({ is_read: true }).eq("id", notificationId); setNotifications(prev => prev.filter(n => n.id !== notificationId)); } catch (error) { console.error("Error marking notification read:", error); } };
  const unreadNotifications = notifications.filter(n => !n.is_read);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Savings", value: `KES ${stats.totalSavings.toLocaleString()}`, icon: PiggyBank, color: "text-primary", bgColor: "from-primary/20 to-primary/5", trend: "+4.2%" },
    { title: "Total Investments", value: `KES ${stats.totalInvestments.toLocaleString()}`, icon: TrendingUp, color: "text-accent", bgColor: "from-accent/20 to-accent/5", trend: "+6.8%" },
    { title: "Weekly Deposits", value: `KES ${stats.weeklyDeposits.toLocaleString()}`, icon: Wallet, color: "text-info", bgColor: "from-info/20 to-info/5", trend: "Active" },
    { title: "Loan Limit", value: `KES ${loanEligibility.toLocaleString()}`, icon: CreditCard, color: "text-success", bgColor: "from-success/20 to-success/5", trend: "3x savings" },
  ];

  const sidebarTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "savings", label: "Savings", icon: PiggyBank },
    { id: "loans", label: "Loans", icon: FileText },
    { id: "deposits", label: "Deposits", icon: Wallet },
    { id: "meetings", label: "Meetings", icon: Calendar },
    { id: "notices", label: "Notices", icon: Megaphone },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card/80 backdrop-blur-2xl border-r border-border/30 sticky top-0 h-screen">
        <div className="p-5 border-b border-border/30">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="RockwellAfrica SACCO" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-display text-sm font-bold text-gradient-gold block">RockwellAfrica</span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Member Portal</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {sidebarTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/10 shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "notices" && notices.length > 0 && (
                <span className="ml-auto w-5 h-5 bg-primary rounded-full text-[10px] flex items-center justify-center text-primary-foreground font-bold">{notices.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border/30 space-y-0.5">
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all">
              <Settings className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold">
                Welcome, <span className="text-gradient-gold">{user?.user_metadata?.first_name || "Member"}</span>
              </h1>
              <p className="text-xs text-muted-foreground">Your financial portfolio at a glance</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile nav */}
              <div className="md:hidden flex gap-1 overflow-x-auto">
                {sidebarTabs.slice(0, 4).map((tab) => (
                  <Button key={tab.id} variant={activeTab === tab.id ? "default" : "ghost"} size="sm" onClick={() => setActiveTab(tab.id as typeof activeTab)}>
                    <tab.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell className="w-5 h-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[10px] flex items-center justify-center text-accent-foreground font-bold">{unreadNotifications.length}</span>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-border"><h3 className="font-semibold text-sm">Notifications</h3></div>
                    {unreadNotifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">No new notifications</div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto">
                        {unreadNotifications.map((n) => (
                          <div key={n.id} className="p-3 border-b border-border/50 hover:bg-secondary/50">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{n.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                              </div>
                              <button onClick={() => handleMarkNotificationRead(n.id)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Link to="/"><Button variant="ghost" size="icon"><Home className="w-5 h-5" /></Button></Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* Important Notices */}
          {notices.filter(n => n.priority === 'urgent' || n.priority === 'high').length > 0 && activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              {notices.filter(n => n.priority === 'urgent' || n.priority === 'high').slice(0, 1).map(notice => (
                <div key={notice.id} className={`p-4 rounded-xl border ${notice.priority === 'urgent' ? 'bg-destructive/10 border-destructive/30' : 'bg-warning/10 border-warning/30'}`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${notice.priority === 'urgent' ? 'text-destructive' : 'text-warning'}`} />
                    <div><h3 className="font-semibold text-sm">{notice.title}</h3><p className="text-xs text-muted-foreground">{notice.content}</p></div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                  <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                    <Card className="bg-card border-border/50 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
                          <span className="text-xs text-success flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />{stat.trend}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="bg-card border-border/50">
                    <CardHeader><CardTitle className="font-display text-lg">Quick Actions</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                      <Dialog open={showDepositForm} onOpenChange={setShowDepositForm}>
                        <DialogTrigger asChild>
                          <Button className="h-20 flex-col gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl">
                            <Plus className="w-5 h-5" /><span className="text-xs font-semibold">Record Deposit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Record Weekly Deposit</DialogTitle><DialogDescription>Record your weekly savings deposit</DialogDescription></DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2"><Label>Amount (KES)</Label><Input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Enter amount" min="500" /><p className="text-xs text-muted-foreground">Minimum: KES 500</p></div>
                            <Button onClick={handleRecordDeposit} className="w-full">Submit Deposit</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={showLoanForm} onOpenChange={setShowLoanForm}>
                        <DialogTrigger asChild>
                          <Button className="h-20 flex-col gap-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 rounded-xl">
                            <FileText className="w-5 h-5" /><span className="text-xs font-semibold">Apply for Loan</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Apply for Loan</DialogTitle><DialogDescription>{isEligibleForLoan ? `Eligible for up to KES ${loanEligibility.toLocaleString()}` : !stats.loanEligible ? "Contact admin for loan access." : "Need min KES 5,000 savings"}</DialogDescription></DialogHeader>
                          {isEligibleForLoan ? (
                            <div className="space-y-4 py-4">
                              <div className="space-y-2"><Label>Amount (KES)</Label><Input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="Enter amount" max={loanEligibility} /></div>
                              <div className="space-y-2"><Label>Reason</Label><Textarea value={loanReason} onChange={(e) => setLoanReason(e.target.value)} placeholder="Why you need this loan..." /></div>
                              <Button onClick={handleApplyForLoan} className="w-full">Submit Application</Button>
                            </div>
                          ) : (
                            <div className="py-4 text-center text-muted-foreground"><AlertCircle className="w-12 h-12 mx-auto mb-4 text-warning" /><p className="text-sm">{!stats.loanEligible ? "Admin approval required." : "Build savings to KES 5,000+"}</p></div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button onClick={() => setActiveTab("meetings")} className="h-20 flex-col gap-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-xl">
                        <Calendar className="w-5 h-5" /><span className="text-xs font-semibold">Meetings</span>
                      </Button>
                      <Button onClick={() => setActiveTab("notices")} className="h-20 flex-col gap-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-xl relative">
                        <Megaphone className="w-5 h-5" /><span className="text-xs font-semibold">Notices</span>
                        {notices.length > 0 && <span className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full text-[10px] flex items-center justify-center text-accent-foreground font-bold">{notices.length}</span>}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="bg-card border-border/50">
                    <CardHeader><CardTitle className="font-display text-lg">Recent Transactions</CardTitle></CardHeader>
                    <CardContent>
                      {transactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground"><Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" /><p className="text-sm">No transactions yet</p></div>
                      ) : (
                        <div className="space-y-3">
                          {transactions.map((txn) => (
                            <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${txn.type === "credit" ? "bg-success/10" : "bg-destructive/10"}`}>
                                  {txn.type === "credit" ? <ArrowUpRight className="w-4 h-4 text-success" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
                                </div>
                                <div><p className="font-medium text-sm">{txn.description || "Transaction"}</p><p className="text-xs text-muted-foreground">{new Date(txn.created_at).toLocaleDateString()}</p></div>
                              </div>
                              <p className={`font-semibold text-sm ${txn.type === "credit" ? "text-success" : "text-destructive"}`}>{txn.type === "credit" ? "+" : "-"}KES {Number(txn.amount).toLocaleString()}</p>
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
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-card border-border/50">
                  <CardContent className="p-6">
                    <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
                      <PiggyBank className="w-10 h-10 text-primary mb-3" />
                      <p className="text-xs text-muted-foreground mb-1">Total Savings</p>
                      <p className="text-3xl font-bold text-primary">KES {stats.totalSavings.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/50">
                  <CardContent className="p-6">
                    <div className="p-5 rounded-xl bg-accent/10 border border-accent/20">
                      <TrendingUp className="w-10 h-10 text-accent mb-3" />
                      <p className="text-xs text-muted-foreground mb-1">Total Investments</p>
                      <p className="text-3xl font-bold text-accent">KES {stats.totalInvestments.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-card border-border/50">
                <CardHeader><CardTitle className="text-lg">Loan Eligibility</CardTitle></CardHeader>
                <CardContent>
                  <div className={`p-5 rounded-xl border ${stats.loanEligible ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'}`}>
                    <p className="text-sm text-muted-foreground mb-2">You can borrow up to 3x your savings</p>
                    <p className={`text-3xl font-bold ${stats.loanEligible ? 'text-success' : 'text-muted-foreground'}`}>KES {loanEligibility.toLocaleString()}</p>
                    {!stats.loanEligible && <p className="text-sm text-warning mt-2">Contact admin for loan access.</p>}
                    {stats.loanEligible && stats.totalSavings < 5000 && <p className="text-sm text-warning mt-2">Min KES 5,000 savings required</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Loans Tab */}
          {activeTab === "loans" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-xl font-semibold">My Loan Applications</h2>
                <Dialog open={showLoanForm} onOpenChange={setShowLoanForm}>
                  <DialogTrigger asChild><Button className="bg-primary text-primary-foreground" disabled={!isEligibleForLoan}><Plus className="w-4 h-4 mr-2" />Apply</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Apply for Loan</DialogTitle><DialogDescription>Eligible up to KES {loanEligibility.toLocaleString()}</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2"><Label>Amount (KES)</Label><Input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} max={loanEligibility} /></div>
                      <div className="space-y-2"><Label>Reason</Label><Textarea value={loanReason} onChange={(e) => setLoanReason(e.target.value)} /></div>
                      <Button onClick={handleApplyForLoan} className="w-full">Submit</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Card className="bg-card border-border/50">
                <CardContent className="pt-6">
                  {myLoans.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground"><FileText className="w-12 h-12 mx-auto mb-4 opacity-50" /><p className="text-sm">No loan applications yet</p></div>
                  ) : (
                    <div className="space-y-3">
                      {myLoans.map((loan) => (
                        <div key={loan.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xl font-bold text-primary">KES {Number(loan.amount).toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground mt-1">{loan.reason}</p>
                              <p className="text-xs text-muted-foreground mt-2">Applied: {new Date(loan.created_at).toLocaleDateString()}</p>
                              {loan.interest_rate && <p className="text-xs text-success mt-1">Interest: {loan.interest_rate}%</p>}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${loan.status === "pending" ? "bg-warning/10 text-warning" : loan.status === "approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
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
                <h2 className="font-display text-xl font-semibold">Weekly Deposits</h2>
                <Dialog open={showDepositForm} onOpenChange={setShowDepositForm}>
                  <DialogTrigger asChild><Button className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Record</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Record Weekly Deposit</DialogTitle><DialogDescription>Record your weekly savings</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2"><Label>Amount (KES)</Label><Input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} min="500" /><p className="text-xs text-muted-foreground">Minimum: KES 500</p></div>
                      <Button onClick={handleRecordDeposit} className="w-full">Submit</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Card className="bg-card border-border/50">
                <CardContent className="pt-6">
                  {weeklyDeposits.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground"><Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" /><p className="text-sm">No deposits yet</p></div>
                  ) : (
                    <div className="space-y-3">
                      {weeklyDeposits.map((deposit) => (
                        <div key={deposit.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                          <div className="flex justify-between items-center">
                            <div><p className="font-semibold text-primary">KES {Number(deposit.amount).toLocaleString()}</p><p className="text-sm text-muted-foreground">Week: {new Date(deposit.week_start).toLocaleDateString()} - {new Date(deposit.week_end).toLocaleDateString()}</p></div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${deposit.status === "pending" ? "bg-warning/10 text-warning" : deposit.status === "confirmed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{deposit.status}</span>
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
            <Card className="bg-card border-border/50">
              <CardHeader><CardTitle className="font-display text-lg">Upcoming Meetings</CardTitle></CardHeader>
              <CardContent>
                {meetings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground"><Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" /><p className="text-sm">No upcoming meetings</p></div>
                ) : (
                  <div className="space-y-3">
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <p className="text-sm text-primary mt-1">{new Date(meeting.meeting_date).toLocaleString()}</p>
                        {meeting.location && <p className="text-sm text-muted-foreground">{meeting.location}</p>}
                        {meeting.description && <p className="text-sm mt-2">{meeting.description}</p>}
                        {meeting.is_virtual && meeting.meeting_link && <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">Join Virtual Meeting →</a>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notices Tab */}
          {activeTab === "notices" && (
            <Card className="bg-card border-border/50">
              <CardHeader><CardTitle className="font-display text-lg">Notices & Announcements</CardTitle></CardHeader>
              <CardContent>
                {notices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground"><Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" /><p className="text-sm">No notices</p></div>
                ) : (
                  <div className="space-y-3">
                    {notices.map((notice) => (
                      <div key={notice.id} className={`p-4 rounded-xl border ${notice.priority === 'urgent' ? 'bg-destructive/10 border-destructive/30' : notice.priority === 'high' ? 'bg-warning/10 border-warning/30' : 'bg-secondary/50 border-border/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{notice.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${notice.priority === 'urgent' ? 'bg-destructive/20 text-destructive' : notice.priority === 'high' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>{notice.priority}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{notice.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">Posted: {new Date(notice.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && <SettingsTab user={user} toast={toast} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
