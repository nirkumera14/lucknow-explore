const Place = require('../models/Place');
const { Review } = require('../models/index');

// ─── Get All Places ───────────────────────────────────────────────────────────
exports.getPlaces = async (req, res) => {
  try {
    const {
      category, search, sort = '-rating',
      page = 1, limit = 12,
      trending, featured, minRating
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (trending === 'true') query.isTrending = true;
    if (featured === 'true') query.isFeatured = true;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [places, total] = await Promise.all([
      Place.find(query)
        .select('name slug description category thumbnailUrl rating reviewCount location.area location.coordinates isTrending isFeatured entryFee timings tags favoriteCount qrScans')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Place.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: places,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('getPlaces error:', err);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
};

// ─── Get Single Place ─────────────────────────────────────────────────────────
exports.getPlace = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const place = await Place.findOne({ ...query, isActive: true })
      .populate('nearbyAttractions.placeId', 'name slug thumbnailUrl rating location.area');

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    // Get recent reviews
    const reviews = await Review.find({ place: place._id })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .limit(10);

    res.json({ success: true, data: { ...place.toJSON(), reviews } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch place' });
  }
};

// ─── Get Trending Places ─────────────────────────────────────────────────────
exports.getTrending = async (req, res) => {
  try {
    const places = await Place.find({ isActive: true, isTrending: true })
      .select('name slug thumbnailUrl rating category location.area favoriteCount')
      .sort('-rating -favoriteCount')
      .limit(8);

    res.json({ success: true, data: places });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending places' });
  }
};

// ─── Create Place (Admin) ─────────────────────────────────────────────────────
exports.createPlace = async (req, res) => {
  try {
    const placeData = { ...req.body, createdBy: req.user._id };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      placeData.images = req.files.map((file, idx) => ({
        url: `/uploads/places/${file.filename}`,
        isPrimary: idx === 0
      }));
      placeData.thumbnailUrl = placeData.images[0].url;
    }

    const place = await Place.create(placeData);
    res.status(201).json({ success: true, message: 'Place created successfully!', data: place });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A place with this name already exists' });
    }
    console.error('createPlace error:', err);
    res.status(500).json({ error: 'Failed to create place' });
  }
};

// ─── Update Place (Admin) ─────────────────────────────────────────────────────
exports.updatePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.json({ success: true, message: 'Place updated!', data: place });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update place' });
  }
};

// ─── Delete Place (Admin) ─────────────────────────────────────────────────────
exports.deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: 'Place not found' });

    // Soft delete
    place.isActive = false;
    await place.save();

    res.json({ success: true, message: 'Place removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete place' });
  }
};

// ─── Toggle Favorite ─────────────────────────────────────────────────────────
exports.toggleFavorite = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: 'Place not found' });

    const userId = req.user._id;
    const isFavorited = place.favoritedBy.includes(userId);

    if (isFavorited) {
      place.favoritedBy.pull(userId);
      place.favoriteCount = Math.max(0, place.favoriteCount - 1);
    } else {
      place.favoritedBy.push(userId);
      place.favoriteCount += 1;
    }

    await place.save();

    // Also update user's favorites array
    const User = require('../models/User');
    if (isFavorited) {
      await User.findByIdAndUpdate(userId, { $pull: { favorites: place._id } });
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { favorites: place._id } });
    }

    res.json({
      success: true,
      isFavorited: !isFavorited,
      favoriteCount: place.favoriteCount,
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites!'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update favorite' });
  }
};

// ─── Get Stats (Admin) ───────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [total, byCategory, topRated] = await Promise.all([
      Place.countDocuments({ isActive: true }),
      Place.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
      ]),
      Place.find({ isActive: true }).select('name rating reviewCount').sort('-rating').limit(5)
    ]);

    res.json({ success: true, data: { total, byCategory, topRated } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
