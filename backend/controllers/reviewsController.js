const { Review } = require('../models/index');
const Place = require('../models/Place');

// ─── Get Reviews for a Place ──────────────────────────────────────────────────
exports.getReviews = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ place: placeId })
        .populate('user', 'name avatar city')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ place: placeId })
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// ─── Add Review ───────────────────────────────────────────────────────────────
exports.addReview = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { rating, title, comment, visitDate } = req.body;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ error: 'Place not found' });

    const existing = await Review.findOne({ user: req.user._id, place: placeId });
    if (existing) return res.status(400).json({ error: 'You have already reviewed this place' });

    const review = await Review.create({
      user: req.user._id,
      place: placeId,
      rating: parseInt(rating),
      title, comment, visitDate
    });

    // Recalculate place rating
    const allReviews = await Review.find({ place: placeId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await Place.findByIdAndUpdate(placeId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    const populated = await review.populate('user', 'name avatar city');
    res.status(201).json({ success: true, message: 'Review added!', data: populated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// ─── Update Review ────────────────────────────────────────────────────────────
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { rating, title, comment } = req.body;
    if (rating) review.rating = parseInt(rating);
    if (title) review.title = title;
    if (comment) review.comment = comment;
    await review.save();

    // Recalculate rating
    const allReviews = await Review.find({ place: review.place });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await Place.findByIdAndUpdate(review.place, { rating: Math.round(avgRating * 10) / 10 });

    res.json({ success: true, message: 'Review updated!', data: review });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// ─── Delete Review ────────────────────────────────────────────────────────────
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await review.deleteOne();

    const allReviews = await Review.find({ place: review.place });
    const avgRating = allReviews.length
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
      : 0;
    await Place.findByIdAndUpdate(review.place, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

// ─── Like a Review ────────────────────────────────────────────────────────────
exports.likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    const isLiked = review.likes.includes(req.user._id);
    if (isLiked) {
      review.likes.pull(req.user._id);
      review.likeCount = Math.max(0, review.likeCount - 1);
    } else {
      review.likes.push(req.user._id);
      review.likeCount += 1;
    }
    await review.save();

    res.json({ success: true, isLiked: !isLiked, likeCount: review.likeCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like review' });
  }
};
