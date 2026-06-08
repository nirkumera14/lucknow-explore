// routes/reviews.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { getReviews, addReview, updateReview, deleteReview, likeReview } = require('../controllers/reviewsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getReviews);
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/like', protect, likeReview);

module.exports = router;
