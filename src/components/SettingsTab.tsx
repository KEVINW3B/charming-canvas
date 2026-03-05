import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Lock, Loader2, User as UserIcon, Mail, Camera, CreditCard } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

interface SettingsTabProps {
  user: User | null;
  toast: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void;
}

const SettingsTab = ({ user, toast }: SettingsTabProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id_number, avatar_url")
      .eq("user_id", user!.id)
      .maybeSingle();
    if (data) {
      setIdNumber(data.id_number || "");
      setAvatarUrl(data.avatar_url || "");
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be under 2MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user!.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${publicUrl}?t=${Date.now()}`;
      await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", user!.id);
      setAvatarUrl(url);
      toast({ title: "Success", description: "Profile picture updated" });
    } catch {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase.from("profiles").update({ id_number: idNumber }).eq("user_id", user!.id);
      if (error) throw error;
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({ title: "Error", description: "Please fill in all password fields", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Password updated successfully" });
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch {
      toast({ title: "Error", description: "Failed to update password", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const initials = `${user?.user_metadata?.first_name?.[0] || ""}${user?.user_metadata?.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold">Account Settings</h2>

      {/* Profile Picture & Info */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Your account details and profile picture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="w-20 h-20 border-2 border-primary/30">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt="Profile" /> : null}
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={uploading}
              >
                {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUploadAvatar} className="hidden" />
            </div>
            <div>
              <p className="font-semibold">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <button onClick={() => fileInputRef.current?.click()} className="text-xs text-primary hover:underline mt-1">
                {uploading ? "Uploading..." : "Change photo"}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={user?.user_metadata?.first_name || ""} disabled className="bg-secondary/50" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={user?.user_metadata?.last_name || ""} disabled className="bg-secondary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Mail className="w-4 h-4" />Email</Label>
            <Input value={user?.email || ""} disabled className="bg-secondary/50" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><CreditCard className="w-4 h-4" />National ID Number</Label>
            <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Enter your ID number" />
          </div>
          <Button onClick={handleSaveProfile} disabled={savingProfile}>
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Lock className="w-5 h-5" />Change Password</CardTitle>
          <CardDescription>Update your login password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input id="newPassword" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
          </div>
          <Button onClick={handleChangePassword} disabled={loading} className="w-full md:w-auto">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
