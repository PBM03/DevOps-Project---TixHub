import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model";
import Event from "../models/Event.model";
import connectDB from "../config/database";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    
    await User.deleteMany({});
    await Event.deleteMany({});

    // Create ONLY admin user
    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    console.log("✅ Admin created: admin@example.com / admin123");

    // Create events WITHOUT any language field
    const events = [
      {
        id: "evt-001",
        title: "Neon Pulse Festival",
        category: "Concerts",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
        date: new Date("2026-06-14T20:00:00"),
        venue: "Skyline Arena",
        city: "Mumbai",
        description: "Amazing music festival",
        artists: [{ name: "DJ Aurora", role: "Headliner" }],
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
        duration: "5h"
      },
      {
        id: "evt-002",
        title: "Comedy Night",
        category: "Comedy",
        image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260",
        date: new Date("2026-05-22T21:00:00"),
        venue: "Laugh Factory",
        city: "Bengaluru",
        description: "Funny comedians",
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
        duration: "1h 30m"
      }
    ];

    await Event.insertMany(events);
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ DATABASE SEEDED SUCCESSFULLY!");
    console.log(`📊 ${events.length} events created`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 Admin Login: admin@example.com / admin123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();