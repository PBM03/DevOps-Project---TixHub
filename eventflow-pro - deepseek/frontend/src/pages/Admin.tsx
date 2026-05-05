import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Calendar, Users, DollarSign, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { events as seedEvents, Event, categories } from "@/data/events";
import { formatEventDate, formatPrice } from "@/lib/format";
import { useApp } from "@/store/AppContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Admin = () => {
  const [events, setEvents] = useState<Event[]>(seedEvents);
  const [tab, setTab] = useState<"events" | "bookings">("events");
  const [editing, setEditing] = useState<Event | null>(null);
  const [open, setOpen] = useState(false);
  const { bookings } = useApp();

  const stats = [
    { label: "Total events", value: events.length, Icon: Calendar, color: "from-primary to-primary-glow" },
    { label: "Total bookings", value: bookings.length, Icon: Users, color: "from-cyan-500 to-blue-600" },
    { label: "Revenue", value: formatPrice(bookings.reduce((s, b) => s + b.total, 0)), Icon: DollarSign, color: "from-emerald-500 to-teal-600" },
  ];

  const handleDelete = (id: string) => {
    setEvents((e) => e.filter((x) => x.id !== id));
    toast.success("Event deleted");
  };

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (e: Event) => {
    setEditing(e);
    setOpen(true);
  };

  const saveEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      category: fd.get("category") as Event["category"],
      venue: fd.get("venue") as string,
      city: fd.get("city") as string,
      date: fd.get("date") as string,
      description: fd.get("description") as string,
      basePrice: Number(fd.get("basePrice")),
    };
    if (editing) {
      setEvents((list) =>
        list.map((x) => (x.id === editing.id ? { ...x, ...data } : x))
      );
      toast.success("Event updated");
    } else {
      const newEvent: Event = {
        id: "evt-" + Date.now(),
        title: data.title,
        category: data.category,
        image: editing?.image || seedEvents[0].image,
        date: data.date || new Date().toISOString(),
        venue: data.venue,
        city: data.city,
        description: data.description,
        artists: [{ name: "TBA", role: "Performer" }],
        rating: 4.5,
        popularity: 50,
        priceTiers: [
          { id: "platinum", name: "Platinum", price: data.basePrice * 3, color: "hsl(280 90% 65%)" },
          { id: "gold", name: "Gold", price: data.basePrice * 2, color: "hsl(40 95% 55%)" },
          { id: "silver", name: "Silver", price: data.basePrice * 1.4, color: "hsl(220 10% 70%)" },
          { id: "standard", name: "Standard", price: data.basePrice, color: "hsl(150 65% 50%)" },
        ],
        duration: "2h",
        language: "English",
      };
      setEvents((list) => [newEvent, ...list]);
      toast.success("Event created");
    }
    setOpen(false);
  };

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Admin panel</h1>
          <p className="text-muted-foreground mt-2">Manage events and bookings</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary border-0 shadow-glow">
              <Plus className="size-4 mr-2" /> New event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit event" : "Create new event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={saveEvent} className="space-y-3">
              <input name="title" defaultValue={editing?.title} placeholder="Event title" required className="w-full h-11 px-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <div className="grid grid-cols-2 gap-3">
                <select name="category" defaultValue={editing?.category} required className="h-11 px-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <input name="basePrice" type="number" defaultValue={editing?.priceTiers[3]?.price || 999} placeholder="Base price (₹)" required className="h-11 px-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="venue" defaultValue={editing?.venue} placeholder="Venue" required className="h-11 px-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input name="city" defaultValue={editing?.city} placeholder="City" required className="h-11 px-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <input name="date" type="datetime-local" defaultValue={editing?.date.slice(0, 16)} required className="w-full h-11 px-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <textarea name="description" defaultValue={editing?.description} placeholder="Description" rows={3} required className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <div className="border border-dashed border-border rounded-lg p-4 text-center">
                <ImageIcon className="size-6 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Drop image or click to upload (UI only)</p>
              </div>
              <Button type="submit" className="w-full gradient-primary border-0">
                {editing ? "Save changes" : "Create event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 bg-gradient-to-br ${s.color} text-white`}>
            <s.Icon className="size-6 opacity-80" />
            <p className="text-sm opacity-80 mt-3">{s.label}</p>
            <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-2 border-b border-border">
        {(["events", "bookings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium capitalize border-b-2 ${
              tab === t ? "border-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "events" ? (
        <div className="mt-6 space-y-2">
          {events.map((e) => (
            <div key={e.id} className="glass rounded-xl p-3 flex items-center gap-4">
              <img src={e.image} alt={e.title} className="size-14 rounded-lg object-cover" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{e.title}</p>
                  <Badge variant="secondary" className="text-xs">{e.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{formatEventDate(e.date)} • {e.venue}, {e.city}</p>
              </div>
              <p className="text-sm font-bold gradient-text hidden sm:block">{formatPrice(Math.min(...e.priceTiers.map(t => t.price)))}</p>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(e)}>
                  <Edit2 className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(e.id)} className="text-destructive">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {bookings.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-muted-foreground">No bookings yet</div>
          ) : (
            bookings.map((b) => {
              const ev = seedEvents.find((e) => e.id === b.eventId);
              return (
                <div key={b.id} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">{b.id}</p>
                    <p className="font-semibold truncate">{ev?.title}</p>
                    <p className="text-xs text-muted-foreground">Seats: {b.seats.join(", ")}</p>
                  </div>
                  <Badge variant={b.status === "confirmed" ? "default" : "destructive"}>{b.status}</Badge>
                  <p className="font-bold gradient-text">{formatPrice(b.total)}</p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
