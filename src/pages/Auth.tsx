import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, Key } from "lucide-react";
import logo from "@/assets/logo.png";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const loginCodeSchema = z.string().min(4, "Login code is required");

type AuthMode = "login" | "forgot";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as AuthMode) || "login";
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    if (mode === "login" && !isFirstLogin) {
      try {
        loginCodeSchema.parse(loginCode);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.loginCode = e.errors[0].message;
        }
      }

      try {
        passwordSchema.parse(password);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.password = e.errors[0].message;
        }
      }
    }

    if (isFirstLogin) {
      try {
        passwordSchema.parse(newPassword);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.newPassword = e.errors[0].message;
        }
      }

      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (mode === "login") {
        // First verify the member code
        const { data: memberData, error: memberError } = await supabase
          .from("member_codes")
          .select("*")
          .eq("email", email.toLowerCase().trim())
          .eq("is_authorized", true)
          .maybeSingle();

        if (memberError) {
          toast({
            title: "Error",
            description: "An error occurred. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (!memberData) {
          toast({
            title: "Access Denied",
            description: "Your account has not been authorized yet. Please contact the admin.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Check if login code matches
        if (memberData.login_code !== loginCode) {
          toast({
            title: "Invalid Credentials",
            description: "The login code is incorrect.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Try to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If user doesn't exist, this might be first login
          if (signInError.message.includes("Invalid login credentials")) {
            setIsFirstLogin(true);
            toast({
              title: "Set Your Password",
              description: "This appears to be your first login. Please set a password.",
            });
          } else {
            toast({
              title: "Login failed",
              description: signInError.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate("/dashboard");
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          toast({
            title: "Reset failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Email sent!",
            description: "Check your inbox for password reset instructions.",
          });
          setMode("login");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFirstLoginSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Get member data
      const { data: memberData } = await supabase
        .from("member_codes")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .eq("is_authorized", true)
        .single();

      if (!memberData) {
        toast({
          title: "Error",
          description: "Member data not found.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: newPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: memberData.first_name,
            last_name: memberData.last_name,
          },
        },
      });

      if (signUpError) {
        toast({
          title: "Setup failed",
          description: signUpError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account, then log in.",
        });
        setIsFirstLogin(false);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isFirstLogin) return "Set Your Password";
    switch (mode) {
      case "login": return "Member Login";
      case "forgot": return "Reset Password";
    }
  };

  const getDescription = () => {
    if (isFirstLogin) return "Create a secure password for your account";
    switch (mode) {
      case "login": return "Sign in with your email and login code provided by admin";
      case "forgot": return "Enter your email to receive reset instructions";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to home link */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="glass-card border-border/50">
          <CardHeader className="text-center pb-4">
            <Link to="/" className="flex justify-center mb-4">
              <img src={logo} alt="RockwellAfrica SACCO" className="w-16 h-16 object-contain" />
            </Link>
            <CardTitle className="font-display text-2xl">
              <span className="text-gradient-gold">{getTitle()}</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {getDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isFirstLogin ? (
              <form onSubmit={handleFirstLoginSetup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-destructive">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-hover"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setIsFirstLogin(false)}
                  className="w-full text-sm text-muted-foreground hover:text-primary"
                >
                  Back to login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                {mode === "login" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="loginCode">Login Code (from Admin)</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="loginCode"
                          type="text"
                          placeholder="Enter your login code"
                          value={loginCode}
                          onChange={(e) => setLoginCode(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {errors.loginCode && (
                        <p className="text-xs text-destructive">{errors.loginCode}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-hover"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            )}

            {mode === "forgot" && !isFirstLogin && (
              <div className="mt-6 text-center text-sm">
                <button
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Back to login
                </button>
              </div>
            )}

            <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Note:</strong> Only authorized members can log in. 
                Contact the admin to get your login credentials.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
