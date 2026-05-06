import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Search, MapPin, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { events, categories, cities } from "@/data/events";
import { EventCard } from "@/components/EventCard";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";

const featured = events.filter((e) => e.featured);
const trending = events.filter((e) => e.trending);

const Home = () => {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const { recentlyViewed } = useApp();
  const [search, setSearch] = useState({ q: "", city: "All Cities", category: "" });

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.q) params.set("q", search.q);
    if (search.city && search.city !== "All Cities") params.set("city", search.city);
    if (search.category) params.set("category", search.category);
    navigate(`/events?${params.toString()}`);
  };

  const recent = recentlyViewed.map((id) => events.find((e) => e.id === id)).filter(Boolean);

  return (
    <div className="space-y-20 pb-12">
      {/* HERO CAROUSEL */}
      <section className="relative h-[80vh] min-h-[560px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={featured[slide].image}
              alt={featured[slide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative h-full container flex flex-col justify-end pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium">
                <Sparkles className="size-3.5 text-primary" />
                Featured Event
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                {featured[slide].title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl">
                {featured[slide].description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="gradient-primary border-0 shadow-glow text-base h-12 px-8">
                  <Link to={`/events/${featured[slide].id}`}>
                    Book Now <ChevronRight className="size-5 ml-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base h-12 px-8 glass border-border">
                  <Link to="/events">Explore All</Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 right-6 flex gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-primary" : "w-4 bg-muted"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="container -mt-32 relative z-10">
        <motion.form
          onSubmit={onSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 md:p-6 shadow-elegant grid gap-3 md:grid-cols-[1fr_200px_200px_auto]"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={search.q}
              onChange={(e) => setSearch({ ...search, q: e.target.value })}
              placeholder="Search events, artists..."
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <select
              value={search.city}
              onChange={(e) => setSearch({ ...search, city: e.target.value })}
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <select
              value={search.category}
              onChange={(e) => setSearch({ ...search, category: e.target.value })}
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <Button type="submit" size="lg" className="gradient-primary border-0 h-12 px-8">
            Search
          </Button>
        </motion.form>
      </section>

      {/* CATEGORIES */}
      <section className="container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Browse by category</h2>
            <p className="text-muted-foreground mt-1">Find experiences that match your vibe</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/events?category=${cat.name}`}
                className={`block rounded-2xl p-5 bg-gradient-to-br ${cat.gradient} hover-lift text-white aspect-square flex flex-col justify-between`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-display font-bold">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <SectionRow title="🔥 Trending now" subtitle="What everyone's booking this week" items={trending} />

      {/* RECENTLY VIEWED */}
      {recent.length > 0 && (
        <SectionRow
          title="Recently viewed"
          subtitle="Pick up where you left off"
          items={recent as typeof events}
        />
      )}

      {/* ALL */}
      <SectionRow title="All events" subtitle="Discover something new" items={events} viewAll />
    </div>
  );
};

const SectionRow = ({
  title,
  subtitle,
  items,
  viewAll,
}: {
  title: string;
  subtitle: string;
  items: typeof events;
  viewAll?: boolean;
}) => (
  <section className="container">
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="font-display text-3xl md:text-4xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {viewAll && (
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/events">View all <ChevronRight className="size-4 ml-1" /></Link>
        </Button>
      )}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.slice(0, 8).map((event, i) => (
        <EventCard key={event.id} event={event} index={i} />
      ))}
    </div>
  </section>
);

export default Home;
