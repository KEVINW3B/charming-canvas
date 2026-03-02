import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserPlus,
  TrendingUp,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

// Mock growth data for chart
const growthData = [
  { month: "Jan", savings: 120000, investments: 80000, loans: 50000 },
  { month: "Feb", savings: 145000, investments: 95000, loans: 62000 },
  { month: "Mar", savings: 170000, investments: 110000, loans: 78000 },
  { month: "Apr", savings: 195000, investments: 130000, loans: 85000 },
  { month: "May", savings: 230000, investments: 155000, loans: 95000 },
  { month: "Jun", savings: 260000, investments: 180000, loans: 110000 },
];

const COLORS = ["hsl(175, 60%, 42%)", "hsl(15, 75%, 55%)", "hsl(205, 70%, 50%)", "hsl(152, 55%, 42%)"];

export function AdminOverview({ stats }: AdminOverviewProps) {
  const statCards = [
    { title: "Total Members", value: stats.totalMembers.toString(), icon: Users, color: "text-primary", bgColor: "bg-primary/15", trend: "+12%", trendUp: true },
    { title: "Pending Auth", value: stats.pendingMembers.toString(), icon: UserPlus, color: "text-warning", bgColor: "bg-warning/15", trend: stats.pendingMembers > 0 ? "Action needed" : "All clear", trendUp: false },
    { title: "Total Investments", value: `KES ${stats.totalInvestments.toLocaleString()}`, icon: TrendingUp, color: "text-accent", bgColor: "bg-accent/15", trend: "+8.5%", trendUp: true },
    { title: "Total Savings", value: `KES ${stats.totalSavings.toLocaleString()}`, icon: PiggyBank, color: "text-info", bgColor: "bg-info/15", trend: "+15%", trendUp: true },
    { title: "Loans Disbursed", value: `KES ${stats.totalLoanAmount.toLocaleString()}`, icon: DollarSign, color: "text-success", bgColor: "bg-success/15", trend: "+5.2%", trendUp: true },
    { title: "Pending Loans", value: stats.pendingLoans.toString(), icon: AlertCircle, color: "text-warning", bgColor: "bg-warning/15", trend: `${stats.pendingLoans} pending`, trendUp: false },
  ];

  const loanPieData = [
    { name: "Pending", value: stats.pendingLoans || 1 },
    { name: "Approved", value: stats.approvedLoans || 1 },
    { name: "Rejected", value: stats.rejectedLoans || 1 },
  ];

  const totalAssets = stats.totalInvestments + stats.totalSavings;

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg">Financial Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(175, 60%, 42%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(175, 60%, 42%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(15, 75%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(15, 75%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 18%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(210, 12%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(210, 12%, 55%)" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(210, 28%, 11%)",
                      border: "1px solid hsl(210, 18%, 18%)",
                      borderRadius: "12px",
                      color: "hsl(0, 0%, 96%)",
                    }}
                    formatter={(value: number) => [`KES ${value.toLocaleString()}`, undefined]}
                  />
                  <Area type="monotone" dataKey="savings" stroke="hsl(175, 60%, 42%)" fill="url(#savingsGrad)" strokeWidth={2} name="Savings" />
                  <Area type="monotone" dataKey="investments" stroke="hsl(15, 75%, 55%)" fill="url(#investGrad)" strokeWidth={2} name="Investments" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">Savings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-xs text-muted-foreground">Investments</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loan Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-card border-border/50 h-full">
            <CardHeader>
              <CardTitle className="font-display text-lg">Loan Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={loanPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {loanPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(210, 28%, 11%)",
                      border: "1px solid hsl(210, 18%, 18%)",
                      borderRadius: "12px",
                      color: "hsl(0, 0%, 96%)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-3 w-full mt-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertCircle className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </div>
                  <p className="text-lg font-bold">{stats.pendingLoans}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-accent" />
                    <span className="text-xs text-muted-foreground">Approved</span>
                  </div>
                  <p className="text-lg font-bold">{stats.approvedLoans}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <XCircle className="w-3 h-3 text-info" />
                    <span className="text-xs text-muted-foreground">Rejected</span>
                  </div>
                  <p className="text-lg font-bold">{stats.rejectedLoans}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Assets Under Management</p>
                <p className="text-3xl font-bold text-gradient-gold">KES {totalAssets.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-primary/10">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member Engagement Rate</p>
                <p className="text-3xl font-bold text-gradient-gold">
                  {stats.totalMembers > 0 ? Math.round(((stats.totalMembers - stats.pendingMembers) / stats.totalMembers) * 100) : 0}%
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/10">
                <Users className="w-8 h-8 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
