import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true },
  category: { type: String, trim: true }, // e.g. "Breakfast", "Lunch", "Drinks"
  isAvailable: { type: Boolean, default: true },
})

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['local', 'formal', 'high-end', 'cafe', 'fast-food', 'other'],
      required: [true, 'Category is required'],
    },
    location: {
      address: { type: String, trim: true },
      city: { type: String, trim: true, default: 'Nairobi' },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    priceRange: {
      min: { type: Number, required: true }, // lowest price on menu
      max: { type: Number, required: true }, // highest price on menu
    },
    menu: [menuItemSchema],
    images: [{ type: String }], // URLs
    contactInfo: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // admin who added it
    },
  },
  { timestamps: true },
)

// Index for filtering by category and price
restaurantSchema.index({
  category: 1,
  'priceRange.min': 1,
  'priceRange.max': 1,
})
restaurantSchema.index({ 'rating.average': -1 })
restaurantSchema.index({ isActive: 1 })

const Restaurant = mongoose.model('Restaurant', restaurantSchema)
export default Restaurant
