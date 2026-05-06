import { format, formatDistanceToNow, isFuture } from "date-fns";

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const formatEventDate = (iso: string) => format(new Date(iso), "EEE, dd MMM • h:mm a");
export const formatShortDate = (iso: string) => format(new Date(iso), "dd MMM yyyy");
export const isUpcoming = (iso: string) => isFuture(new Date(iso));
export const fromNow = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true });
