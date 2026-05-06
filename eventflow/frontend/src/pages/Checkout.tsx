import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Building2, Lock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventById } from "@/data/events";
import { formatPrice } from "@/lib/format";
import { useApp } from "@/store/AppContext";
import { toast } from "sonner";

interface CheckoutState {
  eventId: string;
  seats: string[];
  total: number;
  breakdown: { seat: string; tier: string; price: number }[];
}

const methods = [
  { id: "upi", label: "UPI", Icon: Smartphone, hint: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", Icon: CreditCard, hint: "Visa, Mastercard, Rupay" },
  { id: "netbanking", label: "Net Banking", Icon: Building2, hint: "All major banks" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user, addBooking } = useApp();
  const [state, setState] = useState<CheckoutState | null>(null);
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("checkout");
    if (!raw) {
      navigate("/events");
      return;
    }
    setState(JSON.parse(raw));
  }, [navigate]);

  if (!state) return null;
  const event = getEventById(state.eventId);
  if (!event) return null;

  const fee = Math.round(state.total * 0.05);
  const grandTotal = state.total + fee;

  const pay = async () => {
    if (!user) {
      toast.error("Please log in to complete your booking");
      navigate("/login");
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    // 95% success simulation
    if (Math.random() > 0.05) {
      const booking = addBooking({
        eventId: event.id,
        seats: state.seats,
        tier: state.breakdown[0]?.tier || "standard",
        total: grandTotal,
        paymentMethod: method,
      });
      sessionStorage.removeItem("checkout");
      navigate(`/booking/${booking.id}`);
    } else {
      setProcessing(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ChevronLeft className="size-4 mr-1" /> Back
      </Button>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Checkout</h1>
            <p className="text-muted-foreground mt-1">Almost there — choose how you'd like to pay</p>
          </div>

          <div className="glass rounded-2xl p-6 space-y-3">
            <h2 className="font-semibold mb-2">Payment method</h2>
            {methods.map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-smooth ${
                  method === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/40"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.id}
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="sr-only"
                />
                <div className={`size-10 rounded-lg grid place-items-center ${method === m.id ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>
                  <m.Icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.hint}</p>
                </div>
                <div className={`size-5 rounded-full border-2 ${method === m.id ? "border-primary bg-primary" : "border-border"}`}>
                  {method === m.id && <div className="size-full grid place-items-center text-[10px] text-primary-foreground">✓</div>}
                </div>
              </label>
            ))}
          </div>

          {method === "card" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-2xl p-6 space-y-3">
              <input placeholder="Card number" className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM / YY" className="h-11 px-4 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input placeholder="CVV" className="h-11 px-4 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <input placeholder="Name on card" className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </motion.div>
          )}

          {method === "upi" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-2xl p-6">
              <input placeholder="yourname@upi" className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </motion.div>
          )}

          {method === "netbanking" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-2xl p-6">
              <select className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>SBI</option>
                <option>Axis Bank</option>
              </select>
            </motion.div>
          )}

          <Button
            size="lg"
            className="w-full gradient-primary border-0 h-12 shadow-glow text-base"
            onClick={pay}
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                <Lock className="size-4 mr-2" /> Pay {formatPrice(grandTotal)}
              </>
            )}
          </Button>
        </motion.div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex gap-3">
              <img src={event.image} alt={event.title} className="size-20 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="font-semibold line-clamp-2">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{event.venue}, {event.city}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-1.5 text-sm">
              {state.breakdown.map((b) => (
                <div key={b.seat} className="flex justify-between">
                  <span className="text-muted-foreground">Seat {b.seat} ({b.tier})</span>
                  <span>{formatPrice(b.price)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(state.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Convenience fee</span>
                <span>{formatPrice(fee)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-bold gradient-text">{formatPrice(grandTotal)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
            <Lock className="size-3" /> Secured by 256-bit SSL encryption
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
