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
  Users, 
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
  BarChart3,
  Plus,
  UserPlus,
  Send,
  Calendar,
  Megaphone,
  Copy,
  Search,
  Trash2,
  Edit,
  Percent
} from "lucide-react";
import logo from "@/assets/logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminStats {
  totalMembers: number;
  totalInvestments: number;
  totalSavings: number;
  pendingLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  totalLoanAmount: number;
  pendingMembers: number;
}

interface MemberCode {
  id: string;
  email: string;
  login_code: string;
  is_authorized: boolean;
  first_name: string;
  last_name: string;
  phone: string | null;
  created_at: string;
  authorized_at: string | null;
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
  interest_rate: number | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
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
  is_active: boolean;
  created_at: string;
}

const generateLoginCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const Admin = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalMembers: 0,
    totalInvestments: 0,
    totalSavings: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    totalLoanAmount: 0,
    pendingMembers: 0,
  });
  const [memberCodes, setMemberCodes] = useState<MemberCode[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "loans" | "meetings" | "notices" | "finances">("overview");
  
  // Form states
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [newMember, setNewMember] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [newMeeting, setNewMeeting] = useState({ title: "", description: "", date: "", location: "", isVirtual: false, link: "" });
  const [newNotice, setNewNotice] = useState({ title: "", content: "", priority: "normal" });
  
  // Search and edit states
  const [memberSearch, setMemberSearch] = useState("");
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [approvingLoan, setApprovingLoan] = useState<LoanApplication | null>(null);
  const [interestRate, setInterestRate] = useState("10");
  
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // TEMPORARY: Bypassing auth for testing - remove this later and uncomment below
  // useEffect(() => {
  //   if (!authLoading) {
  //     if (!user) {
  //       navigate("/auth");
  //     } else if (!isAdmin) {
  //       toast({
  //         title: "Access Denied",
  //         description: "You don't have permission to access the admin panel.",
  //         variant: "destructive",
  //       });
  //       navigate("/dashboard");
  //     }
  //   }
  // }, [user, isAdmin, authLoading, navigate, toast]);

  useEffect(() => {
    // TEMPORARY: Fetch data without auth check
      fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch member codes
      const { data: codes } = await supabase.from("member_codes").select("*").order("created_at", { ascending: false });
      setMemberCodes((codes as MemberCode[]) || []);

      // Fetch all profiles (members)
      const { data: profiles } = await supabase.from("profiles").select("*");
      
      // Fetch all investments
      const { data: investments } = await supabase.from("investments").select("*");
      
      // Fetch all savings
      const { data: savings } = await supabase.from("savings").select("*");
      
      // Fetch all loan applications
      const { data: loanApps } = await supabase.from("loan_applications").select("*");

      // Fetch meetings
      const { data: meetingsData } = await supabase.from("meetings").select("*").order("meeting_date", { ascending: true });
      setMeetings((meetingsData as Meeting[]) || []);

      // Fetch notices
      const { data: noticesData } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
      setNotices((noticesData as Notice[]) || []);

      const totalMembers = profiles?.length || 0;
      const totalInvestments = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
      const totalSavings = savings?.reduce((sum, sav) => sum + Number(sav.amount), 0) || 0;
      const pendingLoans = loanApps?.filter(l => l.status === "pending").length || 0;
      const approvedLoans = loanApps?.filter(l => l.status === "approved").length || 0;
      const rejectedLoans = loanApps?.filter(l => l.status === "rejected").length || 0;
      const totalLoanAmount = loanApps?.filter(l => l.status === "approved").reduce((sum, l) => sum + Number(l.amount), 0) || 0;
      const pendingMembers = codes?.filter(c => !c.is_authorized).length || 0;

      setStats({
        totalMembers,
        totalInvestments,
        totalSavings,
        pendingLoans,
        approvedLoans,
        rejectedLoans,
        totalLoanAmount,
        pendingMembers,
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

  const handleAddMember = async () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const loginCode = generateLoginCode();

    try {
      const { error } = await supabase.from("member_codes").insert({
        email: newMember.email.toLowerCase().trim(),
        login_code: loginCode,
        first_name: newMember.firstName,
        last_name: newMember.lastName,
        phone: newMember.phone || null,
        is_authorized: false,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "A member with this email already exists",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Member Added",
        description: `Member added with login code: ${loginCode}. Authorize them to allow login.`,
      });

      setNewMember({ firstName: "", lastName: "", email: "", phone: "" });
      setShowAddMember(false);
      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const handleAuthorizeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("member_codes")
        .update({ is_authorized: true, authorized_at: new Date().toISOString() })
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member authorized successfully. They can now log in.",
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authorize member",
        variant: "destructive",
      });
    }
  };

  const handleCopyLoginCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Login code copied to clipboard",
    });
  };

  const handleLoanAction = async (loanId: string, action: "approved" | "rejected", rate?: number) => {
    try {
      const updateData: Record<string, unknown> = { status: action };
      
      if (action === "approved" && rate !== undefined) {
        updateData.interest_rate = rate;
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = user?.id;
      }
      
      const { error } = await supabase
        .from("loan_applications")
        .update(updateData)
        .eq("id", loanId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Loan ${action} successfully${action === "approved" ? ` with ${rate}% interest` : ""}`,
      });

      setApprovingLoan(null);
      setInterestRate("10");
      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update loan status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("member_codes")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member deleted successfully",
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMeeting = async () => {
    if (!editingMeeting) return;
    
    try {
      const { error } = await supabase
        .from("meetings")
        .update({
          title: editingMeeting.title,
          description: editingMeeting.description,
          meeting_date: editingMeeting.meeting_date,
          location: editingMeeting.location,
          is_virtual: editingMeeting.is_virtual,
          meeting_link: editingMeeting.meeting_link,
        })
        .eq("id", editingMeeting.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });

      setEditingMeeting(null);
      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update meeting",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meetingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNotice = async () => {
    if (!editingNotice) return;
    
    try {
      const { error } = await supabase
        .from("notices")
        .update({
          title: editingNotice.title,
          content: editingNotice.content,
          priority: editingNotice.priority,
          is_active: editingNotice.is_active,
        })
        .eq("id", editingNotice.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notice updated successfully",
      });

      setEditingNotice(null);
      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notice",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      const { error } = await supabase
        .from("notices")
        .delete()
        .eq("id", noticeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notice deleted successfully",
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notice",
        variant: "destructive",
      });
    }
  };

  // Filter members based on search
  const filteredMemberCodes = memberCodes.filter(m => 
    m.first_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.last_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleAddMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date) {
      toast({
        title: "Error",
        description: "Please fill in title and date",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("meetings").insert({
        title: newMeeting.title,
        description: newMeeting.description || null,
        meeting_date: newMeeting.date,
        location: newMeeting.location || null,
        is_virtual: newMeeting.isVirtual,
        meeting_link: newMeeting.link || null,
        created_by: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });

      setNewMeeting({ title: "", description: "", date: "", location: "", isVirtual: false, link: "" });
      setShowAddMeeting(false);
      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive",
      });
    }
  };

  const handleAddNotice = async () => {
    if (!newNotice.title || !newNotice.content) {
      toast({
        title: "Error",
        description: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("notices").insert({
        title: newNotice.title,
        content: newNotice.content,
        priority: newNotice.priority,
        created_by: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notice published successfully",
      });

      setNewNotice({ title: "", content: "", priority: "normal" });
      setShowAddNotice(false);
      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish notice",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // TEMPORARY: Removed admin check for testing

  const statCards = [
    { title: "Total Members", value: stats.totalMembers.toString(), icon: Users, color: "text-primary", bgColor: "bg-primary/15" },
    { title: "Pending Authorization", value: stats.pendingMembers.toString(), icon: UserPlus, color: "text-warning", bgColor: "bg-warning/15" },
    { title: "Total Investments", value: `KES ${stats.totalInvestments.toLocaleString()}`, icon: TrendingUp, color: "text-accent", bgColor: "bg-accent/15" },
    { title: "Total Savings", value: `KES ${stats.totalSavings.toLocaleString()}`, icon: PiggyBank, color: "text-info", bgColor: "bg-info/15" },
  ];

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-2xl border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="RockwellAfrica SACCO" className="w-12 h-12 object-contain" />
            <span className="font-display text-xl font-bold text-gradient-gold hidden sm:block">
              Admin Panel
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary glow-hover">
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

      <main className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold mb-3">
            <span className="text-gradient-gold">Admin Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage members, finances, and SACCO operations
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "members", label: "Members", icon: Users },
            { id: "loans", label: "Loans", icon: FileText },
            { id: "meetings", label: "Meetings", icon: Calendar },
            { id: "notices", label: "Notices", icon: Megaphone },
            { id: "finances", label: "Finances", icon: DollarSign },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                >
                  <Card className="glass-card group hover:-translate-y-2 transition-all duration-500">
                    <CardContent className="p-7">
                      <div className="flex items-center justify-between mb-5">
                        <div className={`p-4 rounded-2xl ${stat.bgColor} transition-all duration-500 group-hover:scale-110`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Loan Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
            <Card className="glass-card overflow-hidden">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Loan Applications Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-warning/10 text-center border border-warning/20 hover:bg-warning/15 transition-colors duration-300">
                    <AlertCircle className="w-10 h-10 text-warning mx-auto mb-3" />
                    <p className="text-3xl font-bold">{stats.pendingLoans}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-success/10 text-center border border-success/20 hover:bg-success/15 transition-colors duration-300">
                    <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
                    <p className="text-3xl font-bold">{stats.approvedLoans}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-destructive/10 text-center border border-destructive/20 hover:bg-destructive/15 transition-colors duration-300">
                    <XCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
                    <p className="text-3xl font-bold">{stats.rejectedLoans}</p>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="font-display text-2xl font-semibold">Member Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Member</DialogTitle>
                      <DialogDescription>
                        Enter member details. A login code will be generated automatically.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name *</Label>
                          <Input
                            value={newMember.firstName}
                            onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name *</Label>
                          <Input
                            value={newMember.lastName}
                            onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={newMember.phone}
                          onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                          placeholder="+254 700 000 000"
                        />
                      </div>
                      <Button onClick={handleAddMember} className="w-full">
                        Add Member
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Pending Authorization */}
            {filteredMemberCodes.filter(m => !m.is_authorized).length > 0 && (
              <Card className="glass-card border-warning/30">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-warning">
                    Pending Authorization ({filteredMemberCodes.filter(m => !m.is_authorized).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredMemberCodes.filter(m => !m.is_authorized).map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div>
                          <p className="font-medium">{member.first_name} {member.last_name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Added: {new Date(member.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">Code:</span>
                            <code className="text-xs bg-background px-2 py-1 rounded">{member.login_code}</code>
                            <button onClick={() => handleCopyLoginCode(member.login_code)} className="text-primary hover:underline text-xs">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button onClick={() => handleAuthorizeMember(member.id)} size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Authorize
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {member.first_name} {member.last_name}. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMember(member.id)} className="bg-destructive text-destructive-foreground">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Authorized Members */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Authorized Members ({filteredMemberCodes.filter(m => m.is_authorized).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMemberCodes.filter(m => m.is_authorized).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{memberSearch ? "No members match your search" : "No authorized members yet"}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Login Code</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date Joined</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Authorized</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMemberCodes.filter(m => m.is_authorized).map((member) => (
                          <tr key={member.id} className="border-b border-border/50 hover:bg-secondary/30">
                            <td className="py-3 px-4 font-medium">
                              {member.first_name} {member.last_name}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{member.email}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-secondary px-2 py-1 rounded">{member.login_code}</code>
                                <button onClick={() => handleCopyLoginCode(member.login_code)} className="text-primary">
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(member.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {member.authorized_at ? new Date(member.authorized_at).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Member?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete {member.first_name} {member.last_name}. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteMember(member.id)} className="bg-destructive text-destructive-foreground">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === "loans" && (
          <>
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
                            {loan.status === "approved" && loan.interest_rate && (
                              <p className="text-sm mt-1">
                                <span className="text-muted-foreground">Interest Rate:</span>{" "}
                                <span className="text-success font-semibold">{loan.interest_rate}%</span>
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {loan.status === "pending" ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => setApprovingLoan(loan)}
                                  className="bg-success hover:bg-success/90 text-success-foreground"
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
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                loan.status === "approved" 
                                  ? "bg-success/15 text-success" 
                                  : "bg-destructive/15 text-destructive"
                              }`}>
                                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                {loan.status === "approved" && loan.interest_rate && ` @ ${loan.interest_rate}%`}
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

            {/* Approve Loan Dialog */}
            <Dialog open={!!approvingLoan} onOpenChange={(open) => !open && setApprovingLoan(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Loan Application</DialogTitle>
                  <DialogDescription>
                    Set the interest rate for this loan before approving.
                  </DialogDescription>
                </DialogHeader>
                {approvingLoan && (
                  <div className="space-y-4 py-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="font-medium">{approvingLoan.profile?.first_name} {approvingLoan.profile?.last_name}</p>
                      <p className="text-sm text-muted-foreground">Loan Amount: KES {Number(approvingLoan.amount).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Reason: {approvingLoan.reason}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Interest Rate (%)</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          min="0"
                          max="100"
                          step="0.5"
                          className="pr-10"
                        />
                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total repayment: KES {(Number(approvingLoan.amount) * (1 + Number(interestRate) / 100)).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleLoanAction(approvingLoan.id, "approved", Number(interestRate))} 
                        className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Loan
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setApprovingLoan(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Meetings Tab */}
        {activeTab === "meetings" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl font-semibold">Meeting Management</h2>
              <Dialog open={showAddMeeting} onOpenChange={setShowAddMeeting}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule New Meeting</DialogTitle>
                    <DialogDescription>Enter the meeting details below.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={newMeeting.title}
                        onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                        placeholder="Monthly Member Meeting"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date & Time *</Label>
                      <Input
                        type="datetime-local"
                        value={newMeeting.date}
                        onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newMeeting.description}
                        onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                        placeholder="Meeting agenda..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={newMeeting.location}
                        onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                        placeholder="Office Address or Virtual"
                      />
                    </div>
                    <Button onClick={handleAddMeeting} className="w-full">
                      Schedule Meeting
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="glass-card">
              <CardContent className="pt-6">
                {meetings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No meetings scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{meeting.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(meeting.meeting_date).toLocaleString()}
                            </p>
                            {meeting.location && (
                              <p className="text-sm text-muted-foreground">{meeting.location}</p>
                            )}
                            {meeting.description && (
                              <p className="text-sm mt-2">{meeting.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {new Date(meeting.meeting_date) > new Date() && (
                              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                                Upcoming
                              </span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingMeeting(meeting)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Meeting?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the meeting "{meeting.title}". This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteMeeting(meeting.id)} className="bg-destructive text-destructive-foreground">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Meeting Dialog */}
            <Dialog open={!!editingMeeting} onOpenChange={(open) => !open && setEditingMeeting(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Meeting</DialogTitle>
                  <DialogDescription>Update meeting details below.</DialogDescription>
                </DialogHeader>
                {editingMeeting && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={editingMeeting.title}
                        onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date & Time *</Label>
                      <Input
                        type="datetime-local"
                        value={editingMeeting.meeting_date.slice(0, 16)}
                        onChange={(e) => setEditingMeeting({ ...editingMeeting, meeting_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingMeeting.description || ""}
                        onChange={(e) => setEditingMeeting({ ...editingMeeting, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={editingMeeting.location || ""}
                        onChange={(e) => setEditingMeeting({ ...editingMeeting, location: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleUpdateMeeting} className="w-full">
                      Update Meeting
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Notices Tab */}
        {activeTab === "notices" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl font-semibold">Notice Board</h2>
              <Dialog open={showAddNotice} onOpenChange={setShowAddNotice}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Notice
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Publish New Notice</DialogTitle>
                    <DialogDescription>Create a new notice for members.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        placeholder="Notice title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={newNotice.priority} onValueChange={(v) => setNewNotice({ ...newNotice, priority: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Content *</Label>
                      <Textarea
                        value={newNotice.content}
                        onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                        placeholder="Notice content..."
                        rows={5}
                      />
                    </div>
                    <Button onClick={handleAddNotice} className="w-full">
                      Publish Notice
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="glass-card">
              <CardContent className="pt-6">
                {notices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No notices published</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notices.map((notice) => (
                      <div key={notice.id} className={`p-4 rounded-xl border ${
                        notice.priority === 'urgent' ? 'bg-destructive/10 border-destructive/30' :
                        notice.priority === 'high' ? 'bg-warning/10 border-warning/30' :
                        'bg-secondary/50 border-border/50'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{notice.title}</h3>
                              {!notice.is_active && (
                                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{notice.content}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Posted: {new Date(notice.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              notice.priority === 'urgent' ? 'bg-destructive/20 text-destructive' :
                              notice.priority === 'high' ? 'bg-warning/20 text-warning' :
                              notice.priority === 'low' ? 'bg-muted text-muted-foreground' :
                              'bg-primary/20 text-primary'
                            }`}>
                              {notice.priority}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingNotice(notice)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Notice?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the notice "{notice.title}". This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteNotice(notice.id)} className="bg-destructive text-destructive-foreground">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Notice Dialog */}
            <Dialog open={!!editingNotice} onOpenChange={(open) => !open && setEditingNotice(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Notice</DialogTitle>
                  <DialogDescription>Update notice details below.</DialogDescription>
                </DialogHeader>
                {editingNotice && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={editingNotice.title}
                        onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select 
                        value={editingNotice.priority} 
                        onValueChange={(v) => setEditingNotice({ ...editingNotice, priority: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Content *</Label>
                      <Textarea
                        value={editingNotice.content}
                        onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                        rows={5}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={editingNotice.is_active}
                        onChange={(e) => setEditingNotice({ ...editingNotice, is_active: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="is_active">Active (visible to members)</Label>
                    </div>
                    <Button onClick={handleUpdateNotice} className="w-full">
                      Update Notice
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Finances Tab */}
        {activeTab === "finances" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold">Financial Overview</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground mb-2">Total Investments</p>
                    <p className="text-3xl font-bold text-primary">KES {stats.totalInvestments.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <PiggyBank className="w-12 h-12 mx-auto mb-4 text-accent" />
                    <p className="text-sm text-muted-foreground mb-2">Total Savings</p>
                    <p className="text-3xl font-bold text-accent">KES {stats.totalSavings.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-success" />
                    <p className="text-sm text-muted-foreground mb-2">Loans Disbursed</p>
                    <p className="text-3xl font-bold text-success">KES {stats.totalLoanAmount.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Member Financials</CardTitle>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No members with financial data</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Investments</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Savings</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member) => (
                          <tr key={member.id} className="border-b border-border/50 hover:bg-secondary/30">
                            <td className="py-3 px-4 font-medium">
                              {member.first_name} {member.last_name}
                            </td>
                            <td className="py-3 px-4 text-right text-primary">
                              KES {member.totalInvestments.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-accent">
                              KES {member.totalSavings.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold">
                              KES {(member.totalInvestments + member.totalSavings).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
