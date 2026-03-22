import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Feedback from '../models/Feedback.js';
import ScheduledVisit from '../models/ScheduledVisit.js';
import Notification from '../models/Notification.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pocketbite';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Feedback.deleteMany({});
    await ScheduledVisit.deleteMany({});
    await Notification.deleteMany({});

    console.log("Cleared existing data.");

    // 1. Create Admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@pocketbite.com",
      password: "password123",
      role: "admin",
      isVerified: true
    });

    // 2. Create Users
    const user1 = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user",
      preferences: {
        defaultBudgetMin: 200,
        defaultBudgetMax: 1000,
        favoriteCategories: ["local", "cafe"]
      }
    });

    // 3. Create Restaurants
    const r1 = await Restaurant.create({
      name: "Mama's Kitchen",
      description: "Authentic local dishes",
      category: "local",
      location: { address: "Ngong Road", city: "Nairobi" },
      priceRange: { min: 200, max: 800 },
      rating: { average: 4.5, count: 10 },
      isActive: true,
      addedBy: admin._id,
      menu: [
        { name: "Ugali Nyama", price: 350, category: "Lunch" },
        { name: "Pilau", price: 400, category: "Lunch" }
      ]
    });

    const r2 = await Restaurant.create({
      name: "Java House",
      description: "Great coffee and breakfast",
      category: "cafe",
      location: { address: "CBD", city: "Nairobi" },
      priceRange: { min: 500, max: 2000 },
      rating: { average: 4.2, count: 25 },
      isActive: true,
      addedBy: admin._id,
      menu: [
        { name: "Coffee", price: 300, category: "Drinks" },
        { name: "Pancakes", price: 600, category: "Breakfast" }
      ]
    });

    // 4. Create Scheduled Visit
    const visit1 = await ScheduledVisit.create({
      user: user1._id,
      restaurant: r1._id,
      visitDate: new Date(Date.now() - 86400000), // yesterday
      status: "pending_feedback",
      notificationSent: true
    });

    // 5. Create Feedback
    await Feedback.create({
      user: user1._id,
      restaurant: r1._id,
      scheduledVisit: visit1._id,
      rating: 5,
      comment: "Amazing food and service!",
      isVerifiedVisit: true
    });

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
