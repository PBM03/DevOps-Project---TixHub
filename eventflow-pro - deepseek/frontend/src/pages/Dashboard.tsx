import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/store/AppContext";
import { getEventById } from "@/data/events";
import { formatEventDate, formatPrice, isUpcoming } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";

const Dashboard = () => {
  const { user, bookings, cancelBooking } = useApp();
  const [tab, setTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");

  const enriched = bookings
    .map((b) => ({ ...b, event: getEventById(b.eventId)! }))
    .filter((b) => b.event);

  const upcoming = enriched.filter((b) => b.status === "confirmed" && isUpcoming(b.event.date));
  const past = enriched.filter((b) => b.status === "confirmed" && !isUpcoming(b.event.date));
  const cancelled = enriched.filter((b) => b.status === "cancelled");
  const list = tab === "upcoming" ? upcoming : tab === "past" ? past : cancelled;

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl font-bold">Hi, {user?.name} 👋</h1>
        <p className="text-muted-foreground mt-2">Manage your bookings and upcoming events</p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        {[
          { label: "Total bookings", value: enriched.length, color: "from-primary to-primary-glow" },
          { label: "Upcoming", value: upcoming.length, color: "from-cyan-500 to-blue-600" },
          { label: "Total spent", value: formatPrice(enriched.reduce((s, b) => s + b.total, 0)), color: "from-emerald-500 to-teal-600" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 bg-gradient-to-br ${s.color} text-white`}>
            <p className="text-sm opacity-80">{s.label}</p>
            <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-2 border-b border-border">
        {(["upcoming", "past", "cancelled"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-smooth ${
              tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t} ({t === "upcoming" ? upcoming.length : t === "past" ? past.length : cancelled.length})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {list.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Ticket className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No {tab} bookings</p>
            <Button asChild className="mt-4 gradient-primary border-0">
              <Link to="/events">Discover events</Link>
            </Button>
          </div>
        ) : (
          list.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4"
            >
              <img src={b.event.image} alt={b.event.title} className="w-full sm:w-32 h-32 rounded-xl object-cover" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <Badge variant="secondary">{b.event.category}</Badge>
                  {b.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
                </div>
                <h3 className="font-display font-bold text-lg mt-1.5">{b.event.title}</h3>
                <div className="text-xs text-muted-foreground space-y-1 mt-2">
                  <p className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {formatEventDate(b.event.date)}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {b.event.venue}, {b.event.city}</p>
                  <p className="flex items-center gap-1.5"><Ticket className="size-3.5" /> Seats: <span className="font-mono">{b.seats.join(", ")}</span></p>
                </div>
              </div>
              <div className="flex sm:flex-col items-end justify-between gap-2">
                <div className="text-right">
                  <p className="font-mono text-xs text-muted-foreground">{b.id}</p>
                  <p className="font-bold gradient-text">{formatPrice(b.total)}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/booking/${b.id}`}>View</Link>
                  </Button>
                  {b.status === "confirmed" && isUpcoming(b.event.date) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        cancelBooking(b.id);
                        toast.success("Booking cancelled");
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
