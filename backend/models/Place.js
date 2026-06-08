const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  history: {
    type: String,
    maxlength: [5000, 'History cannot exceed 5000 characters']
  },
  category: {
    type: String,
    enum: ['historical', 'religious', 'park', 'shopping', 'entertainment', 'cultural', 'nature', 'food'],
    required: true
  },

  // ─── Images ─────────────────────────────────────────────────────────────────
  // ADD PLACE IMAGE HERE - Upload real images via admin panel
  // Image paths are stored as relative paths from /uploads/places/ directory
  // Example: "/uploads/places/bara-imambara-main.jpg"
  images: [{
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  thumbnailUrl: {
    type: String,
    default: '/assets/placeholders/place-placeholder.jpg'
    // ADD THUMBNAIL IMAGE HERE - 400x300px recommended
  },

  // ─── Location ────────────────────────────────────────────────────────────────
  location: {
    address: { type: String, required: true },
    area: { type: String },
    city: { type: String, default: 'Lucknow' },
    state: { type: String, default: 'Uttar Pradesh' },
    pincode: { type: String },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },

  // ─── Timings ─────────────────────────────────────────────────────────────────
  timings: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' },
    closedOn: [{ type: String }],
    notes: { type: String }
  },

  // ─── Entry Fee ───────────────────────────────────────────────────────────────
  entryFee: {
    indian: { type: Number, default: 0 },
    foreigner: { type: Number, default: 0 },
    child: { type: Number, default: 0 },
    notes: { type: String }
  },

  // ─── Ratings & Reviews ───────────────────────────────────────────────────────
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },

  // ─── Nearby ──────────────────────────────────────────────────────────────────
  nearbyAttractions: [{
    name: String,
    distance: String,
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' }
  }],

  // ─── Tags & Metadata ─────────────────────────────────────────────────────────
  tags: [{ type: String }],
  isTrending: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  visitDuration: { type: String, default: '1-2 hours' },
  bestTimeToVisit: { type: String },
  tips: [{ type: String }],

  // ─── QR Code ─────────────────────────────────────────────────────────────────
  qrCode: { type: String, default: null }, // Base64 QR image
  qrScans: { type: Number, default: 0 },

  // ─── Social ──────────────────────────────────────────────────────────────────
  favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  favoriteCount: { type: Number, default: 0 },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// ─── Auto-generate slug ──────────────────────────────────────────────────────
placeSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// ─── Virtual for reviews ─────────────────────────────────────────────────────
placeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'place'
});

placeSchema.set('toJSON', { virtuals: true });
placeSchema.set('toObject', { virtuals: true });

// ─── Indexes ─────────────────────────────────────────────────────────────────
placeSchema.index({ name: 'text', description: 'text', tags: 'text' });
placeSchema.index({ 'location.coordinates': '2dsphere' });
placeSchema.index({ category: 1, rating: -1 });
placeSchema.index({ isTrending: 1, isFeatured: 1 });

module.exports = mongoose.model('Place', placeSchema);
