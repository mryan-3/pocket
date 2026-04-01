import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Feedback from '../models/Feedback.js';
import ScheduledVisit from '../models/ScheduledVisit.js';
import Notification from '../models/Notification.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pocketbite';

const defaultOpeningHours = {
  monday: { open: "08:00", close: "21:00" },
  tuesday: { open: "08:00", close: "21:00" },
  wednesday: { open: "08:00", close: "21:00" },
  thursday: { open: "08:00", close: "21:00" },
  friday: { open: "08:00", close: "22:00" },
  saturday: { open: "09:00", close: "22:00" },
  sunday: { open: "09:00", close: "20:00" }
};

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
    const users = await User.create([
      { name: "John Doe", email: "john@example.com", password: "password123", role: "user" },
      { name: "Jane Smith", email: "jane@example.com", password: "password123", role: "user" },
      { name: "Mike Ross", email: "mike@example.com", password: "password123", role: "user" },
      { name: "Rachel Zane", email: "rachel@example.com", password: "password123", role: "user" },
      { name: "Harvey Specter", email: "harvey@example.com", password: "password123", role: "user" }
    ]);

    // 3. Create Restaurants
    const restaurantData = [
      {
        name: "Mama's Kitchen",
        description: "Authentic local dishes with a touch of home-cooked love. Famous for the best Ugali in town.",
        category: "local",
        location: { address: "Ngong Road", city: "Nairobi" },
        priceRange: { min: 200, max: 800 },
        rating: { average: 4.5, count: 12 },
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 712 345678", website: "https://mamaskitchen.co.ke" },
        openingHours: defaultOpeningHours,
        menu: [
            { name: "Ugali Nyama", price: 350, category: "Lunch" },
            { name: "Tilapia Fish", price: 650, category: "Lunch" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "Java House",
        description: "Your favorite neighborhood coffee spot. Great coffee, better conversations.",
        category: "cafe",
        location: { address: "CBD - Kimathi Street", city: "Nairobi" },
        priceRange: { min: 400, max: 2500 },
        rating: { average: 4.2, count: 45 },
        images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 722 000111", website: "https://javahouseafrica.com" },
        openingHours: defaultOpeningHours,
        menu: [
            { name: "Caffe Latte", price: 350, category: "Drinks" },
            { name: "Java Burger", price: 950, category: "Main" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "The Terrace",
        description: "Elegant formal dining with a view of the city skyline. Perfect for business meetings.",
        category: "formal",
        location: { address: "Westlands", city: "Nairobi" },
        priceRange: { min: 1500, max: 5000 },
        rating: { average: 4.8, count: 28 },
        images: ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 733 999888", website: "https://theterrace.co.ke" },
        openingHours: { ...defaultOpeningHours, sunday: { open: "11:00", close: "22:00" } },
        menu: [
            { name: "Grilled Sirloin", price: 2800, category: "Main" },
            { name: "Wine Pairing", price: 1500, category: "Drinks" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "Urban Burger",
        description: "Fast, fresh, and gourmet burgers. The ultimate cheat meal destination.",
        category: "fast-food",
        location: { address: "The Hub Karen", city: "Nairobi" },
        priceRange: { min: 600, max: 1800 },
        rating: { average: 4.4, count: 62 },
        images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 700 111222", website: "https://urbanburger.co.ke" },
        openingHours: defaultOpeningHours,
        menu: [
            { name: "Double Cheese", price: 1100, category: "Main" },
            { name: "Loaded Fries", price: 450, category: "Sides" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "Oceanic Seafood",
        description: "The freshest catch from the coast, served right in the heart of the city.",
        category: "high-end",
        location: { address: "Kilimani", city: "Nairobi" },
        priceRange: { min: 3000, max: 12000 },
        rating: { average: 4.9, count: 15 },
        images: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 711 555444", website: "https://oceanic.co.ke" },
        openingHours: { ...defaultOpeningHours, monday: { open: "12:00", close: "23:00" } },
        menu: [
            { name: "Lobster Thermidor", price: 8500, category: "Main" },
            { name: "Oysters (Dozen)", price: 3200, category: "Appetizer" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "Saffron Spices",
        description: "A journey through the aromatic world of authentic Indian cuisine.",
        category: "formal",
        location: { address: "Parklands", city: "Nairobi" },
        priceRange: { min: 1200, max: 4500 },
        rating: { average: 4.6, count: 34 },
        images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 722 333444", website: "https://saffron.co.ke" },
        openingHours: defaultOpeningHours,
        menu: [
            { name: "Butter Chicken", price: 1450, category: "Main" },
            { name: "Garlic Naan", price: 250, category: "Sides" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "Bite & Go",
        description: "Convenient, quick, and surprisingly delicious. For the foodie on the move.",
        category: "fast-food",
        location: { address: "Upper Hill", city: "Nairobi" },
        priceRange: { min: 150, max: 600 },
        rating: { average: 3.8, count: 120 },
        images: ["https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 788 111000", website: "https://biteandgo.com" },
        openingHours: { ...defaultOpeningHours, saturday: { open: "07:00", close: "23:00" } },
        menu: [
            { name: "Chicken Wrap", price: 450, category: "Main" },
            { name: "Soda", price: 100, category: "Drinks" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "The Green Bean",
        description: "Vegan-friendly cafe specializing in organic bowls and cold-pressed juices.",
        category: "cafe",
        location: { address: "Gigiri", city: "Nairobi" },
        priceRange: { min: 800, max: 2200 },
        rating: { average: 4.7, count: 18 },
        images: ["https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 700 999888", website: "https://greenbean.co.ke" },
        openingHours: defaultOpeningHours,
        menu: [
            { name: "Buddha Bowl", price: 1200, category: "Main" },
            { name: "Green Detox", price: 650, category: "Drinks" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "Skyview Lounge",
        description: "High-end lounge experience with curated cocktails and small plates.",
        category: "high-end",
        location: { address: "Two Rivers", city: "Nairobi" },
        priceRange: { min: 2500, max: 9000 },
        rating: { average: 4.5, count: 54 },
        images: ["https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 755 000111", website: "https://skyview.lounge" },
        openingHours: { ...defaultOpeningHours, friday: { open: "14:00", close: "02:00" }, saturday: { open: "14:00", close: "02:00" } },
        menu: [
            { name: "Wagyu Sliders", price: 3200, category: "Appetizer" },
            { name: "Old Fashioned", price: 1400, category: "Drinks" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "Nyama Choma Base",
        description: "The quintessential Kenyan barbecue experience. Best served with cold beer and friends.",
        category: "local",
        location: { address: "Langata Road", city: "Nairobi" },
        priceRange: { min: 400, max: 1500 },
        rating: { average: 4.3, count: 88 },
        images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 744 888777", website: "https://nyamachomabase.co.ke" },
        openingHours: defaultOpeningHours,
        menu: [
            { name: "Goat Meat (kg)", price: 1200, category: "Main" },
            { name: "Kachumbari", price: 150, category: "Sides" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "Pasta Paradiso",
        description: "Handmade pasta and wood-fired pizzas in a cozy, rustic setting.",
        category: "formal",
        location: { address: "Village Market", city: "Nairobi" },
        priceRange: { min: 1100, max: 3500 },
        rating: { average: 4.4, count: 42 },
        images: ["https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 766 555222", website: "https://pasta.paradiso" },
        openingHours: defaultOpeningHours,
        menu: [
            { name: "Truffle Tagliatelle", price: 1850, category: "Main" },
            { name: "Margherita", price: 1200, category: "Main" }
        ],
        isActive: true,
        addedBy: admin._id
      },
      {
        name: "Sunrise Bakery",
        description: "Freshly baked bread, pastries, and the best almond croissants in the city.",
        category: "cafe",
        location: { address: "Lavington", city: "Nairobi" },
        priceRange: { min: 200, max: 1200 },
        rating: { average: 4.8, count: 31 },
        images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"],
        contactInfo: { phone: "+254 777 444333", website: "https://sunrisebakery.co.ke" },
        openingHours: { ...defaultOpeningHours, sunday: { open: "06:00", close: "18:00" } },
        menu: [
            { name: "Almond Croissant", price: 350, category: "Breakfast" },
            { name: "Sourdough Loaf", price: 500, category: "Bakery" }
        ],
        isActive: true,
        addedBy: admin._id
      }
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurantData);
    console.log(`Seeded ${createdRestaurants.length} restaurants.`);

    // 4. Create some Scheduled Visits
    const visits = [
      {
        user: users[0]._id,
        restaurant: createdRestaurants[0]._id,
        visitDate: new Date(Date.now() - 86400000), // yesterday
        status: "pending_feedback",
        notificationSent: true,
        notes: "Anniversary dinner"
      },
      {
        user: users[0]._id,
        restaurant: createdRestaurants[1]._id,
        visitDate: new Date(Date.now() + 86400000 * 2), // in 2 days
        status: "upcoming",
        notes: "Business brunch"
      },
      {
        user: users[1]._id,
        restaurant: createdRestaurants[2]._id,
        visitDate: new Date(Date.now() - 86400000 * 3), // 3 days ago
        status: "completed"
      }
    ];

    const createdVisits = await ScheduledVisit.insertMany(visits);

    // 5. Create some Feedback
    await Feedback.create([
      {
        user: users[1]._id,
        restaurant: createdRestaurants[2]._id,
        scheduledVisit: createdVisits[2]._id,
        rating: 5,
        comment: "Excellent service and the steak was cooked to perfection!",
        isVerifiedVisit: true
      },
      {
        user: users[2]._id,
        restaurant: createdRestaurants[0]._id,
        rating: 4,
        comment: "Good local food, wait time was a bit long though.",
        isVerifiedVisit: false
      }
    ]);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
