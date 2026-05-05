import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import Event from '../models/Event.model';
import connectDB from '../config/database';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log('✅ Users seeded');
    console.log('Admin Email: admin@example.com, Password: admin123');
    console.log('User Email: user@example.com, Password: user123');

    // Create sample events (you can expand this)
    const events = [
      {
        id: 'evt-001',
        title: 'Neon Pulse — Electronic Music Festival',
        category: 'Concerts',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
        date: new Date('2026-06-14T20:00:00'),
        venue: 'Skyline Arena',
        city: 'Mumbai',
        description: 'An electrifying night with the world\'s top DJs.',
        artists: [{ name: 'DJ Aurora', role: 'Headliner' }],
        rating: 4.8,
        popularity: 98,
        trending: true,
        featured: true,
        priceTiers: [
          { id: 'platinum', name: 'Platinum', price: 4497, color: 'hsl(280 90% 65%)' },
          { id: 'gold', name: 'Gold', price: 2998, color: 'hsl(40 95% 55%)' },
          { id: 'silver', name: 'Silver', price: 2099, color: 'hsl(220 10% 70%)' },
          { id: 'standard', name: 'Standard', price: 1499, color: 'hsl(150 65% 50%)' },
        ],
        duration: '5h',
        language: 'Instrumental',
      },
    ];

    await Event.insertMany(events);
    console.log('✅ Events seeded');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();