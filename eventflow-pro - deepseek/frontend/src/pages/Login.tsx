import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import { toast } from "sonner";
import heroImg from "@/assets/hero-concert.jpg";

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}!`);
      navigate(u.role === "admin" ? "/admin" : from);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/40 to-primary/30" />
        <div className="relative h-full flex flex-col justify-between p-10">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="size-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Ticket className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Tix<span className="gradient-text">Hub</span></span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight max-w-md">
              Your next unforgettable night out is one click away.
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md">
              Join thousands of fans booking premium experiences every day.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="w-full max-w-sm space-y-5"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-4">
            <div className="size-9 rounded-xl gradient-primary grid place-items-center">
              <Ticket className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Tix<span className="gradient-text">Hub</span></span>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-1 text-sm">Sign in to continue your journey</p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          </div>

          <Button type="submit" className="w-full h-12 gradient-primary border-0 shadow-glow" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Tip: use an email starting with <span className="font-mono text-foreground">admin</span> to access the admin panel.
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
