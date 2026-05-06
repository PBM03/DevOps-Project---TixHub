import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="size-9 rounded-xl gradient-primary grid place-items-center">
            <Ticket className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">Tix<span className="gradient-text">Hub</span></span>
        </Link>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="size-16 rounded-full bg-success/20 grid place-items-center mx-auto">
              <CheckCircle2 className="size-8 text-success" />
            </div>
            <h1 className="font-display text-2xl font-bold">Check your inbox</h1>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login"><ArrowLeft className="size-4 mr-2" /> Back to login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <h1 className="font-display text-3xl font-bold">Forgot password?</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Enter your email and we'll send you a reset link.
              </p>
            </div>
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
            <Button type="submit" className="w-full h-12 gradient-primary border-0 shadow-glow">
              Send reset link
            </Button>
            <Link to="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3.5 inline mr-1" /> Back to login
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
