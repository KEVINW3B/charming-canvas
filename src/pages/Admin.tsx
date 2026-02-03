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
  Users, 
  Wallet, 
  TrendingUp, 
  FileText, 
  LogOut, 
  Home,
  Settings,
  Bell,
  Loader2,
  DollarSign,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from "lucide-react";
import logo from "@/assets/logo.png";

interface AdminStats {
  totalMembers: number;
  totalInvestments: number;
  totalSavings: number;
  pendingLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  totalLoanAmount: number;
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  totalInvestments: number;
  totalSavings: number;
}

interface LoanApplication {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const Admin = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalMembers: 0,
    totalInvestments: 0,
    totalSavings: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    totalLoanAmount: 0,
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "loans">("overview");
  
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminData();
    }
  }, [user, isAdmin]);

  const fetchAdminData = async () => {
    try {
      // Fetch all profiles (members)
      const { data: profiles } = await supabase.from("profiles").select("*");
      
      // Fetch all investments
      const { data: investments } = await supabase.from("investments").select("*");
      
      // Fetch all savings
      const { data: savings } = await supabase.from("savings").select("*");
      
      // Fetch all loan applications
      const { data: loanApps } = await supabase.from("loan_applications").select("*");

      const totalMembers = profiles?.length || 0;
      const totalInvestments = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
      const totalSavings = savings?.reduce((sum, sav) => sum + Number(sav.amount), 0) || 0;
      const pendingLoans = loanApps?.filter(l => l.status === "pending").length || 0;
      const approvedLoans = loanApps?.filter(l => l.status === "approved").length || 0;
      const rejectedLoans = loanApps?.filter(l => l.status === "rejected").length || 0;
      const totalLoanAmount = loanApps?.filter(l => l.status === "approved").reduce((sum, l) => sum + Number(l.amount), 0) || 0;

      setStats({
        totalMembers,
        totalInvestments,
        totalSavings,
        pendingLoans,
        approvedLoans,
        rejectedLoans,
        totalLoanAmount,
      });

      // Process members with their investments and savings
      const membersWithData = profiles?.map(profile => ({
        ...profile,
        totalInvestments: investments?.filter(i => i.user_id === profile.user_id).reduce((sum, i) => sum + Number(i.amount), 0) || 0,
        totalSavings: savings?.filter(s => s.user_id === profile.user_id).reduce((sum, s) => sum + Number(s.amount), 0) || 0,
      })) || [];

      setMembers(membersWithData);

      // Process loans with member info
      const loansWithProfiles = loanApps?.map(loan => ({
        ...loan,
        profile: profiles?.find(p => p.user_id === loan.user_id),
      })) || [];

      setLoans(loansWithProfiles as LoanApplication[]);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoanAction = async (loanId: string, action: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("loan_applications")
        .update({ status: action })
        .eq("id", loanId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Loan ${action} successfully`,
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update loan status",
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Investments",
      value: `KES ${stats.totalInvestments.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Savings",
      value: `KES ${stats.totalSavings.toLocaleString()}`,
      icon: PiggyBank,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Loans Disbursed",
      value: `KES ${stats.totalLoanAmount.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const loanStatCards = [
    {
      title: "Pending",
      value: stats.pendingLoans,
      icon: AlertCircle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Approved",
      value: stats.approvedLoans,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Rejected",
      value: stats.rejectedLoans,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
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
              Admin Panel
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                Member Portal
              </Button>
            </Link>
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
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">
            <span className="text-gradient-gold">Admin Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Manage members, investments, and financial services
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "members", label: "Members", icon: Users },
            { id: "loans", label: "Loan Applications", icon: FileText },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={activeTab === tab.id ? "bg-primary text-primary-foreground" : ""}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Loan Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display text-xl">Loan Applications Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {loanStatCards.map((stat, index) => (
                    <div key={stat.title} className={`p-4 rounded-xl ${stat.bgColor} text-center`}>
                      <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display text-xl">All Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No members registered yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Investments</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Savings</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 px-4 font-medium">
                            {member.first_name} {member.last_name}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{member.email}</td>
                          <td className="py-3 px-4 text-right text-primary">
                            KES {member.totalInvestments.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-accent">
                            KES {member.totalSavings.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(member.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Loans Tab */}
        {activeTab === "loans" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display text-xl">Loan Applications ({loans.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No loan applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loans.map((loan) => (
                    <div key={loan.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            {loan.profile?.first_name} {loan.profile?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{loan.profile?.email}</p>
                          <p className="text-sm mt-2">
                            <span className="text-muted-foreground">Amount:</span>{" "}
                            <span className="text-primary font-semibold">KES {Number(loan.amount).toLocaleString()}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Reason:</span> {loan.reason}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Applied: {new Date(loan.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {loan.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleLoanAction(loan.id, "approved")}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleLoanAction(loan.id, "rejected")}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              loan.status === "approved" 
                                ? "bg-green-500/10 text-green-500" 
                                : "bg-red-500/10 text-red-500"
                            }`}>
                              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                            </span>
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
      </main>
    </div>
  );
};

export default Admin;
