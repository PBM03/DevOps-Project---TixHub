import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventById } from "@/data/events";
import { formatPrice } from "@/lib/format";

const ROWS = "ABCDEFGH".split("");
const COLS = 12;

// Deterministic "unavailable" set based on event id
const unavailableFor = (eventId: string) => {
  const set = new Set<string>();
  let h = 0;
  for (const c of eventId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = 0; i < 18; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const r = ROWS[h % ROWS.length];
    const col = (h % COLS) + 1;
    set.add(`${r}${col}`);
  }
  return set;
};

const tierForRow = (row: string) => {
  if ("AB".includes(row)) return "platinum";
  if ("CD".includes(row)) return "gold";
  if ("EF".includes(row)) return "silver";
  return "standard";
};

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = getEventById(id || "");
  const unavailable = useMemo(() => unavailableFor(id || ""), [id]);
  const [selected, setSelected] = useState<string[]>([]);

  if (!event) return null;

  const tierMap = Object.fromEntries(event.priceTiers.map((t) => [t.id, t]));

  const toggle = (seat: string) => {
    if (unavailable.has(seat)) return;
    setSelected((s) => (s.includes(seat) ? s.filter((x) => x !== seat) : s.length >= 8 ? s : [...s, seat]));
  };

  const total = selected.reduce((sum, seat) => sum + tierMap[tierForRow(seat[0])].price, 0);

  const proceed = () => {
    if (selected.length === 0) return;
    const state = {
      eventId: event.id,
      seats: selected,
      total,
      breakdown: selected.map((s) => ({ seat: s, tier: tierForRow(s[0]), price: tierMap[tierForRow(s[0])].price })),
    };
    sessionStorage.setItem("checkout", JSON.stringify(state));
    navigate("/checkout");
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ChevronLeft className="size-4 mr-1" /> Back
      </Button>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <div className="mb-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold">Select your seats</h1>
            <p className="text-muted-foreground mt-1">{event.title}</p>
          </div>

          {/* Legend */}
          <div className="glass rounded-xl p-4 mb-6 flex flex-wrap items-center justify-center gap-4 text-xs">
            {event.priceTiers.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="size-3 rounded" style={{ background: t.color }} />
                <span>{t.name} • {formatPrice(t.price)}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="size-3 rounded bg-muted-foreground/30" />
              <span>Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded gradient-primary" />
              <span>Selected</span>
            </div>
          </div>

          {/* Stage */}
          <div className="relative">
            <div className="mx-auto max-w-2xl mb-8 h-2 gradient-primary rounded-full shadow-glow" />
            <p className="text-center text-xs text-muted-foreground uppercase tracking-[0.3em] -mt-6 mb-8">Stage</p>

            <div className="space-y-2 overflow-x-auto scrollbar-hide pb-2">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center justify-center gap-1.5">
                  <span className="w-6 text-xs text-muted-foreground font-mono">{row}</span>
                  {Array.from({ length: COLS }).map((_, i) => {
                    const seat = `${row}${i + 1}`;
                    const isUn = unavailable.has(seat);
                    const isSel = selected.includes(seat);
                    const tier = tierMap[tierForRow(row)];
                    return (
                      <motion.button
                        key={seat}
                        whileHover={{ scale: isUn ? 1 : 1.15 }}
                        whileTap={{ scale: isUn ? 1 : 0.9 }}
                        onClick={() => toggle(seat)}
                        disabled={isUn}
                        title={`${seat} • ${tier.name} • ${formatPrice(tier.price)}`}
                        className={`size-7 sm:size-8 rounded-md text-[10px] font-semibold transition-smooth ${
                          isUn
                            ? "bg-muted-foreground/20 cursor-not-allowed"
                            : isSel
                            ? "gradient-primary text-primary-foreground shadow-glow"
                            : "hover:opacity-80"
                        }`}
                        style={!isUn && !isSel ? { background: tier.color, color: "white" } : {}}
                      >
                        {i + 1}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="glass rounded-2xl p-6 shadow-elegant space-y-4">
            <h3 className="font-display text-xl font-bold">Order summary</h3>
            <div className="text-sm">
              <p className="font-semibold">{event.title}</p>
              <p className="text-xs text-muted-foreground">{event.venue}, {event.city}</p>
            </div>

            <div className="border-t border-border pt-4 space-y-2 min-h-[100px]">
              {selected.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Select seats to continue</p>
              ) : (
                selected.map((seat) => {
                  const tier = tierMap[tierForRow(seat[0])];
                  return (
                    <div key={seat} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ background: tier.color }} />
                        <span className="font-mono">{seat}</span>
                        <span className="text-muted-foreground text-xs">{tier.name}</span>
                      </div>
                      <span>{formatPrice(tier.price)}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-bold gradient-text">{formatPrice(total)}</span>
            </div>

            <Button
              className="w-full gradient-primary border-0 h-12 shadow-glow"
              disabled={selected.length === 0}
              onClick={proceed}
            >
              Proceed to payment
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SeatSelection;
