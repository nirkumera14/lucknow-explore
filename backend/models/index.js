const mongoose = require('mongoose');

// ─── Review Model ─────────────────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, maxlength: 100 },
  comment: { type: String, required: true, maxlength: 1000 },
  images: [{ type: String }], // ADD REVIEW IMAGES HERE
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likeCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  visitDate: { type: Date },
}, { timestamps: true });

reviewSchema.index({ place: 1, user: 1 }, { unique: true });
reviewSchema.index({ place: 1, createdAt: -1 });

// ─── Event Model ─────────────────────────────────────────────────────────────
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 2000 },
  category: {
    type: String,
    enum: ['cultural', 'food', 'music', 'exhibition', 'festival', 'sports', 'religious'],
    required: true
  },
  // ADD EVENT BANNER HERE - upload real event banners via admin
  bannerUrl: { type: String, default: '/assets/placeholders/event-placeholder.jpg' },
  images: [{ type: String }],
  venue: {
    name: { type: String, required: true },
    address: { type: String },
    coordinates: { lat: Number, lng: Number }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  timing: { type: String }, // e.g. "10:00 AM - 8:00 PM"
  entryFee: { type: Number, default: 0 },
  organizer: { type: String },
  contactInfo: { phone: String, email: String, website: String },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  registrationUrl: { type: String },
  maxAttendees: { type: Number },
  currentAttendees: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

eventSchema.index({ startDate: 1, category: 1 });
eventSchema.index({ isFeatured: 1, isActive: 1 });

// ─── Hotel Model ─────────────────────────────────────────────────────────────
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 1000 },
  category: { type: String, enum: ['budget', 'mid-range', 'luxury', 'boutique'], default: 'mid-range' },
  starRating: { type: Number, min: 1, max: 5, default: 3 },
  // ADD HOTEL IMAGE HERE - 800x500px recommended
  thumbnailUrl: { type: String, default: '/assets/placeholders/hotel-placeholder.jpg' },
  images: [{ type: String }],
  location: {
    address: { type: String, required: true },
    area: { type: String },
    coordinates: { lat: Number, lng: Number }
  },
  amenities: [{ type: String }], // e.g. ['WiFi', 'Pool', 'Gym', 'Spa']
  priceRange: { min: Number, max: Number, currency: { type: String, default: 'INR' } },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  contact: { phone: String, email: String, website: String },
  bookingUrl: { type: String },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// ─── Restaurant Model ─────────────────────────────────────────────────────────
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 1000 },
  cuisine: [{ type: String }], // e.g. ['Awadhi', 'Mughlai', 'North Indian']
  category: { type: String, enum: ['fine-dining', 'casual', 'street-food', 'cafe', 'buffet'], default: 'casual' },
  // ADD RESTAURANT IMAGE HERE - 800x500px recommended
  thumbnailUrl: { type: String, default: '/assets/placeholders/restaurant-placeholder.jpg' },
  images: [{ type: String }],
  location: {
    address: { type: String, required: true },
    area: { type: String },
    coordinates: { lat: Number, lng: Number }
  },
  timings: { open: String, close: String, closedOn: [String] },
  priceForTwo: { type: Number }, // avg price for 2 in INR
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  specialDishes: [{ type: String }],
  contact: { phone: String, email: String },
  features: [{ type: String }], // e.g. ['Home Delivery', 'Dine-in', 'Takeaway']
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// ─── Food Item Model ─────────────────────────────────────────────────────────
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 1000 },
  history: { type: String, maxlength: 2000 },
  // ADD FOOD IMAGE HERE - 600x400px recommended
  imageUrl: { type: String, default: '/assets/placeholders/food-placeholder.jpg' },
  category: { type: String, enum: ['kebab', 'biryani', 'chaat', 'sweets', 'drinks', 'bread', 'dessert'] },
  isVegetarian: { type: Boolean, default: false },
  spiceLevel: { type: String, enum: ['mild', 'medium', 'spicy', 'very-spicy'], default: 'medium' },
  bestPlaces: [{ name: String, address: String }], // Where to find this food
  averagePrice: { type: Number },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// ─── QR Scan Model ───────────────────────────────────────────────────────────
const qrScanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  scanType: { type: String, enum: ['entry', 'explore', 'stamp'], default: 'explore' },
  deviceInfo: { type: String },
  ipAddress: { type: String },
  location: { lat: Number, lng: Number },
}, { timestamps: true });

qrScanSchema.index({ user: 1, createdAt: -1 });
qrScanSchema.index({ place: 1, createdAt: -1 });

module.exports = {
  Review: mongoose.model('Review', reviewSchema),
  Event: mongoose.model('Event', eventSchema),
  Hotel: mongoose.model('Hotel', hotelSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Food: mongoose.model('Food', foodSchema),
  QRScan: mongoose.model('QRScan', qrScanSchema),
};
