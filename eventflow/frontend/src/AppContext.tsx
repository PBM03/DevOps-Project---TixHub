import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// ==================== TYPES ====================

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Booking {
  id: string;
  eventId: string;
  seats: string[];
  tier: string;
  total: number;
  date: string;
  status: "confirmed" | "cancelled" | "pending";
  paymentMethod: string;
}

export interface PriceTier {
  id: string;
  name: string;
  price: number;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  category: string;
  image: string;
  date: string;
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

interface AppState {
  user: User | null;
  wishlist: string[];
  recentlyViewed: string[];
  bookings: Booking[];
  events: Event[];
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  // Auth methods
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  
  // Booking methods
  addBooking: (booking: Omit<Booking, "id" | "date" | "status">) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  
  // Event methods
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<Event | null>;
  
  // Wishlist methods
  toggleWishlist: (eventId: string) => void;
  addRecentlyViewed: (eventId: string) => void;
  
  // Admin methods
  createEvent: (eventData: Partial<Event>) => Promise<Event>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  updateUserRole: (userId: string, role: "user" | "admin") => Promise<void>;
  
  // Utility
  clearError: () => void;
}

// ==================== API CONFIGURATION ====================

// Toggle this to switch between mock API and real backend
const USE_REAL_API = true; // Set to true when backend is ready

// Real API client (for when backend is ready)
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Add token to requests if using real API
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && USE_REAL_API) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== MOCK DATA ====================

const MOCK_EVENTS: Event[] = [
  {
    id: "evt-001",
    title: "Neon Pulse — Electronic Music Festival",
    category: "Concerts",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    date: "2026-06-14T20:00:00",
    venue: "Skyline Arena",
    city: "Mumbai",
    description: "An electrifying night with the world's top DJs delivering pulse-pounding sets across three massive stages.",
    artists: [{ name: "DJ Aurora", role: "Headliner" }, { name: "Kaiser Beats", role: "Support" }],
    rating: 4.8,
    popularity: 98,
    trending: true,
    featured: true,
    priceTiers: [
      { id: "platinum", name: "Platinum", price: 4497, color: "#a855f7" },
      { id: "gold", name: "Gold", price: 2998, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 2099, color: "#94a3b8" },
      { id: "standard", name: "Standard", price: 1499, color: "#22c55e" },
    ],
    duration: "5h",
    language: "Instrumental",
  },
  {
    id: "evt-002",
    title: "Stand-Up Storm with Riley Quinn",
    category: "Comedy",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260",
    date: "2026-05-22T21:00:00",
    venue: "The Laugh Factory",
    city: "Bengaluru",
    description: "Riley Quinn returns with a brand-new hour of razor-sharp observational comedy.",
    artists: [{ name: "Riley Quinn", role: "Comedian" }],
    rating: 4.7,
    popularity: 87,
    trending: true,
    featured: false,
    priceTiers: [
      { id: "platinum", name: "Platinum", price: 2397, color: "#a855f7" },
      { id: "gold", name: "Gold", price: 1598, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 1119, color: "#94a3b8" },
      { id: "standard", name: "Standard", price: 799, color: "#22c55e" },
    ],
    duration: "1h 30m",
    language: "English",
  },
  {
    id: "evt-003",
    title: "FutureStack 2026 — Dev Conference",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    date: "2026-07-10T09:00:00",
    venue: "Convention Centre",
    city: "Bengaluru",
    description: "Two days of deep technical talks from engineering leaders shaping AI.",
    artists: [{ name: "Sam Patel", role: "Keynote" }, { name: "Nora Kim", role: "Speaker" }],
    rating: 4.9,
    popularity: 92,
    trending: false,
    featured: true,
    priceTiers: [
      { id: "platinum", name: "Platinum", price: 7497, color: "#a855f7" },
      { id: "gold", name: "Gold", price: 4998, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 3499, color: "#94a3b8" },
      { id: "standard", name: "Standard", price: 2499, color: "#22c55e" },
    ],
    duration: "2 days",
    language: "English",
  },
  {
    id: "evt-004",
    title: "Symphony Under the Stars",
    category: "Concerts",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf",
    date: "2026-06-02T19:30:00",
    venue: "Royal Opera House",
    city: "Mumbai",
    description: "An intimate evening of romantic-era classical masterworks.",
    artists: [{ name: "Maestro Elias Vance", role: "Conductor" }],
    rating: 4.9,
    popularity: 76,
    trending: false,
    featured: false,
    priceTiers: [
      { id: "platinum", name: "Platinum", price: 2997, color: "#a855f7" },
      { id: "gold", name: "Gold", price: 1998, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 1399, color: "#94a3b8" },
      { id: "standard", name: "Standard", price: 999, color: "#22c55e" },
    ],
    duration: "2h 15m",
    language: "Instrumental",
  },
  {
    id: "evt-005",
    title: "Watercolor Masterclass",
    category: "Workshops",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
    date: "2026-05-18T10:00:00",
    venue: "Studio 27",
    city: "Pune",
    description: "A hands-on workshop for beginners and intermediate artists.",
    artists: [{ name: "Aria Sen", role: "Instructor" }],
    rating: 4.6,
    popularity: 64,
    trending: false,
    featured: false,
    priceTiers: [
      { id: "platinum", name: "Platinum", price: 1797, color: "#a855f7" },
      { id: "gold", name: "Gold", price: 1198, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 839, color: "#94a3b8" },
      { id: "standard", name: "Standard", price: 599, color: "#22c55e" },
    ],
    duration: "4h",
    language: "English",
  },
  {
    id: "evt-006",
    title: "A Midsummer Night's Dream",
    category: "Theater",
    image: "https://images.unsplash.com/photo-1503095396549-8070f2dd257b",
    date: "2026-06-28T18:00:00",
    venue: "Prithvi Theatre",
    city: "Mumbai",
    description: "Shakespeare's beloved comedy reimagined with a modern twist.",
    artists: [{ name: "Ensemble Cast", role: "Performers" }],
    rating: 4.5,
    popularity: 71,
    trending: false,
    featured: false,
    priceTiers: [
      { id: "platinum", name: "Platinum", price: 2097, color: "#a855f7" },
      { id: "gold", name: "Gold", price: 1398, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 979, color: "#94a3b8" },
      { id: "standard", name: "Standard", price: 699, color: "#22c55e" },
    ],
    duration: "2h 30m",
    language: "English",
  },
];

// ==================== LOCALSTORAGE KEYS ====================

const STORAGE_KEYS = {
  USER: "tixhub-user",
  WISHLIST: "tixhub-wishlist",
  RECENTLY_VIEWED: "tixhub-recently-viewed",
  BOOKINGS: "tixhub-bookings",
  TOKEN: "token",
};

// ==================== HELPER FUNCTIONS ====================

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Generate random booking ID
const generateBookingId = () => {
  return "TIX-" + Math.random().toString(36).slice(2, 8).toUpperCase();
};

// ==================== MOCK API FUNCTIONS ====================

const mockLogin = async (email: string, password: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const isAdmin = email.toLowerCase().startsWith("admin");
  const user: User = {
    id: "u-" + Date.now(),
    name: isAdmin ? "Admin User" : email.split("@")[0],
    email: email,
    role: isAdmin ? "admin" : "user",
  };
  
  saveToStorage(STORAGE_KEYS.USER, user);
  return user;
};

const mockSignup = async (name: string, email: string, password: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const user: User = {
    id: "u-" + Date.now(),
    name: name,
    email: email,
    role: email.startsWith("admin") ? "admin" : "user",
  };
  
  saveToStorage(STORAGE_KEYS.USER, user);
  return user;
};

const mockCreateBooking = async (bookingData: any): Promise<Booking> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const booking: Booking = {
    id: generateBookingId(),
    eventId: bookingData.eventId,
    seats: bookingData.seats,
    tier: bookingData.tier,
    total: bookingData.total,
    date: new Date().toISOString(),
    status: "confirmed",
    paymentMethod: bookingData.paymentMethod,
  };
  
  return booking;
};

const mockCancelBooking = async (bookingId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Just simulate success
};

const mockFetchEvents = async (): Promise<Event[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_EVENTS;
};

const mockFetchEventById = async (id: string): Promise<Event | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_EVENTS.find((e) => e.id === id) || null;
};

const mockCreateEvent = async (eventData: Partial<Event>): Promise<Event> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newEvent: Event = {
    id: "evt-" + Date.now(),
    title: eventData.title || "New Event",
    category: eventData.category || "Workshops",
    image: eventData.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    date: eventData.date || new Date().toISOString(),
    venue: eventData.venue || "TBD",
    city: eventData.city || "Mumbai",
    description: eventData.description || "Event description",
    artists: eventData.artists || [{ name: "Artist", role: "Performer" }],
    rating: 4.5,
    popularity: 50,
    trending: false,
    featured: false,
    priceTiers: eventData.priceTiers || [
      { id: "standard", name: "Standard", price: 999, color: "#22c55e" },
    ],
    duration: eventData.duration || "2h",
    language: eventData.language || "English",
  };
  return newEvent;
};

// ==================== CONTEXT PROVIDER ====================

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    user: loadFromStorage(STORAGE_KEYS.USER, null),
    wishlist: loadFromStorage(STORAGE_KEYS.WISHLIST, []),
    recentlyViewed: loadFromStorage(STORAGE_KEYS.RECENTLY_VIEWED, []),
    bookings: loadFromStorage(STORAGE_KEYS.BOOKINGS, []),
    events: MOCK_EVENTS,
    loading: false,
    error: null,
  });

  // Persist state to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER, state.user);
    saveToStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
    saveToStorage(STORAGE_KEYS.RECENTLY_VIEWED, state.recentlyViewed);
    saveToStorage(STORAGE_KEYS.BOOKINGS, state.bookings);
  }, [state.user, state.wishlist, state.recentlyViewed, state.bookings]);

  // ==================== AUTH METHODS ====================

  const login = async (email: string, password: string): Promise<User> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const user = USE_REAL_API 
        ? (await apiClient.post("/auth/login", { email, password })).data.data.user
        : await mockLogin(email, password);
      
      setState((prev) => ({ ...prev, user, loading: false }));
      return user;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Login failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<User> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const user = USE_REAL_API
        ? (await apiClient.post("/auth/register", { name, email, password })).data.data.user
        : await mockSignup(name, email, password);
      
      setState((prev) => ({ ...prev, user, loading: false }));
      return user;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Signup failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setState((prev) => ({ ...prev, user: null, wishlist: [], recentlyViewed: [], bookings: [] }));
  };

  // ==================== BOOKING METHODS ====================

  const addBooking = async (bookingData: Omit<Booking, "id" | "date" | "status">): Promise<Booking> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const booking = USE_REAL_API
        ? (await apiClient.post("/bookings", bookingData)).data.data.booking
        : await mockCreateBooking(bookingData);
      
      setState((prev) => ({
        ...prev,
        bookings: [booking, ...prev.bookings],
        loading: false,
      }));
      return booking;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Booking failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }
  };

  const cancelBooking = async (id: string): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      if (USE_REAL_API) {
        await apiClient.put(`/bookings/${id}/cancel`);
      } else {
        await mockCancelBooking(id);
      }
      
      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === id ? { ...b, status: "cancelled" } : b
        ),
        loading: false,
      }));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Cancellation failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }
  };

  // ==================== EVENT METHODS ====================

  const fetchEvents = async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const events = USE_REAL_API
        ? (await apiClient.get("/events")).data.data
        : await mockFetchEvents();
      
      setState((prev) => ({ ...prev, events, loading: false }));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to fetch events";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
    }
  };

  const fetchEventById = async (id: string): Promise<Event | null> => {
    try {
      const event = USE_REAL_API
        ? (await apiClient.get(`/events/${id}`)).data.data
        : await mockFetchEventById(id);
      return event;
    } catch (error) {
      return null;
    }
  };

  const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const newEvent = USE_REAL_API
        ? (await apiClient.post("/events", eventData)).data.data
        : await mockCreateEvent(eventData);
      
      setState((prev) => ({
        ...prev,
        events: [newEvent, ...prev.events],
        loading: false,
      }));
      return newEvent;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to create event";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const updatedEvent = USE_REAL_API
        ? (await apiClient.put(`/events/${id}`, eventData)).data.data
        : { ...state.events.find((e) => e.id === id), ...eventData } as Event;
      
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) => (e.id === id ? updatedEvent : e)),
        loading: false,
      }));
      return updatedEvent;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to update event";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }
  };

  const deleteEvent = async (id: string): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      if (USE_REAL_API) {
        await apiClient.delete(`/events/${id}`);
      }
      
      setState((prev) => ({
        ...prev,
        events: prev.events.filter((e) => e.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to delete event";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }
  };

  // ==================== ADMIN METHODS ====================

  const getAllUsers = async (): Promise<User[]> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const users = USE_REAL_API
        ? (await apiClient.get("/admin/users")).data.data
        : [state.user].filter(Boolean);
      
      setState((prev) => ({ ...prev, loading: false }));
      return users;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to fetch users";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }
  };

  const updateUserRole = async (userId: string, role: "user" | "admin"): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      if (USE_REAL_API) {
        await apiClient.put(`/admin/users/${userId}/role`, { role });
      }
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to update user role";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }
  };

  // ==================== WISHLIST & RECENTLY VIEWED ====================

  const toggleWishlist = (eventId: string) => {
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.includes(eventId)
        ? prev.wishlist.filter((id) => id !== eventId)
        : [...prev.wishlist, eventId],
    }));
  };

  const addRecentlyViewed = (eventId: string) => {
    setState((prev) => ({
      ...prev,
      recentlyViewed: [eventId, ...prev.recentlyViewed.filter((id) => id !== eventId)].slice(0, 6),
    }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const value: AppContextType = {
    ...state,
    login,
    signup,
    logout,
    addBooking,
    cancelBooking,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllUsers,
    updateUserRole,
    toggleWishlist,
    addRecentlyViewed,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ==================== CUSTOM HOOK ====================

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;