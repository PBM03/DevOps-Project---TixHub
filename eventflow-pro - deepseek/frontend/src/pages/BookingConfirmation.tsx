import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Calendar, MapPin, Ticket as TicketIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import { getEventById } from "@/data/events";
import { formatEventDate, formatPrice } from "@/lib/format";
import { toast } from "sonner";

const BookingConfirmation = () => {
  const { id } = useParams();
  const { bookings } = useApp();
  const booking = bookings.find((b) => b.id === id);
  const event = booking ? getEventById(booking.eventId) : null;

  if (!booking || !event) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Booking not found</h1>
        <Button asChild className="mt-6"><Link to="/dashboard">Go to dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="size-20 rounded-full bg-success/20 grid place-items-center mx-auto mb-4"
        >
          <CheckCircle2 className="size-10 text-success" />
        </motion.div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Booking confirmed!</h1>
        <p className="text-muted-foreground mt-2">Your tickets have been sent to your email.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl overflow-hidden shadow-elegant relative"
      >
        {/* Ticket */}
        <div className="relative">
          <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>

        <div className="bg-card p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center border-x border-b border-border">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Booking ID</p>
              <p className="font-mono font-bold text-lg gradient-text">{booking.id}</p>
            </div>
            <h2 className="font-display text-2xl font-bold">{event.title}</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" /> {formatEventDate(event.date)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" /> {event.venue}, {event.city}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TicketIcon className="size-4" /> Seats: <span className="font-mono text-foreground">{booking.seats.join(", ")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <span className="px-2 py-1 rounded-md bg-success/20 text-success text-xs font-semibold">PAID</span>
              <span className="font-bold gradient-text">{formatPrice(booking.total)}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="bg-white p-3 rounded-xl">
              <QRCodeSVG value={booking.id} size={140} />
            </div>
            <p className="text-xs text-muted-foreground">Scan at venue entry</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-3 justify-center mt-8">
        <Button onClick={() => toast.success("Ticket downloaded!")} className="gradient-primary border-0 gap-2">
          <Download className="size-4" /> Download ticket
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard">View all bookings</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/events">Browse more events</Link>
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
