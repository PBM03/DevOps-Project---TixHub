import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import { events } from "@/data/events";
import { EventCard } from "@/components/EventCard";

const Wishlist = () => {
  const { wishlist } = useApp();
  const list = wishlist.map((id) => events.find((e) => e.id === id)).filter(Boolean) as typeof events;

  return (
    <div className="container py-10">
      <h1 className="font-display text-4xl md:text-5xl font-bold flex items-center gap-3">
        <Heart className="size-8 fill-primary text-primary" /> Your wishlist
      </h1>
      <p className="text-muted-foreground mt-2">{list.length} saved event{list.length !== 1 && "s"}</p>

      {list.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center mt-10">
          <Heart className="size-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No saved events yet — start exploring!</p>
          <Button asChild className="gradient-primary border-0">
            <Link to="/events">Browse events</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
          {list.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
