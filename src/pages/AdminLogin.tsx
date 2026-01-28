import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, UserPlus } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      toast({
        title: "Account Created",
        description: "You can now sign in with your credentials.",
      });
      setIsSignUp(false);
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Wait a moment for auth state to update
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Login - Lecrafto International</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                {isSignUp ? (
                  <UserPlus className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <Lock className="w-8 h-8 text-primary-foreground" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {isSignUp ? "Admin Sign Up" : "Admin Login"}
              </h1>
              <p className="text-muted-foreground mt-2">Lecrafto International</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  minLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (isSignUp ? "Creating Account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
