import { Link } from "react-router-dom";
import { Heart, MapPin, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Event } from "@/data/events";
import { formatEventDate, formatPrice } from "@/lib/format";
import { useApp } from "@/store/AppContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const EventCard = ({ event, index = 0 }: { event: Event; index?: number }) => {
  const { wishlist, toggleWishlist } = useApp();
  const liked = wishlist.includes(event.id);
  const fromPrice = Math.min(...event.priceTiers.map((t) => t.price));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/events/${event.id}`} className="block hover-lift rounded-2xl overflow-hidden bg-card border border-border/50">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(event.id);
            }}
            className="absolute top-3 right-3 size-9 rounded-full glass grid place-items-center hover:scale-110 transition-smooth"
            aria-label="Toggle wishlist"
          >
            <Heart className={cn("size-4 transition-smooth", liked && "fill-primary text-primary")} />
          </button>

          {event.trending && (
            <Badge className="absolute top-3 left-3 gradient-primary border-0 text-primary-foreground">
              🔥 Trending
            </Badge>
          )}

          <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
            <Badge variant="secondary" className="text-xs">
              {event.category}
            </Badge>
            <h3 className="font-display font-bold text-lg leading-tight line-clamp-2 text-foreground">
              {event.title}
            </h3>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            <span className="truncate">{event.venue} • {event.city}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-warning text-warning" />
              <span className="text-sm font-semibold">{event.rating}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">From</p>
              <p className="font-bold text-sm gradient-text">{formatPrice(fromPrice)}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
