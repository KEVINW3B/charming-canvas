import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, UserPlus, TrendingUp, PiggyBank, AlertCircle, CheckCircle, XCircle, DollarSign, ArrowUpRight, ArrowDownRight, Activity, ShieldCheck,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

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

interface AdminOverviewProps {
  stats: AdminStats;
}

const growthData = [
  { month: "Jan", savings: 120000, investments: 80000, loans: 50000 },
  { month: "Feb", savings: 145000, investments: 95000, loans: 62000 },
  { month: "Mar", savings: 170000, investments: 110000, loans: 78000 },
  { month: "Apr", savings: 195000, investments: 130000, loans: 85000 },
  { month: "May", savings: 230000, investments: 155000, loans: 95000 },
  { month: "Jun", savings: 260000, investments: 180000, loans: 110000 },
];

const monthlyMembers = [
  { month: "Jan", members: 12 },
  { month: "Feb", members: 18 },
  { month: "Mar", members: 15 },
  { month: "Apr", members: 22 },
  { month: "May", members: 28 },
  { month: "Jun", members: 35 },
];

const COLORS = ["hsl(175, 60%, 42%)", "hsl(152, 55%, 42%)", "hsl(15, 75%, 55%)"];

const tooltipStyle = {
  backgroundColor: "hsl(210, 28%, 11%)",
  border: "1px solid hsl(210, 18%, 22%)",
  borderRadius: "12px",
  color: "hsl(0, 0%, 96%)",
  fontSize: "12px",
};

export function AdminOverview({ stats }: AdminOverviewProps) {
  const statCards = [
    { title: "Total Members", value: stats.totalMembers.toString(), icon: Users, color: "text-primary", bgColor: "from-primary/20 to-primary/5", trend: "+12%", trendUp: true },
    { title: "Pending Auth", value: stats.pendingMembers.toString(), icon: UserPlus, color: "text-warning", bgColor: "from-warning/20 to-warning/5", trend: stats.pendingMembers > 0 ? "Needs action" : "All clear", trendUp: false },
    { title: "Total Investments", value: `KES ${stats.totalInvestments.toLocaleString()}`, icon: TrendingUp, color: "text-accent", bgColor: "from-accent/20 to-accent/5", trend: "+8.5%", trendUp: true },
    { title: "Total Savings", value: `KES ${stats.totalSavings.toLocaleString()}`, icon: PiggyBank, color: "text-info", bgColor: "from-info/20 to-info/5", trend: "+15%", trendUp: true },
    { title: "Loans Disbursed", value: `KES ${stats.totalLoanAmount.toLocaleString()}`, icon: DollarSign, color: "text-success", bgColor: "from-success/20 to-success/5", trend: "+5.2%", trendUp: true },
    { title: "Pending Loans", value: stats.pendingLoans.toString(), icon: AlertCircle, color: "text-warning", bgColor: "from-warning/20 to-warning/5", trend: `${stats.pendingLoans} pending`, trendUp: false },
  ];

  const loanPieData = [
    { name: "Pending", value: stats.pendingLoans || 1 },
    { name: "Approved", value: stats.approvedLoans || 1 },
    { name: "Rejected", value: stats.rejectedLoans || 1 },
  ];

  const totalAssets = stats.totalInvestments + stats.totalSavings;
  const engagementRate = stats.totalMembers > 0 ? Math.round(((stats.totalMembers - stats.pendingMembers) / stats.totalMembers) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-gradient-to-r from-primary/10 via-card to-accent/10 border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Total Assets Under Management</p>
                  <p className="text-2xl md:text-3xl font-bold text-gradient-gold">KES {totalAssets.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-success/20 to-success/5">
                  <ShieldCheck className="w-8 h-8 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Member Engagement</p>
                  <p className="text-2xl md:text-3xl font-bold text-success">{engagementRate}%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5">
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Total Loans Disbursed</p>
                  <p className="text-2xl md:text-3xl font-bold text-accent">KES {stats.totalLoanAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
            <Card className="bg-card border-border/50 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-success' : 'text-warning'}`}>
                    {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-2xl font-bold tracking-tight mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-2">
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg">Financial Growth Trends</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary" /><span className="text-xs text-muted-foreground">Savings</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-accent" /><span className="text-xs text-muted-foreground">Investments</span></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(175, 60%, 42%)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(175, 60%, 42%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(15, 75%, 55%)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(15, 75%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 18%, 15%)" />
                  <XAxis dataKey="month" stroke="hsl(210, 12%, 45%)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(210, 12%, 45%)" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`KES ${value.toLocaleString()}`, undefined]} />
                  <Area type="monotone" dataKey="savings" stroke="hsl(175, 60%, 42%)" fill="url(#savingsGrad)" strokeWidth={2.5} name="Savings" />
                  <Area type="monotone" dataKey="investments" stroke="hsl(15, 75%, 55%)" fill="url(#investGrad)" strokeWidth={2.5} name="Investments" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loan Status Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="bg-card border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg">Loan Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={loanPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value" strokeWidth={0}>
                    {loanPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-3 w-full mt-2">
                <div className="text-center p-2 rounded-lg bg-primary/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertCircle className="w-3 h-3 text-primary" />
                    <span className="text-[10px] text-muted-foreground">Pending</span>
                  </div>
                  <p className="text-lg font-bold">{stats.pendingLoans}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-success/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span className="text-[10px] text-muted-foreground">Approved</span>
                  </div>
                  <p className="text-lg font-bold">{stats.approvedLoans}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-accent/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <XCircle className="w-3 h-3 text-accent" />
                    <span className="text-[10px] text-muted-foreground">Rejected</span>
                  </div>
                  <p className="text-lg font-bold">{stats.rejectedLoans}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Member Growth Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg">Member Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyMembers}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 18%, 15%)" />
                <XAxis dataKey="month" stroke="hsl(210, 12%, 45%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(210, 12%, 45%)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="members" fill="hsl(175, 60%, 42%)" radius={[6, 6, 0, 0]} name="New Members" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
