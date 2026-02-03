import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Settings,
  Bell,
  Loader2,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import logo from "@/assets/logo.png";

interface DashboardStats {
  totalInvestments: number;
  totalSavings: number;
  pendingLoans: number;
  approvedLoans: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string | null;
  created_at: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvestments: 0,
    totalSavings: 0,
    pendingLoans: 0,
    approvedLoans: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
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
        .select("status, amount")
        .eq("user_id", user!.id);

      const pendingLoans = loans?.filter(l => l.status === "pending").length || 0;
      const approvedLoans = loans?.filter(l => l.status === "approved").reduce((sum, l) => sum + Number(l.amount), 0) || 0;

      // Fetch recent transactions
      const { data: txns } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({ totalInvestments, totalSavings, pendingLoans, approvedLoans });
      setTransactions((txns as Transaction[]) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Investments",
      value: `KES ${stats.totalInvestments.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Savings",
      value: `KES ${stats.totalSavings.toLocaleString()}`,
      icon: PiggyBank,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Pending Loans",
      value: stats.pendingLoans.toString(),
      icon: FileText,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Approved Loans",
      value: `KES ${stats.approvedLoans.toLocaleString()}`,
      icon: Wallet,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
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
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
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
                <Button className="h-20 flex-col gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">New Investment</span>
                </Button>
                <Button className="h-20 flex-col gap-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20">
                  <PiggyBank className="w-5 h-5" />
                  <span className="text-sm">Add Savings</span>
                </Button>
                <Button className="h-20 flex-col gap-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">Apply for Loan</span>
                </Button>
                <Button className="h-20 flex-col gap-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border">
                  <User className="w-5 h-5" />
                  <span className="text-sm">My Profile</span>
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
      </main>
    </div>
  );
};

export default Dashboard;
