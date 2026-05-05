import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Languages, Star, Heart, Share2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEventById } from "@/data/events";
import { formatEventDate, formatPrice } from "@/lib/format";
import { useApp } from "@/store/AppContext";
import { toast } from "sonner";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = getEventById(id || "");
  const { wishlist, toggleWishlist, addRecentlyViewed } = useApp();

  useEffect(() => {
    if (event) addRecentlyViewed(event.id);
    window.scrollTo(0, 0);
  }, [event?.id]);

  if (!event) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Event not found</h1>
        <Button asChild className="mt-6"><Link to="/events">Browse events</Link></Button>
      </div>
    );
  }

  const liked = wishlist.includes(event.id);
  const fromPrice = Math.min(...event.priceTiers.map((t) => t.price));

  return (
    <div>
      {/* Banner */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />

        <div className="container relative h-full flex flex-col justify-end pb-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 glass"
          >
            <ChevronLeft className="size-4 mr-1" /> Back
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="gradient-primary border-0">{event.category}</Badge>
              {event.trending && <Badge variant="secondary">🔥 Trending</Badge>}
              <div className="flex items-center gap-1 text-sm">
                <Star className="size-4 fill-warning text-warning" />
                <span className="font-semibold">{event.rating}</span>
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">{event.title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{event.description}</p>
          </motion.div>
        </div>
      </section>

      <div className="container py-10 grid lg:grid-cols-[1fr_380px] gap-10">
        {/* Details */}
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { Icon: Calendar, label: "When", value: formatEventDate(event.date) },
              { Icon: MapPin, label: "Where", value: `${event.venue}, ${event.city}` },
              { Icon: Clock, label: "Duration", value: event.duration },
              { Icon: Languages, label: "Language", value: event.language },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-4">
                <item.Icon className="size-5 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-4">About this event</h2>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Join us for an unforgettable evening packed with energy, emotion and moments you'll want to relive again and again. Doors open 30 minutes before showtime.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Lineup</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {event.artists.map((a) => (
                <div key={a.name} className="glass rounded-xl p-4 flex items-center gap-3">
                  <div className="size-12 rounded-full gradient-primary grid place-items-center font-bold text-primary-foreground">
                    {a.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Price tiers</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {event.priceTiers.map((t) => (
                <div key={t.id} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="size-3 rounded-full" style={{ background: t.color }} />
                    <p className="font-semibold">{t.name}</p>
                  </div>
                  <p className="font-bold gradient-text">{formatPrice(t.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <div className="glass rounded-2xl p-6 shadow-elegant">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Starting from</p>
            <p className="font-display text-4xl font-bold gradient-text mt-1">{formatPrice(fromPrice)}</p>
            <p className="text-xs text-muted-foreground mt-1">per ticket • taxes included</p>

            <Button
              asChild
              size="lg"
              className="w-full mt-5 gradient-primary border-0 shadow-glow h-12 text-base"
            >
              <Link to={`/events/${event.id}/seats`}>Book Now</Link>
            </Button>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button
                variant="outline"
                onClick={() => {
                  toggleWishlist(event.id);
                  toast.success(liked ? "Removed from wishlist" : "Added to wishlist");
                }}
                className="gap-2"
              >
                <Heart className={`size-4 ${liked ? "fill-primary text-primary" : ""}`} />
                {liked ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="gap-2"
              >
                <Share2 className="size-4" /> Share
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 text-sm space-y-2">
            <p className="font-semibold">Good to know</p>
            <ul className="text-muted-foreground space-y-1.5 text-xs">
              <li>• Tickets are non-refundable</li>
              <li>• Valid government ID required at venue</li>
              <li>• Children below 5 not permitted</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetail;
