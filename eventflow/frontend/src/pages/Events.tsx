import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3x3, List } from "lucide-react";
import { events, categories, cities, EventCategory } from "@/data/events";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/format";

const Events = () => {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [debounced, setDebounced] = useState(q);
  const [city, setCity] = useState(params.get("city") || "All Cities");
  const [category, setCategory] = useState<string>(params.get("category") || "");
  const [price, setPrice] = useState<number>(10000);
  const [sort, setSort] = useState<"popularity" | "price" | "date">("popularity");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (debounced) p.set("q", debounced);
    if (city !== "All Cities") p.set("city", city);
    if (category) p.set("category", category);
    setParams(p, { replace: true });
  }, [debounced, city, category, setParams]);

  const filtered = useMemo(() => {
    let list = events.filter((e) => {
      const matchQ = !debounced || (e.title + e.description + e.venue + e.artists.map((a) => a.name).join(" "))
        .toLowerCase()
        .includes(debounced.toLowerCase());
      const matchCity = city === "All Cities" || e.city === city;
      const matchCat = !category || e.category === category;
      const matchPrice = Math.min(...e.priceTiers.map((t) => t.price)) <= price;
      return matchQ && matchCity && matchCat && matchPrice;
    });
    list = [...list].sort((a, b) => {
      if (sort === "popularity") return b.popularity - a.popularity;
      if (sort === "price")
        return Math.min(...a.priceTiers.map((t) => t.price)) - Math.min(...b.priceTiers.map((t) => t.price));
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return list;
  }, [debounced, city, category, price, sort]);

  return (
    <div className="container py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Discover events</h1>
        <p className="text-muted-foreground mt-2">{filtered.length} experiences waiting for you</p>
      </motion.div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* FILTERS */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="glass rounded-2xl p-5 space-y-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4" />
              <h3 className="font-semibold">Filters</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Find events..."
                className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">City</label>
              <div className="flex flex-wrap gap-1.5">
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                      city === c ? "gradient-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/70"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCategory("")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                    !category ? "gradient-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/70"
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCategory(c.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                      category === c.name ? "gradient-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/70"
                    }`}
                  >
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Max price</label>
                <span className="text-sm font-semibold gradient-text">{formatPrice(price)}</span>
              </div>
              <Slider
                value={[price]}
                onValueChange={(v) => setPrice(v[0])}
                min={500}
                max={10000}
                step={500}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setQ(""); setCity("All Cities"); setCategory(""); setPrice(10000);
              }}
            >
              Reset filters
            </Button>
          </div>
        </aside>

        {/* RESULTS */}
        <div>
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {category && <Badge variant="secondary">{category} <button className="ml-1" onClick={() => setCategory("")}>×</button></Badge>}
              {city !== "All Cities" && <Badge variant="secondary">{city} <button className="ml-1" onClick={() => setCity("All Cities")}>×</button></Badge>}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as never)}
                className="h-9 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="popularity">Most popular</option>
                <option value="price">Price: low to high</option>
                <option value="date">Date: soonest</option>
              </select>
              <div className="hidden sm:flex rounded-lg border border-border overflow-hidden">
                <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-secondary" : ""}`}>
                  <Grid3x3 className="size-4" />
                </button>
                <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-secondary" : ""}`}>
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 glass rounded-2xl">
              <p className="text-muted-foreground">No events match your filters.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((e, i) => (
                <motion.a
                  key={e.id}
                  href={`/events/${e.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-4 p-3 rounded-2xl glass hover-lift"
                >
                  <img src={e.image} alt={e.title} className="size-24 sm:size-32 rounded-xl object-cover" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" className="mb-1">{e.category}</Badge>
                    <h3 className="font-display font-bold text-lg truncate">{e.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{e.venue} • {e.city}</p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-bold gradient-text">{formatPrice(Math.min(...e.priceTiers.map(t => t.price)))}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
