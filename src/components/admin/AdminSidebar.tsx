import {
  BarChart3,
  Users,
  FileText,
  Calendar,
  Megaphone,
  DollarSign,
  Home,
  LogOut,
  Shield,
  Wallet,
  FolderOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
}

const menuItems = [
  { id: "overview", title: "Overview", icon: BarChart3 },
  { id: "members", title: "Members", icon: Users },
  { id: "loans", title: "Loans & Savings", icon: FileText },
  { id: "deposits", title: "Deposit Verification", icon: Wallet },
  { id: "meetings", title: "Meetings", icon: Calendar },
  { id: "notices", title: "Notices", icon: Megaphone },
  { id: "finances", title: "Finances", icon: DollarSign },
  { id: "documents", title: "Documents", icon: FolderOpen },
];

export function AdminSidebar({ activeTab, onTabChange, onSignOut }: AdminSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-border/50">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-9 h-9 object-contain flex-shrink-0" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold text-gradient-gold">RockwellAfrica</span>
              <span className="text-[10px] text-muted-foreground">Admin Panel</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Member Portal">
                  <Link to="/dashboard">
                    <Shield className="w-4 h-4" />
                    <span>Member Portal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Main Website">
                  <Link to="/">
                    <Home className="w-4 h-4" />
                    <span>Main Website</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
