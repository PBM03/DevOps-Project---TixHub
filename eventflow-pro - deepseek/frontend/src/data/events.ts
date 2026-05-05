import edm from "@/assets/event-edm.jpg";
import orchestra from "@/assets/event-orchestra.jpg";
import workshop from "@/assets/event-workshop.jpg";
import theater from "@/assets/event-theater.jpg";
import rock from "@/assets/event-rock.jpg";
import sports from "@/assets/event-sports.jpg";
import comedy from "@/assets/hero-comedy.jpg";
import tech from "@/assets/hero-tech.jpg";

export type EventCategory =
  | "Concerts"
  | "Comedy"
  | "Tech"
  | "Workshops"
  | "Sports"
  | "Theater";

export interface PriceTier {
  id: string;
  name: string;
  price: number;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  image: string;
  date: string; // ISO
  venue: string;
  city: string;
  description: string;
  artists: { name: string; role: string }[];
  rating: number;
  popularity: number;
  trending?: boolean;
  featured?: boolean;
  priceTiers: PriceTier[];
  duration: string;
  language: string;
}

export const categories: { name: EventCategory; icon: string; gradient: string }[] = [
  { name: "Concerts", icon: "🎵", gradient: "from-fuchsia-500 to-purple-600" },
  { name: "Comedy", icon: "🎭", gradient: "from-orange-500 to-red-600" },
  { name: "Tech", icon: "💻", gradient: "from-cyan-500 to-blue-600" },
  { name: "Workshops", icon: "🎨", gradient: "from-emerald-500 to-teal-600" },
  { name: "Sports", icon: "⚽", gradient: "from-amber-500 to-orange-600" },
  { name: "Theater", icon: "🎬", gradient: "from-rose-500 to-pink-600" },
];

const tiers = (base: number): PriceTier[] => [
  { id: "platinum", name: "Platinum", price: base * 3, color: "hsl(280 90% 65%)" },
  { id: "gold", name: "Gold", price: base * 2, color: "hsl(40 95% 55%)" },
  { id: "silver", name: "Silver", price: base * 1.4, color: "hsl(220 10% 70%)" },
  { id: "standard", name: "Standard", price: base, color: "hsl(150 65% 50%)" },
];

export const events: Event[] = [
  {
    id: "evt-001",
    title: "Neon Pulse — Electronic Music Festival",
    category: "Concerts",
    image: edm,
    date: "2026-06-14T20:00:00",
    venue: "Skyline Arena",
    city: "Mumbai",
    description:
      "An electrifying night with the world's top DJs delivering pulse-pounding sets across three massive stages. Expect lasers, pyrotechnics and an unforgettable crowd.",
    artists: [
      { name: "DJ Aurora", role: "Headliner" },
      { name: "Kaiser Beats", role: "Support" },
      { name: "Lyra", role: "Opening" },
    ],
    rating: 4.8,
    popularity: 98,
    trending: true,
    featured: true,
    priceTiers: tiers(1499),
    duration: "5h",
    language: "Instrumental",
  },
  {
    id: "evt-002",
    title: "Stand-Up Storm with Riley Quinn",
    category: "Comedy",
    image: comedy,
    date: "2026-05-22T21:00:00",
    venue: "The Laugh Factory",
    city: "Bengaluru",
    description:
      "Riley Quinn returns with a brand-new hour of razor-sharp observational comedy. Brutally honest, painfully relatable.",
    artists: [{ name: "Riley Quinn", role: "Comedian" }],
    rating: 4.7,
    popularity: 87,
    trending: true,
    priceTiers: tiers(799),
    duration: "1h 30m",
    language: "English",
  },
  {
    id: "evt-003",
    title: "FutureStack 2026 — Dev Conference",
    category: "Tech",
    image: tech,
    date: "2026-07-10T09:00:00",
    venue: "Convention Centre",
    city: "Bengaluru",
    description:
      "Two days of deep technical talks from engineering leaders shaping AI, infrastructure and the modern web.",
    artists: [
      { name: "Sam Patel", role: "Keynote" },
      { name: "Nora Kim", role: "Speaker" },
    ],
    rating: 4.9,
    popularity: 92,
    featured: true,
    priceTiers: tiers(2499),
    duration: "2 days",
    language: "English",
  },
  {
    id: "evt-004",
    title: "Symphony Under the Stars",
    category: "Concerts",
    image: orchestra,
    date: "2026-06-02T19:30:00",
    venue: "Royal Opera House",
    city: "Mumbai",
    description:
      "An intimate evening of romantic-era classical masterworks performed by a 60-piece orchestra.",
    artists: [{ name: "Maestro Elias Vance", role: "Conductor" }],
    rating: 4.9,
    popularity: 76,
    priceTiers: tiers(999),
    duration: "2h 15m",
    language: "Instrumental",
  },
  {
    id: "evt-005",
    title: "Watercolor Masterclass",
    category: "Workshops",
    image: workshop,
    date: "2026-05-18T10:00:00",
    venue: "Studio 27",
    city: "Pune",
    description:
      "A hands-on workshop for beginners and intermediate artists. All materials included.",
    artists: [{ name: "Aria Sen", role: "Instructor" }],
    rating: 4.6,
    popularity: 64,
    priceTiers: tiers(599),
    duration: "4h",
    language: "English",
  },
  {
    id: "evt-006",
    title: "A Midsummer Night's Dream",
    category: "Theater",
    image: theater,
    date: "2026-06-28T18:00:00",
    venue: "Prithvi Theatre",
    city: "Mumbai",
    description:
      "Shakespeare's beloved comedy reimagined with a modern twist and a stunning ensemble cast.",
    artists: [{ name: "Ensemble Cast", role: "Performers" }],
    rating: 4.5,
    popularity: 71,
    priceTiers: tiers(699),
    duration: "2h 30m",
    language: "English",
  },
  {
    id: "evt-007",
    title: "The Wildfires Live in Concert",
    category: "Concerts",
    image: rock,
    date: "2026-08-05T20:30:00",
    venue: "Echo Stadium",
    city: "Delhi",
    description:
      "Indie rock sensation The Wildfires bring their world tour to Delhi with a setlist spanning every era.",
    artists: [{ name: "The Wildfires", role: "Band" }],
    rating: 4.8,
    popularity: 95,
    trending: true,
    featured: true,
    priceTiers: tiers(1799),
    duration: "3h",
    language: "English",
  },
  {
    id: "evt-008",
    title: "City FC vs United — League Final",
    category: "Sports",
    image: sports,
    date: "2026-07-19T17:00:00",
    venue: "National Stadium",
    city: "Delhi",
    description:
      "The biggest match of the season. Two rivals, one trophy. Be there for football history.",
    artists: [{ name: "City FC", role: "Home" }, { name: "United", role: "Away" }],
    rating: 4.9,
    popularity: 99,
    trending: true,
    priceTiers: tiers(1299),
    duration: "2h",
    language: "—",
  },
];

export const cities = ["All Cities", "Mumbai", "Bengaluru", "Delhi", "Pune"];

export const getEventById = (id: string) => events.find((e) => e.id === id);
