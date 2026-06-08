const express = require('express');
const router = express.Router();
const {
  getPlaces, getPlace, getTrending, createPlace,
  updatePlace, deletePlace, toggleFavorite, getStats
} = require('../controllers/placesController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getPlaces);
router.get('/trending', getTrending);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/:idOrSlug', optionalAuth, getPlace);
router.post('/', protect, authorize('admin'), createPlace);
router.put('/:id', protect, authorize('admin'), updatePlace);
router.delete('/:id', protect, authorize('admin'), deletePlace);
router.post('/:id/favorite', protect, toggleFavorite);

module.exports = router;
