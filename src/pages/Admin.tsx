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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Loader2,
  DollarSign,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  UserPlus,
  Calendar,
  Megaphone,
  Copy,
  Search,
  Trash2,
  Edit,
  Percent,
  BadgeCheck,
  Wallet,
  Bell,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";

interface AdminStats {
  totalMembers: number;
  totalInvestments: number;
  totalSavings: number;
  pendingLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  totalLoanAmount: number;
  pendingMembers: number;
  pendingDeposits: number;
}

interface WeeklyDeposit {
  id: string;
  user_id: string;
  amount: number;
  week_start: string;
  week_end: string;
  status: string;
  mpesa_code: string | null;
  created_at: string;
  confirmed_at: string | null;
  profile?: { first_name: string; last_name: string; email: string };
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
  loan_eligible: boolean;
  loan_eligible_at: string | null;
  password_set: boolean;
}

interface MemberWithFinances {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  totalSavings: number;
  totalInvestments: number;
  loan_eligible?: boolean;
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
  memberSavings?: number;
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
    pendingDeposits: 0,
  });
  const [memberCodes, setMemberCodes] = useState<MemberCode[]>([]);
  const [membersWithFinances, setMembersWithFinances] = useState<MemberWithFinances[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [allDeposits, setAllDeposits] = useState<WeeklyDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Form states
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [showAddSavings, setShowAddSavings] = useState(false);
  const [newMember, setNewMember] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [newMeeting, setNewMeeting] = useState({ title: "", description: "", date: "", location: "", isVirtual: false, link: "" });
  const [newNotice, setNewNotice] = useState({ title: "", content: "", priority: "normal" });
  const [selectedMemberForSavings, setSelectedMemberForSavings] = useState<MemberWithFinances | null>(null);
  const [savingsAmount, setSavingsAmount] = useState("");
  const [savingsDescription, setSavingsDescription] = useState("");
  
  // Search and edit states
  const [memberSearch, setMemberSearch] = useState("");
  const [loanMemberSearch, setLoanMemberSearch] = useState("");
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [approvingLoan, setApprovingLoan] = useState<LoanApplication | null>(null);
  const [interestRate, setInterestRate] = useState("10");
  
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const { data: codes, error: codesError } = await supabase
        .from("member_codes")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (codesError) console.error("Error fetching member codes:", codesError);
      setMemberCodes((codes as MemberCode[]) || []);

      const { data: profiles } = await supabase.from("profiles").select("*");
      const { data: investments } = await supabase.from("investments").select("*");
      const { data: savings } = await supabase.from("savings").select("*");
      const { data: loanApps } = await supabase.from("loan_applications").select("*");
      const { data: depositsData } = await supabase.from("weekly_deposits").select("*").order("created_at", { ascending: false });
      const { data: meetingsData } = await supabase.from("meetings").select("*").order("meeting_date", { ascending: true });
      setMeetings((meetingsData as Meeting[]) || []);

      const { data: noticesData } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
      setNotices((noticesData as Notice[]) || []);

      // Map deposits with profiles
      const depositsWithProfiles = (depositsData || []).map((d: any) => {
        const profile = profiles?.find(p => p.user_id === d.user_id);
        return { ...d, profile: profile ? { first_name: profile.first_name, last_name: profile.last_name, email: profile.email } : undefined };
      });
      setAllDeposits(depositsWithProfiles as WeeklyDeposit[]);

      const totalMembers = profiles?.length || 0;
      const totalInvestments = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
      const totalSavings = savings?.reduce((sum, sav) => sum + Number(sav.amount), 0) || 0;
      const pendingLoans = loanApps?.filter(l => l.status === "pending").length || 0;
      const approvedLoans = loanApps?.filter(l => l.status === "approved").length || 0;
      const rejectedLoans = loanApps?.filter(l => l.status === "rejected").length || 0;
      const totalLoanAmount = loanApps?.filter(l => l.status === "approved").reduce((sum, l) => sum + Number(l.amount), 0) || 0;
      const pendingMembers = codes?.filter(c => !c.is_authorized).length || 0;
      const pendingDeposits = depositsData?.filter((d: any) => d.status === "pending").length || 0;

      setStats({ totalMembers, totalInvestments, totalSavings, pendingLoans, approvedLoans, rejectedLoans, totalLoanAmount, pendingMembers, pendingDeposits });

      const membersData: MemberWithFinances[] = (profiles || []).map(profile => {
        const memberCode = codes?.find(c => c.email.toLowerCase() === profile.email.toLowerCase());
        return {
          id: profile.id,
          user_id: profile.user_id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          created_at: profile.created_at,
          totalSavings: savings?.filter(s => s.user_id === profile.user_id).reduce((sum, s) => sum + Number(s.amount), 0) || 0,
          totalInvestments: investments?.filter(i => i.user_id === profile.user_id).reduce((sum, i) => sum + Number(i.amount), 0) || 0,
          loan_eligible: memberCode?.loan_eligible || false,
        };
      });
      setMembersWithFinances(membersData);

      const loansWithProfiles = loanApps?.map(loan => {
        const profile = profiles?.find(p => p.user_id === loan.user_id);
        const memberSavings = savings?.filter(s => s.user_id === loan.user_id).reduce((sum, s) => sum + Number(s.amount), 0) || 0;
        return {
          ...loan,
          profile: profile ? { first_name: profile.first_name, last_name: profile.last_name, email: profile.email } : undefined,
          memberSavings,
        };
      }) || [];
      setLoans(loansWithProfiles as LoanApplication[]);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.email) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const loginCode = generateLoginCode();
    try {
      const { error } = await supabase.from("member_codes").insert({
        email: newMember.email.toLowerCase().trim(), login_code: loginCode,
        first_name: newMember.firstName, last_name: newMember.lastName,
        phone: newMember.phone || null, is_authorized: false, loan_eligible: false, password_set: false,
      });
      if (error) {
        if (error.code === "23505") { toast({ title: "Error", description: "A member with this email already exists", variant: "destructive" }); }
        else throw error;
        return;
      }
      toast({ title: "Member Added", description: `Login code: ${loginCode}` });
      setNewMember({ firstName: "", lastName: "", email: "", phone: "" });
      setShowAddMember(false);
      fetchAdminData();
    } catch (error) {
      console.error("Error adding member:", error);
      toast({ title: "Error", description: "Failed to add member", variant: "destructive" });
    }
  };

  const handleAuthorizeMember = async (memberId: string) => {
    try {
      const { error } = await supabase.from("member_codes").update({ is_authorized: true, authorized_at: new Date().toISOString() }).eq("id", memberId);
      if (error) throw error;
      toast({ title: "Success", description: "Member authorized successfully." });
      fetchAdminData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to authorize member", variant: "destructive" });
    }
  };

  const handleCopyLoginCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Login code copied to clipboard" });
  };

  const handleToggleLoanEligibility = async (memberEmail: string, eligible: boolean) => {
    try {
      const { error } = await supabase.from("member_codes").update({ loan_eligible: eligible, loan_eligible_at: eligible ? new Date().toISOString() : null }).eq("email", memberEmail.toLowerCase());
      if (error) throw error;
      const member = membersWithFinances.find(m => m.email.toLowerCase() === memberEmail.toLowerCase());
      if (member && eligible) {
        await supabase.from("member_notifications").insert({ user_id: member.user_id, title: "Loan Access Granted", message: "You are now eligible to apply for loans.", type: "success" });
      }
      toast({ title: "Success", description: `Member ${eligible ? "can now" : "can no longer"} apply for loans` });
      fetchAdminData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update loan eligibility", variant: "destructive" });
    }
  };

  const handleAddSavings = async () => {
    if (!selectedMemberForSavings || !savingsAmount) {
      toast({ title: "Error", description: "Please select a member and enter amount", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.from("savings").insert({ user_id: selectedMemberForSavings.user_id, amount: parseFloat(savingsAmount), description: savingsDescription || "Admin deposit" });
      if (error) throw error;
      toast({ title: "Success", description: `KES ${parseFloat(savingsAmount).toLocaleString()} added` });
      setSelectedMemberForSavings(null); setSavingsAmount(""); setSavingsDescription(""); setShowAddSavings(false);
      fetchAdminData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add savings", variant: "destructive" });
    }
  };

  const handleLoanAction = async (loanId: string, action: "approved" | "rejected", rate?: number) => {
    try {
      const updateData: Record<string, unknown> = { status: action };
      if (action === "approved" && rate !== undefined) {
        updateData.interest_rate = rate; updateData.approved_at = new Date().toISOString(); updateData.approved_by = user?.id;
      }
      const { error } = await supabase.from("loan_applications").update(updateData).eq("id", loanId);
      if (error) throw error;
      const loan = loans.find(l => l.id === loanId);
      if (loan) {
        await supabase.from("member_notifications").insert({
          user_id: loan.user_id,
          title: action === "approved" ? "Loan Approved!" : "Loan Application Update",
          message: action === "approved" ? `Your loan of KES ${loan.amount.toLocaleString()} has been approved at ${rate}% interest.` : `Your loan application has been reviewed.`,
          type: action === "approved" ? "success" : "info",
        });
      }
      toast({ title: "Success", description: `Loan ${action} successfully` });
      setApprovingLoan(null); setInterestRate("10");
      fetchAdminData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update loan status", variant: "destructive" });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase.from("member_codes").delete().eq("id", memberId);
      if (error) throw error;
      toast({ title: "Success", description: "Member deleted successfully" });
      fetchAdminData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete member", variant: "destructive" });
    }
  };

  const handleVerifyDeposit = async (depositId: string, action: "confirmed" | "rejected") => {
    try {
      const updateData: Record<string, unknown> = { status: action };
      if (action === "confirmed") {
        updateData.confirmed_by = user?.id;
        updateData.confirmed_at = new Date().toISOString();
      }
      const { error } = await supabase.from("weekly_deposits").update(updateData as any).eq("id", depositId);
      if (error) throw error;
      // If confirmed, add to member's savings
      if (action === "confirmed") {
        const deposit = allDeposits.find(d => d.id === depositId);
        if (deposit) {
          await supabase.from("savings").insert({ user_id: deposit.user_id, amount: deposit.amount, description: `Weekly deposit - M-Pesa: ${deposit.mpesa_code || 'N/A'}` });
          await supabase.from("member_notifications").insert({ user_id: deposit.user_id, title: "Deposit Confirmed", message: `Your deposit of KES ${deposit.amount.toLocaleString()} has been verified and added to your savings.`, type: "success" });
        }
      } else {
        const deposit = allDeposits.find(d => d.id === depositId);
        if (deposit) {
          await supabase.from("member_notifications").insert({ user_id: deposit.user_id, title: "Deposit Rejected", message: `Your deposit of KES ${deposit.amount.toLocaleString()} was not verified. Please contact admin.`, type: "warning" });
        }
      }
      toast({ title: "Success", description: `Deposit ${action} successfully` });
      fetchAdminData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update deposit", variant: "destructive" });
    }
  };

  const handleSetMemberInterestRate = async (memberEmail: string, rate: string) => {
    try {
      const { error } = await supabase.from("member_codes").update({ interest_rate: parseFloat(rate) } as any).eq("email", memberEmail.toLowerCase());
      if (error) throw error;
      toast({ title: "Success", description: `Interest rate set to ${rate}%` });
      fetchAdminData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update interest rate", variant: "destructive" });
    }
  };

  const handleAddMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date) { toast({ title: "Error", description: "Please fill in title and date", variant: "destructive" }); return; }
    try {
      const { error } = await supabase.from("meetings").insert({ title: newMeeting.title, description: newMeeting.description || null, meeting_date: newMeeting.date, location: newMeeting.location || null, is_virtual: newMeeting.isVirtual, meeting_link: newMeeting.link || null, created_by: user?.id || null });
      if (error) throw error;
      toast({ title: "Success", description: "Meeting scheduled" });
      setNewMeeting({ title: "", description: "", date: "", location: "", isVirtual: false, link: "" }); setShowAddMeeting(false);
      fetchAdminData();
    } catch (error) { toast({ title: "Error", description: "Failed to schedule meeting", variant: "destructive" }); }
  };

  const handleUpdateMeeting = async () => {
    if (!editingMeeting) return;
    try {
      const { error } = await supabase.from("meetings").update({ title: editingMeeting.title, description: editingMeeting.description, meeting_date: editingMeeting.meeting_date, location: editingMeeting.location, is_virtual: editingMeeting.is_virtual, meeting_link: editingMeeting.meeting_link }).eq("id", editingMeeting.id);
      if (error) throw error;
      toast({ title: "Success", description: "Meeting updated" }); setEditingMeeting(null);
      fetchAdminData();
    } catch (error) { toast({ title: "Error", description: "Failed to update meeting", variant: "destructive" }); }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase.from("meetings").delete().eq("id", meetingId);
      if (error) throw error;
      toast({ title: "Success", description: "Meeting deleted" }); fetchAdminData();
    } catch (error) { toast({ title: "Error", description: "Failed to delete meeting", variant: "destructive" }); }
  };

  const handleAddNotice = async () => {
    if (!newNotice.title || !newNotice.content) { toast({ title: "Error", description: "Please fill in title and content", variant: "destructive" }); return; }
    try {
      const { error } = await supabase.from("notices").insert({ title: newNotice.title, content: newNotice.content, priority: newNotice.priority, is_active: true, created_by: user?.id || null });
      if (error) throw error;
      toast({ title: "Success", description: "Notice published" });
      setNewNotice({ title: "", content: "", priority: "normal" }); setShowAddNotice(false);
      fetchAdminData();
    } catch (error) { toast({ title: "Error", description: "Failed to publish notice", variant: "destructive" }); }
  };

  const handleUpdateNotice = async () => {
    if (!editingNotice) return;
    try {
      const { error } = await supabase.from("notices").update({ title: editingNotice.title, content: editingNotice.content, priority: editingNotice.priority, is_active: editingNotice.is_active }).eq("id", editingNotice.id);
      if (error) throw error;
      toast({ title: "Success", description: "Notice updated" }); setEditingNotice(null);
      fetchAdminData();
    } catch (error) { toast({ title: "Error", description: "Failed to update notice", variant: "destructive" }); }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      const { error } = await supabase.from("notices").delete().eq("id", noticeId);
      if (error) throw error;
      toast({ title: "Success", description: "Notice deleted" }); fetchAdminData();
    } catch (error) { toast({ title: "Error", description: "Failed to delete notice", variant: "destructive" }); }
  };

  const filteredMemberCodes = memberCodes.filter(m =>
    m.first_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.last_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredMembersForLoans = membersWithFinances.filter(m =>
    m.first_name.toLowerCase().includes(loanMemberSearch.toLowerCase()) ||
    m.last_name.toLowerCase().includes(loanMemberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(loanMemberSearch.toLowerCase())
  );

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) { toast({ title: "Error", description: "Failed to sign out", variant: "destructive" }); }
    else navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onSignOut={handleSignOut} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 bg-card/50 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <h1 className="font-display text-lg font-bold">
                  {activeTab === "overview" ? "Dashboard Overview" :
                   activeTab === "members" ? "Member Management" :
                   activeTab === "loans" ? "Loans & Savings" :
                   activeTab === "deposits" ? "Deposit Verification" :
                   activeTab === "meetings" ? "Meeting Management" :
                   activeTab === "notices" ? "Notice Board" :
                   "Financial Overview"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                {stats.pendingMembers > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground">
                    {stats.pendingMembers}
                  </span>
                )}
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {/* Overview Tab */}
            {activeTab === "overview" && <AdminOverview stats={stats} />}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search members..." value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="pl-10 w-64" />
                  </div>
                  <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary text-primary-foreground"><UserPlus className="w-4 h-4 mr-2" />Add Member</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Member</DialogTitle>
                        <DialogDescription>Enter member details. A login code will be generated automatically.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>First Name *</Label><Input value={newMember.firstName} onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })} placeholder="John" /></div>
                          <div className="space-y-2"><Label>Last Name *</Label><Input value={newMember.lastName} onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })} placeholder="Doe" /></div>
                        </div>
                        <div className="space-y-2"><Label>Email *</Label><Input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} placeholder="john@example.com" /></div>
                        <div className="space-y-2"><Label>Phone</Label><Input value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} placeholder="+254 700 000 000" /></div>
                        <Button onClick={handleAddMember} className="w-full">Add Member</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Pending Authorization */}
                {filteredMemberCodes.filter(m => !m.is_authorized).length > 0 && (
                  <Card className="bg-card border-warning/30">
                    <CardHeader><CardTitle className="text-lg text-warning">Pending Authorization ({filteredMemberCodes.filter(m => !m.is_authorized).length})</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {filteredMemberCodes.filter(m => !m.is_authorized).map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                            <div>
                              <p className="font-medium">{member.first_name} {member.last_name}</p>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">Added: {new Date(member.created_at).toLocaleDateString()}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">Code:</span>
                                <code className="text-xs bg-background px-2 py-1 rounded">{member.login_code}</code>
                                <button onClick={() => handleCopyLoginCode(member.login_code)} className="text-primary hover:underline text-xs"><Copy className="w-3 h-3" /></button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button onClick={() => handleAuthorizeMember(member.id)} size="sm" className="bg-success hover:bg-success/90 text-success-foreground"><CheckCircle className="w-4 h-4 mr-1" />Authorize</Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>Delete Member?</AlertDialogTitle><AlertDialogDescription>This will permanently delete {member.first_name} {member.last_name}.</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteMember(member.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
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
                <Card className="bg-card border-border/50">
                  <CardHeader><CardTitle className="text-lg">Authorized Members ({filteredMemberCodes.filter(m => m.is_authorized).length})</CardTitle></CardHeader>
                  <CardContent>
                    {filteredMemberCodes.filter(m => m.is_authorized).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><Users className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>{memberSearch ? "No members match your search" : "No authorized members yet"}</p></div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead><tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Name</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Email</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Login Code</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Joined</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Actions</th>
                          </tr></thead>
                          <tbody>
                            {filteredMemberCodes.filter(m => m.is_authorized).map((member) => (
                              <tr key={member.id} className="border-b border-border/30 hover:bg-secondary/30">
                                <td className="py-3 px-4 font-medium text-sm">{member.first_name} {member.last_name}</td>
                                <td className="py-3 px-4 text-muted-foreground text-sm">{member.email}</td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <code className="text-xs bg-secondary px-2 py-1 rounded">{member.login_code}</code>
                                    <button onClick={() => handleCopyLoginCode(member.login_code)} className="text-primary"><Copy className="w-3 h-3" /></button>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-muted-foreground text-sm">{new Date(member.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                  {member.password_set ? (
                                    <span className="px-2 py-1 rounded-full bg-success/15 text-success text-xs flex items-center gap-1 w-fit"><BadgeCheck className="w-3 h-3" />Active</span>
                                  ) : (
                                    <span className="px-2 py-1 rounded-full bg-warning/15 text-warning text-xs">Pending Setup</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader><AlertDialogTitle>Delete Member?</AlertDialogTitle><AlertDialogDescription>This will permanently delete {member.first_name} {member.last_name}.</AlertDialogDescription></AlertDialogHeader>
                                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteMember(member.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
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

            {/* Loans & Savings Tab */}
            {activeTab === "loans" && (
              <div className="space-y-8">
                <Card className="bg-card border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Member Savings & Loan Eligibility</CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={loanMemberSearch} onChange={(e) => setLoanMemberSearch(e.target.value)} className="pl-10 w-48" /></div>
                      <Dialog open={showAddSavings} onOpenChange={setShowAddSavings}>
                        <DialogTrigger asChild><Button className="bg-accent text-accent-foreground"><Wallet className="w-4 h-4 mr-2" />Add Savings</Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Add Member Savings</DialogTitle><DialogDescription>Add savings to a member's account</DialogDescription></DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Select Member</Label>
                              <Select value={selectedMemberForSavings?.id} onValueChange={(v) => setSelectedMemberForSavings(membersWithFinances.find(m => m.id === v) || null)}>
                                <SelectTrigger><SelectValue placeholder="Select a member" /></SelectTrigger>
                                <SelectContent>{membersWithFinances.map((member) => (<SelectItem key={member.id} value={member.id}>{member.first_name} {member.last_name}</SelectItem>))}</SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2"><Label>Amount (KES)</Label><Input type="number" value={savingsAmount} onChange={(e) => setSavingsAmount(e.target.value)} placeholder="Enter amount" min="0" /></div>
                            <div className="space-y-2"><Label>Description</Label><Input value={savingsDescription} onChange={(e) => setSavingsDescription(e.target.value)} placeholder="Monthly deposit" /></div>
                            <Button onClick={handleAddSavings} className="w-full">Add Savings</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredMembersForLoans.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><Users className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No members found</p></div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead><tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Member</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Savings</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Loan Limit (3x)</th>
                            <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">Interest Rate</th>
                            <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">Loan Eligible</th>
                          </tr></thead>
                          <tbody>
                            {filteredMembersForLoans.map((member) => {
                              const mc = memberCodes.find(c => c.email.toLowerCase() === member.email.toLowerCase());
                              return (
                              <tr key={member.id} className="border-b border-border/30 hover:bg-secondary/30">
                                <td className="py-3 px-4"><p className="font-medium text-sm">{member.first_name} {member.last_name}</p><p className="text-xs text-muted-foreground">{member.email}</p></td>
                                <td className="py-3 px-4 text-right"><span className="text-accent font-semibold text-sm">KES {member.totalSavings.toLocaleString()}</span></td>
                                <td className="py-3 px-4 text-right"><span className="text-primary font-semibold text-sm">KES {(member.totalSavings * 3).toLocaleString()}</span></td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center justify-center gap-1">
                                    <Input type="number" className="w-20 h-8 text-center text-xs" defaultValue={(mc as any)?.interest_rate || 0} min="0" max="100" step="0.5"
                                      onBlur={(e) => handleSetMemberInterestRate(member.email, e.target.value)} />
                                    <span className="text-xs text-muted-foreground">%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <Switch checked={member.loan_eligible || false} onCheckedChange={(checked) => handleToggleLoanEligibility(member.email, checked)} />
                                    <span className={`text-xs ${member.loan_eligible ? 'text-success' : 'text-muted-foreground'}`}>{member.loan_eligible ? 'Eligible' : 'Not Eligible'}</span>
                                  </div>
                                </td>
                              </tr>
                            );})}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Loan Applications */}
                <Card className="bg-card border-border/50">
                  <CardHeader><CardTitle className="text-xl">Loan Applications ({loans.length})</CardTitle></CardHeader>
                  <CardContent>
                    {loans.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><FileText className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No loan applications yet</p></div>
                    ) : (
                      <div className="space-y-4">
                        {loans.map((loan) => (
                          <div key={loan.id} className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <p className="font-medium">{loan.profile?.first_name} {loan.profile?.last_name}</p>
                                <p className="text-sm text-muted-foreground">{loan.profile?.email}</p>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                  <span><span className="text-muted-foreground">Amount:</span> <span className="text-primary font-semibold">KES {Number(loan.amount).toLocaleString()}</span></span>
                                  <span><span className="text-muted-foreground">Savings:</span> <span className="text-accent font-semibold">KES {(loan.memberSavings || 0).toLocaleString()}</span></span>
                                </div>
                                <p className="text-sm mt-1"><span className="text-muted-foreground">Reason:</span> {loan.reason}</p>
                                {loan.status === "approved" && loan.interest_rate && (
                                  <p className="text-sm mt-1 text-success">Interest: {loan.interest_rate}% | Total: KES {(Number(loan.amount) * (1 + Number(loan.interest_rate) / 100)).toLocaleString()}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {loan.status === "pending" ? (
                                  <>
                                    <Button size="sm" onClick={() => setApprovingLoan(loan)} className="bg-success hover:bg-success/90 text-success-foreground"><CheckCircle className="w-4 h-4 mr-1" />Approve</Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleLoanAction(loan.id, "rejected")}><XCircle className="w-4 h-4 mr-1" />Reject</Button>
                                  </>
                                ) : (
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${loan.status === "approved" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
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

                <Dialog open={!!approvingLoan} onOpenChange={(open) => !open && setApprovingLoan(null)}>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Approve Loan</DialogTitle><DialogDescription>Set the interest rate before approving.</DialogDescription></DialogHeader>
                    {approvingLoan && (
                      <div className="space-y-4 py-4">
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <p className="font-medium">{approvingLoan.profile?.first_name} {approvingLoan.profile?.last_name}</p>
                          <p className="text-sm text-muted-foreground">Amount: KES {Number(approvingLoan.amount).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Savings: KES {(approvingLoan.memberSavings || 0).toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Interest Rate (%)</Label>
                          <div className="relative">
                            <Input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} min="0" max="100" step="0.5" className="pr-10" />
                            <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground">Total: KES {(Number(approvingLoan.amount) * (1 + Number(interestRate) / 100)).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleLoanAction(approvingLoan.id, "approved", Number(interestRate))} className="flex-1 bg-success hover:bg-success/90 text-success-foreground"><CheckCircle className="w-4 h-4 mr-2" />Approve</Button>
                          <Button variant="outline" onClick={() => setApprovingLoan(null)} className="flex-1">Cancel</Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Deposits Verification Tab */}
            {activeTab === "deposits" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-card border-border/50"><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground mb-1">Pending</p><p className="text-3xl font-bold text-warning">{allDeposits.filter(d => d.status === "pending").length}</p></CardContent></Card>
                  <Card className="bg-card border-border/50"><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground mb-1">Confirmed</p><p className="text-3xl font-bold text-success">{allDeposits.filter(d => d.status === "confirmed").length}</p></CardContent></Card>
                  <Card className="bg-card border-border/50"><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground mb-1">Total Deposited</p><p className="text-3xl font-bold text-primary">KES {allDeposits.filter(d => d.status === "confirmed").reduce((s, d) => s + Number(d.amount), 0).toLocaleString()}</p></CardContent></Card>
                </div>
                <Card className="bg-card border-border/50">
                  <CardHeader><CardTitle className="text-lg">Pending Verification ({allDeposits.filter(d => d.status === "pending").length})</CardTitle></CardHeader>
                  <CardContent>
                    {allDeposits.filter(d => d.status === "pending").length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No deposits pending verification</p></div>
                    ) : (
                      <div className="space-y-3">
                        {allDeposits.filter(d => d.status === "pending").map((deposit) => (
                          <div key={deposit.id} className="p-4 rounded-xl bg-secondary/50 border border-warning/30">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <p className="font-medium">{deposit.profile?.first_name} {deposit.profile?.last_name}</p>
                                <p className="text-sm text-muted-foreground">{deposit.profile?.email}</p>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                  <span><span className="text-muted-foreground">Amount:</span> <span className="text-primary font-bold">KES {Number(deposit.amount).toLocaleString()}</span></span>
                                  <span><span className="text-muted-foreground">M-Pesa Code:</span> <code className="bg-background px-2 py-0.5 rounded text-xs font-mono">{deposit.mpesa_code || "N/A"}</code></span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Week: {new Date(deposit.week_start).toLocaleDateString()} - {new Date(deposit.week_end).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" onClick={() => handleVerifyDeposit(deposit.id, "confirmed")} className="bg-success hover:bg-success/90 text-success-foreground"><CheckCircle className="w-4 h-4 mr-1" />Verify</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleVerifyDeposit(deposit.id, "rejected")}><XCircle className="w-4 h-4 mr-1" />Reject</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/50">
                  <CardHeader><CardTitle className="text-lg">All Deposits History</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead><tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Member</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">M-Pesa Code</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Date</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
                        </tr></thead>
                        <tbody>
                          {allDeposits.map((d) => (
                            <tr key={d.id} className="border-b border-border/30 hover:bg-secondary/30">
                              <td className="py-3 px-4 text-sm">{d.profile?.first_name} {d.profile?.last_name}</td>
                              <td className="py-3 px-4 text-right text-sm font-semibold">KES {Number(d.amount).toLocaleString()}</td>
                              <td className="py-3 px-4 text-sm"><code className="text-xs">{d.mpesa_code || "N/A"}</code></td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</td>
                              <td className="py-3 px-4 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === "confirmed" ? "bg-success/15 text-success" : d.status === "pending" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>{d.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Meetings Tab */}
            {activeTab === "meetings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div />
                  <Dialog open={showAddMeeting} onOpenChange={setShowAddMeeting}>
                    <DialogTrigger asChild><Button className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Schedule Meeting</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Schedule New Meeting</DialogTitle><DialogDescription>Enter meeting details.</DialogDescription></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Title *</Label><Input value={newMeeting.title} onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })} placeholder="Monthly Meeting" /></div>
                        <div className="space-y-2"><Label>Date & Time *</Label><Input type="datetime-local" value={newMeeting.date} onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Description</Label><Textarea value={newMeeting.description} onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })} placeholder="Agenda..." /></div>
                        <div className="space-y-2"><Label>Location</Label><Input value={newMeeting.location} onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })} placeholder="Office or Virtual" /></div>
                        <Button onClick={handleAddMeeting} className="w-full">Schedule</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card className="bg-card border-border/50">
                  <CardContent className="pt-6">
                    {meetings.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No meetings scheduled</p></div>
                    ) : (
                      <div className="space-y-3">
                        {meetings.map((meeting) => (
                          <div key={meeting.id} className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{meeting.title}</h3>
                                  {new Date(meeting.meeting_date) > new Date() && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">Upcoming</span>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{new Date(meeting.meeting_date).toLocaleString()}</p>
                                {meeting.location && <p className="text-sm text-muted-foreground">{meeting.location}</p>}
                                {meeting.description && <p className="text-sm mt-2">{meeting.description}</p>}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => setEditingMeeting(meeting)}><Edit className="w-4 h-4" /></Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Delete Meeting?</AlertDialogTitle><AlertDialogDescription>Delete "{meeting.title}"?</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteMeeting(meeting.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
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

                <Dialog open={!!editingMeeting} onOpenChange={(open) => !open && setEditingMeeting(null)}>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Edit Meeting</DialogTitle><DialogDescription>Update meeting details.</DialogDescription></DialogHeader>
                    {editingMeeting && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Title *</Label><Input value={editingMeeting.title} onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Date & Time *</Label><Input type="datetime-local" value={editingMeeting.meeting_date.slice(0, 16)} onChange={(e) => setEditingMeeting({ ...editingMeeting, meeting_date: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Description</Label><Textarea value={editingMeeting.description || ""} onChange={(e) => setEditingMeeting({ ...editingMeeting, description: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Location</Label><Input value={editingMeeting.location || ""} onChange={(e) => setEditingMeeting({ ...editingMeeting, location: e.target.value })} /></div>
                        <Button onClick={handleUpdateMeeting} className="w-full">Update Meeting</Button>
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
                  <div />
                  <Dialog open={showAddNotice} onOpenChange={setShowAddNotice}>
                    <DialogTrigger asChild><Button className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Add Notice</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Publish Notice</DialogTitle><DialogDescription>Create a new notice for members.</DialogDescription></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Title *</Label><Input value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} placeholder="Notice title" /></div>
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <Select value={newNotice.priority} onValueChange={(v) => setNewNotice({ ...newNotice, priority: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label>Content *</Label><Textarea value={newNotice.content} onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })} placeholder="Notice content..." rows={5} /></div>
                        <Button onClick={handleAddNotice} className="w-full">Publish</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card className="bg-card border-border/50">
                  <CardContent className="pt-6">
                    {notices.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No notices published</p></div>
                    ) : (
                      <div className="space-y-3">
                        {notices.map((notice) => (
                          <div key={notice.id} className={`p-4 rounded-xl border ${notice.priority === 'urgent' ? 'bg-destructive/10 border-destructive/30' : notice.priority === 'high' ? 'bg-warning/10 border-warning/30' : 'bg-secondary/50 border-border/30'}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{notice.title}</h3>
                                  {!notice.is_active && <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">Inactive</span>}
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${notice.priority === 'urgent' ? 'bg-destructive/20 text-destructive' : notice.priority === 'high' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>{notice.priority}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{notice.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">Posted: {new Date(notice.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => setEditingNotice(notice)}><Edit className="w-4 h-4" /></Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Delete Notice?</AlertDialogTitle><AlertDialogDescription>Delete "{notice.title}"?</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteNotice(notice.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
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

                <Dialog open={!!editingNotice} onOpenChange={(open) => !open && setEditingNotice(null)}>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Edit Notice</DialogTitle><DialogDescription>Update notice details.</DialogDescription></DialogHeader>
                    {editingNotice && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Title *</Label><Input value={editingNotice.title} onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })} /></div>
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <Select value={editingNotice.priority} onValueChange={(v) => setEditingNotice({ ...editingNotice, priority: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label>Content *</Label><Textarea value={editingNotice.content} onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })} rows={5} /></div>
                        <div className="flex items-center gap-2"><Switch id="is_active" checked={editingNotice.is_active} onCheckedChange={(checked) => setEditingNotice({ ...editingNotice, is_active: checked })} /><Label htmlFor="is_active">Active</Label></div>
                        <Button onClick={handleUpdateNotice} className="w-full">Update Notice</Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Finances Tab */}
            {activeTab === "finances" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-card border-border/50"><CardContent className="pt-6"><div className="text-center"><TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" /><p className="text-sm text-muted-foreground mb-2">Total Investments</p><p className="text-3xl font-bold text-primary">KES {stats.totalInvestments.toLocaleString()}</p></div></CardContent></Card>
                  <Card className="bg-card border-border/50"><CardContent className="pt-6"><div className="text-center"><PiggyBank className="w-12 h-12 mx-auto mb-4 text-accent" /><p className="text-sm text-muted-foreground mb-2">Total Savings</p><p className="text-3xl font-bold text-accent">KES {stats.totalSavings.toLocaleString()}</p></div></CardContent></Card>
                  <Card className="bg-card border-border/50"><CardContent className="pt-6"><div className="text-center"><DollarSign className="w-12 h-12 mx-auto mb-4 text-success" /><p className="text-sm text-muted-foreground mb-2">Loans Disbursed</p><p className="text-3xl font-bold text-success">KES {stats.totalLoanAmount.toLocaleString()}</p></div></CardContent></Card>
                </div>

                <Card className="bg-card border-border/50">
                  <CardHeader><CardTitle>Member Financials</CardTitle></CardHeader>
                  <CardContent>
                    {membersWithFinances.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><Users className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No members with financial data</p></div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead><tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Name</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Investments</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Savings</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Total</th>
                          </tr></thead>
                          <tbody>
                            {membersWithFinances.map((member) => (
                              <tr key={member.id} className="border-b border-border/30 hover:bg-secondary/30">
                                <td className="py-3 px-4 font-medium text-sm">{member.first_name} {member.last_name}</td>
                                <td className="py-3 px-4 text-right text-primary text-sm">KES {member.totalInvestments.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right text-accent text-sm">KES {member.totalSavings.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right font-semibold text-sm">KES {(member.totalInvestments + member.totalSavings).toLocaleString()}</td>
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
      </div>
    </SidebarProvider>
  );
};

export default Admin;
